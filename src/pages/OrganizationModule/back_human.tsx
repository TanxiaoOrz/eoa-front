import { FolderOpenTwoTone, PlusOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns, ProFormText, ProFormTreeSelect, ProTable } from '@ant-design/pro-components';
import { Button, Form, Layout, Typography } from 'antd';
import React, { useRef } from 'react';
import url from '../../const/url.js';
import { getDataList, newData } from '../../const/http.tsx';
import { Content, Header } from 'antd/es/layout/layout';
import { DepartOut, HumanOut } from '../../const/out.tsx';
import config from '../../const/config.js';

const { Title } = Typography

type HumanIn = {
    loginName: string
    password: string
    name: string
    sex: number
    birth: string
    age: number
    telephone: string
    mail: string
    phone: string
    fax: string
    workCode: string
    depart: number
    job: string
    directorLeader: number
    supporter: number
    photo: number
    signature: string
    lastLogin: Date
    safety: number
}

const CreaterHuman = (prop: { action: React.MutableRefObject<ActionType | undefined>,depart:number,section:number}) => {
    const [form] = Form.useForm<HumanIn>();
    let jump = false
    if (prop.depart !== 0)
    form.setFieldValue("depart",prop.depart)
    return (
        <ModalForm<HumanIn>
            title="新建人员"
            trigger={
                <Button type="primary">
                    <PlusOutlined />
                    新建人员
                </Button>
            }
            width={400}
            form={form}
            submitter={{
                searchConfig: {
                    submitText: '新建',
                    resetText: '取消',
                },
                render: (prop, defaultDoms) => {
                    return [
                        ...defaultDoms,
                        <Button
                            key="jump"
                            type='primary'
                            onClick={() => {
                                jump = true
                                prop.submit()
                            }}>新建并跳转</Button>
                    ]
                }
            }}
            submitTimeout={2000}
            autoFocusFirstInput
            onFinish={async (values: HumanIn) => {
                let dataId = await newData(config.backs.human, values)
                if (dataId != -1) {
                    if (jump)
                        window.location.assign(url.backUrl.human_concrete+dataId)
                    if (prop.action.current !== undefined)
                                prop.action.current.reload();
                }
                return dataId != -1
            }}
            modalProps={{
                destroyOnClose: true,
                onCancel: () => console.log('run'),
            }}>
            <ProFormText
                width="md"
                name="loginName"
                label="登录名"
                tooltip="最长为33位"
                placeholder="请输入角色名称"
                required={true} />
            <ProFormText.Password
                width="md"
                name="password"
                label="预设密码"
                tooltip="最长33位"
                placeholder="请输入预设密码"
                required={true} />
            <ProFormText
                width="md"
                name="name"
                label="姓名"
                tooltip="最长为33位"
                placeholder="请输入姓名"
                required={true} />
            <ProFormText
                width="md"
                name="workCode"
                label="工号"
                tooltip="最长为33位"
                placeholder="请输入工号"
                required={true} />
            <ProFormTreeSelect
                width="md"
                name="depart"
                label="所属部门"
                tooltip="必须为非废弃部门"
                placeholder="请选择部门"
                required={true} 
                request={async ()=>{
                    let params:any = {toBrowser:true,isDeperacted:0}
                    if (prop.section !== 0)
                        params.section = prop.section
                    let departs:DepartOut[] = (await getDataList(config.fronts.depart,params)).data
                    return departs.map((depart,index,array)=>{return {title:depart.departName,value:depart.dataId}})
                }}/>
        </ModalForm>

    )
}


const HumanList = (prop:{depart:number,section:number}) => {
    const actionRef = useRef<ActionType>();

    const columns: ProColumns<HumanOut>[] = [
        {
            key: 'code',
            title: '编号',
            dataIndex: 'dataId',
            valueType: "indexBorder",
            width: 48,
            align: "center"

        },
        {
            key: 'name',
            title: '人员姓名',
            dataIndex: 'name',
        },
        {
            key: 'sex',
            title: '人员性别',
            dataIndex: 'sex',
            ellipsis: true,
            valueType:'select',
            tip: "不显示代表未录入",
            request:async ()=>{
                return [
                    {
                        label:"男",
                        value:0,
                    },{
                        label:"女",
                        value:1,
                    },
                ]
            }
        },
        {
            key: 'telephone',
            title: '联系电话',
            dataIndex: 'telephone',
        },
        {
            key: 'workCode',
            title: '工号',
            dataIndex: 'workCode',
        },
        {
            key: 'depart',
            title: '所属部门',
            dataIndex: 'depart',
            valueType: "select",
            request: async ()=>{
                let departs:DepartOut[] = (await getDataList(config.fronts.depart,{toBrowser:true,isDeperacted:0})).data
                return departs.map((depart,index,array)=>{return {label:depart.departName,value:depart.dataId}})
            }
        },{
            key:'isDeprecated',
            dataIndex:'isDeprecated',
            title:"在职情况",
            valueType:'select',
            request:async ()=>{
                return [
                    {
                        label:'在职',
                        value:0
                    },{
                        label:'离职',
                        value:1
                    },
                ]
            }
        },{
            key: 'action',
            title: '操作',
            dataIndex: "moduleTypeId",
            hideInSearch: true,
            render: (dom, entity, index, action) =>
                <Button href={url.backUrl.human_concrete + entity.dataId}>编辑</Button>
        },
    ];

    return (
        <ProTable<HumanOut>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (
                // 第一个参数 params 查询表单和 params 参数的结合
                // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
                params,
                sort,
                filter,
            ) => {
                // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
                // 如果需要转化参数可以在这里进行修改
                // console.log(params)
                // console.log(sort);
                // console.log(filter);
                if (prop.depart !== 0)
                    params.depart = prop.depart
                if (prop.section !== 0)
                    params.section = prop.section
                return getDataList(config.backs.human, params)
            }}
            editable={{
                type: 'multiple',
            }}
            columnsState={{
                persistenceKey: 'pro-table-singe-demos',
                persistenceType: 'localStorage',
                onChange(value) {
                    console.log('value: ', value);
                },
            }}
            rowKey="id"
            search={{
                labelWidth: 'auto',
            }}
            options={{
                setting: {
                    listsHeight: 400,
                },
            }}
            form={{
                // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
                syncToUrl: (values, type) => {
                    if (type === 'get') {
                        return {
                            ...values,
                            created_at: [values.startTime, values.endTime],
                        };
                    }
                    return values;
                },
            }}
            pagination={{
                pageSize: 10,
                onChange: (page) => console.log(page),
            }}
            dateFormatter="string"
            headerTitle="人员列表"
            toolBarRender={() => [
                <CreaterHuman key="create" action={actionRef} section={prop.section} depart={prop.depart}/>,
            ]}
        />
    );
};

const BackHuman = (prop:{depart:number,section:number}) => {
    let header =  (
        <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px", }}>
            <div style={{ display: 'flex' }}>
                <FolderOpenTwoTone style={{ fontSize: "36px", marginTop: "15px", marginLeft: "5px" }} />
                <Title level={2} style={{ color: 'GrayText', marginLeft: '10px', marginBottom: '15px' }}>人员列表</Title>
            </div>
        </Header>)
    if (prop.depart !== 0 || prop.section !== 0) 
        header = <></>
    return (
        <Layout style={{ minHeight: '100vh' }}>
            
                {header}
            
            <Content style={{ padding: '15px 50px', minHeight: '100%' }}>
                <HumanList depart={prop.depart} section={prop.section}/>
            </Content>

        </Layout>



    )
}

BackHuman.defaultProps = {
    depart:0,
    section:0
}

export default BackHuman;