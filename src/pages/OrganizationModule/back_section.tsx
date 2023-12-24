﻿import { FolderOpenTwoTone, PlusOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns, ProFormText, ProFormTreeSelect, ProTable } from '@ant-design/pro-components';
import { Button, Form, Layout, Typography } from 'antd';
import React, { useRef } from 'react';
import url from '../../const/url.js';
import { getDataList, newData } from '../../const/http.tsx';
import { Content, Header } from 'antd/es/layout/layout';
import { SectionOut } from '../../const/out.tsx';
import config from '../../const/config.js';

const { Title } = Typography

type SectionIn = {
    sectionName:string
    sectionCode:string
    fullName:string
    belongSection:number
    sectionManager:number
    sectionIntroduction:string
    createTime:string
    photo:number
}

const CreaterSection= (prop: { action: React.MutableRefObject<ActionType | undefined>, section: number }) => {
    const [form] = Form.useForm<SectionIn>();
    let jump = false
    if (prop.section !== 0)
        form.setFieldValue("belongSection", prop.section)
    return (
        <ModalForm<SectionIn>
            title="新建分部"
            trigger={
                <Button type="primary">
                    <PlusOutlined />
                    新建分部
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
            onFinish={async (values: SectionIn) => {
                let dataId = await newData(config.backs.section, values)
                if (dataId != -1) {
                    if (jump)
                        window.location.assign(url.backUrl.section_concrete + dataId)
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
                name="sectionName"
                label="分部名称"
                tooltip="最长为33位"
                placeholder="请输入分部名称"
                required={true} />
            <ProFormText
                width="md"
                name="sectionCode"
                label="分部编号"
                tooltip="最长33位"
                placeholder="请输入分部编号"
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
                placeholder="请选择上级分部"
                required={true}
                request={async () => {
                    let params: any = { toBrowser: true, isDeperacted: 0 }
                    let departs: SectionOut[] = (await getDataList(config.fronts.section, params)).data
                    return departs.map((depart, index, array) => { return { title: depart.sectionName, value: depart.dataId } })
                }} />
        </ModalForm>

    )
}


const SectionList = (prop: { section: number }) => {
    const actionRef = useRef<ActionType>();
    const columns: ProColumns<SectionOut>[] = [
        {
            key: 'code',
            title: '编号',
            dataIndex: 'dataId',
            valueType: "indexBorder",
            width: 48,
            align: "center"

        },
        {
            key: 'sectionCode',
            title: '分部编号',
            dataIndex: 'sectionCode',
        },
        {
            key: 'sectionName',
            title: '分部名称',
            dataIndex: 'sectionName',
            ellipsis: true,
        },
        {
            key: 'managerName',
            title: '部门负责人',
            dataIndex: 'sectionManager',
            render: (dom, entity, index, action, schema)=>{
                return (<a href={url.frontUrl.humanResource+entity.sectionManager}>{entity.managerName}</a>)
            },
        },
        {
            key: 'belongSectionName',
            title: '上级分部',
            dataIndex: 'belongSectionName',
            render: (dom, entity, index, action, schema)=>{
                return (<a href={url.frontUrl.section_concrete+entity.belongSection}>{entity.belongSectionName}</a>)
            },
        },
        {
            key: 'isDeprecated',
            dataIndex: 'isDeprecated',
            title:'封存情况',
            valueType: 'select',
            request: async () => {
                return [
                    {
                        label: '正常',
                        value: 0
                    }, {
                        label: '封存',
                        value: 1
                    },
                ]
            }
        }, {
            key: 'action',
            title: '操作',
            dataIndex: "moduleTypeId",
            hideInSearch: true,
            render: (dom, entity, index, action) =>
                <Button href={url.backUrl.section_concrete + entity.dataId}>编辑</Button>
        },
    ];

    return (
        <ProTable<SectionOut>
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
    
                if (prop.section !== 0)
                    params.belongSection = prop.section
                return getDataList(config.backs.section, params)
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
            rowKey="dataId"
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
            headerTitle="分部列表"
            toolBarRender={() => [
                <CreaterSection key="create" action={actionRef} section={prop.section} />,
            ]}
        />
    );
};

const BackSection = (prop: { section: number }) => {
    let header = (
        <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px", }}>
            <div style={{ display: 'flex' }}>
                <FolderOpenTwoTone style={{ fontSize: "36px", marginTop: "15px", marginLeft: "5px" }} />
                <Title level={2} style={{ color: 'GrayText', marginLeft: '10px', marginBottom: '15px' }}>分部列表</Title>
            </div>
        </Header>
    )
    if (prop.section !== 0) 
        header = <></>
    return (
        <Layout style={{ minHeight: '100vh' }}>
            {header}
            <Content style={{ padding: '15px 50px', minHeight: '100%' }}>
                <SectionList section={prop.section} />
            </Content>

        </Layout>



    )
}

BackSection.defaultProps = {
    section: 0
}

export default BackSection