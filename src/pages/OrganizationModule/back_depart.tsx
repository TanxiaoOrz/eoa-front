import { FolderOpenTwoTone, PlusOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns, ProFormText, ProFormTextArea, ProFormTreeSelect, ProTable } from '@ant-design/pro-components';
import { Button, Dropdown, Form, Layout, MenuProps, Typography } from 'antd';
import React, { useRef } from 'react';
import url from '../../const/url.js';
import { UpdateData, deleteData, getDataList, newData } from '../../const/http.tsx';
import { Content, Header } from 'antd/es/layout/layout';
import { CharacterOut, DepartOut, HumanOut, ModuleOut, SectionOut } from '../../const/out.tsx';
import config from '../../const/config.js';

const { Title } = Typography

type DepartIn = {
    departName: string
    departCode: string
    fullName: string
    belongDepart: number
    belongSection: number
    departManager: number
    departIntroduction: string
    createTime: string
    photo: number
}

const CreaterDepart = (prop: { action: React.MutableRefObject<ActionType | undefined>, depart: number, section: number }) => {
    const [form] = Form.useForm<DepartIn>();
    let jump = false
    if (prop.depart !== 0)
        form.setFieldValue("belongDepart", prop.depart)
    if (prop.section !== 0)
        form.setFieldValue("belongSection", prop.section)
    return (
        <ModalForm<DepartIn>
            title="新建部门"
            trigger={
                <Button type="primary">
                    <PlusOutlined />
                    新建部门
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
            onFinish={async (values: DepartIn) => {
                let dataId = await newData(config.backs.depart, values)
                if (dataId != -1) {
                    if (jump)
                        window.location.assign(url.backUrl.depart_concrete + dataId)
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
                name="departName"
                label="部门名称"
                tooltip="最长为33位"
                placeholder="请输入部门名称"
                required={true} />
            <ProFormText
                width="md"
                name="departCode"
                label="部门编号"
                tooltip="最长33位"
                placeholder="请输入部门编号"
                required={true} />
            <ProFormText
                width="md"
                name="fullName"
                label="全名"
                tooltip="最长为33位"
                placeholder="请输入全名"
                required={false} />
            <ProFormTreeSelect
                width="md"
                name="belongSection"
                label="所属分部"
                tooltip="必须为非废弃分部"
                placeholder="请选择所属分部"
                required={true} 
                request={async () => {
                    let params: any = { toBrowser: true, isDeperacted: 0 }
                    let departs: SectionOut[] = (await getDataList(config.fronts.section, params)).data
                    return departs.map((depart, index, array) => { return { title: depart.sectionName, value: depart.dataId } })
                }} />
            <ProFormTreeSelect
                width="md"
                name="belongDepart"
                label="所属部门"
                tooltip="必须为非废弃部门"
                placeholder="请选择部门"
                required={false}
                request={async () => {
                    let params: any = { toBrowser: true, isDeperacted: 0 }
                    if (prop.section !== 0)
                        params.section = prop.section
                    let departs: DepartOut[] = (await getDataList(config.fronts.depart, params)).data
                    return departs.map((depart, index, array) => { return { title: depart.departName, value: depart.dataId } })
                }} />
        </ModalForm>

    )
}


const DepartList = (prop: { depart: number, section: number }) => {
    const actionRef = useRef<ActionType>();

    const columns: ProColumns<DepartOut>[] = [
        {
            key: 'code',
            title: '编号',
            dataIndex: 'dataId',
            valueType: "indexBorder",
            width: 48,
            align: "center"

        },
        {
            key: 'departCode',
            title: '部门编号',
            dataIndex: 'departCode',
        },
        {
            key: 'departName',
            title: '部门名称',
            dataIndex: 'departName',
            ellipsis: true,
        },
        {
            key: 'departManager',
            title: '部门负责人',
            dataIndex: 'departManager',
        },
        {
            key: 'belongSection',
            title: '所属分部',
            dataIndex: 'belongSection',
            valueType: "select",
            request: async () => {
                let section: SectionOut[] = (await getDataList(config.fronts.section, { toBrowser: true, isDeperacted: 0 })).data
                return section.map((section, index, array) => { return { label: section.sectionName, value: section.dataId } })
            }
        },
        {
            key: 'belongDepart',
            title: '上级部门',
            dataIndex: 'belongDepart',
            valueType: "select",
            request: async () => {
                let departs: DepartOut[] = (await getDataList(config.fronts.depart, { toBrowser: true, isDeperacted: 0 })).data
                return departs.map((depart, index, array) => { return { label: depart.departName, value: depart.dataId } })
            }
        },
        {
            key: 'isDeprecated',
            dataIndex: 'isDeprecated',
            valueType: 'select',
            request: async () => {
                return [
                    {
                        label: '在职',
                        value: 0
                    }, {
                        label: '离职',
                        value: 1
                    },
                ]
            }
        }, {
            key: 'action',
            title: '操作',
            dataIndex: "moduleTypeId",
            width: 48 * 3,
            hideInSearch: true,
            render: (dom, entity, index, action) =>
                <Button href={url.backUrl.human_concrete + entity.dataId}>编辑</Button>
        },
    ];

    return (
        <ProTable<DepartOut>
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
                    params.belongDepart = prop.depart
                if (prop.section !== 0)
                    params.belongSection = prop.section
                return getDataList(config.backs.depart, params)
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
                <CreaterDepart key="create" action={actionRef} section={prop.section} depart={prop.depart} />,
            ]}
        />
    );
};

const BackDepart = (prop: { depart: number, section: number }) => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px", }}>
                <div style={{ display: 'flex' }}>
                    <FolderOpenTwoTone style={{ fontSize: "36px", marginTop: "15px", marginLeft: "5px" }} />
                    <Title level={2} style={{ color: 'GrayText', marginLeft: '10px', marginBottom: '15px' }}>人员列表</Title>
                </div>
            </Header>
            <Content style={{ padding: '15px 50px', minHeight: '100%' }}>
                <DepartList depart={prop.depart} section={prop.section} />
            </Content>

        </Layout>



    )
}

BackDepart.defaultProps = {
    depart: 0,
    section: 0
}

export default BackDepart;