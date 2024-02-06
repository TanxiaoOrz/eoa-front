import React, { useState, useEffect, useRef } from "react"
import { getDataList, newData } from "../../const/http.tsx"
import { ModuleOut, TableOut, SearchListOut } from "../../const/out.tsx"
import config from "../../const/config.js"
import { SnippetsFilled, FolderOpenTwoTone, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Layout, List, Tabs, Typography } from "antd"
import Sider from "antd/es/layout/Sider"
import { Header, Content } from "antd/es/layout/layout"
import { ActionType, ModalForm, ProColumns, ProFormSelect, ProFormText, ProFormTreeSelect, ProTable } from "@ant-design/pro-components"
import { useLocation } from "react-router"
import url from "../../const/url.js"

const { Title } = Typography;

type SearchListIn = {
    moduleTypeId: number
    searchListName: string
    tableId: number
    isVirtual: number
}


const CreateSearch = (prop: { moduleTypeId: string | null, actionRef: React.MutableRefObject<ActionType | undefined>, isVirtual: 0 | 1 }) => {
    const moduleTypeId = prop.moduleTypeId ? parseInt(prop.moduleTypeId) : null
    const [form] = Form.useForm<SearchListIn>();
    let jump: boolean = false;
    return (
        <ModalForm<SearchListIn>
            title="展示列表"
            trigger={
                <Button type="primary">
                    <PlusOutlined />
                    创建列表
                </Button>
            }
            width={400}
            form={form}
            submitTimeout={2000}
            autoFocusFirstInput
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
            onFinish={async (values: SearchListIn) => {
                console.log(values)
                let dataId: number = await newData(config.backs.search_list, values)
                if (dataId != -1) {
                    if (jump)
                        window.location.assign(url.backUrl.search_list_concrete + dataId);
                    prop.actionRef.current?.reload()
                    form.resetFields()
                    jump = false
                    return true
                }
                return false
            }}
        >
            <ProFormText
                width="md"
                name="searchListName"
                label="列表名称"
                tooltip="最长为33位"
                placeholder="请输入流程名称"
                required={true} />
            <ProFormTreeSelect
                width="md"
                name="moduleTypeId"
                label="所属模块"
                tooltip="请选择所属模块"
                required={true}
                request={async () => {
                    let moduleList: ModuleOut[] = (await getDataList(config.backs.module, { toBrowser: true })).data
                    const valueEnumModule: { title: string, value: number, children: any[] }[] = moduleList.map(
                        (item) => {
                            return { title: item.moduleTypeName, value: item.moduleTypeId, children: [] };
                        })
                    return valueEnumModule
                }}
                initialValue={moduleTypeId} />
            <ProFormTreeSelect
                width="md"
                name="tableId"
                label="关联表单"
                tooltip="请选择所属表单"
                required={true}
                request={async () => {
                    let tableList: TableOut[] = (await getDataList(config.backs.table, { toBrowser: true, isVirtual: prop.isVirtual === 1 })).data
                    const valueEnumModule: { title: string, value: number, children: any[] }[] = tableList.map(
                        (item) => {
                            return { title: item.tableViewName, value: item.tableId, children: [] };
                        })
                    return valueEnumModule
                }} />
            <ProFormSelect
                width="md"
                name="isVirtual"
                label="是否虚拟试图"
                tooltip="请输入请求名称"
                placeholder="不输入自动替换为流程标题"
                request={async () => [
                    {
                        label: '是',
                        value: 1
                    }, {
                        label: '否',
                        value: 0
                    }
                ]}
                readonly
                required={true}
                initialValue={prop.isVirtual}
            />
        </ModalForm>
    )
}


const SearchList = (prop: { isVirtual: 0 | 1 }) => {
    const actionRef = useRef<ActionType>();
    const query = new URLSearchParams(useLocation().search);
    const moduleNo = query.get("moduleNo");
    const columns: ProColumns<SearchListOut>[] = [
        {
            key: 'dataId',
            title: '编号',
            dataIndex: 'dataId',
            valueType: "indexBorder",
            width: 48,
            align: "center"
        }, {
            key: 'searchListName',
            title: '列表名称',
            dataIndex: 'searchListName'
        }, {
            key: 'tableId',
            title: '关联表单',
            hideInSearch: true,
            dataIndex: 'tableId',
            render: (dom, entity, index, action, schema) => (
                <Button
                    type="link"
                    onClick={() => {
                        window.open(url.backUrl.table + '/' + entity.tableId + "?isVirtual=" + prop.isVirtual)
                    }}
                >
                    {entity.tableName}
                </Button>
            )
        }, {
            key: 'moduleTypeId',
            title: '所属模块',
            hideInSearch: true,
            render: (dom, entity, index, action, schema) => (
                <Button
                    type="link"
                    onClick={() => {
                        window.open(url.backUrl.module + '/' + entity.moduleTypeId)
                    }}
                >
                    {entity.moduleTypeName}
                </Button>
            ),
            dataIndex: "moduleTypeId",
        }, {
            key: 'creator',
            title: '创建者',
            dataIndex: 'creatorId',
            width: 48 * 2,
            render: (dom, entity, index, action) => (
                <a href={url.frontUrl.humanResource + entity.creator} key={"href" + entity.creator}>{entity.creatorName}</a>
            ),
            hideInSearch: true
        },
        {
            key: 'createTimeShow',
            title: '创建时间',
            dataIndex: 'createTime',
            valueType: "dateTime",
            width: 48 * 4,
            hideInSearch: true
        }, {
            key: 'createTime',
            title: '创建时间',
            dataIndex: 'createTime',
            valueType: "dateTimeRange",
            hideInTable: true
        }, {
            key: 'action',
            title: '操作',
            dataIndex: "dataId",
            width: 48 * 3,
            hideInSearch: true,
            render: (dom, entity, index, action) =>
                <Button
                    type="primary"
                    onClick={() => {
                        window.open(url.backUrl.search_list_concrete + entity.dataId)
                    }}
                >
                    编辑
                </Button>
        }
    ]
    return (
        <ProTable<SearchListOut>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params, sort, filter) => {
                if (moduleNo != null)
                    params.moduleTypeId = moduleNo
                params.isVirtual = prop.isVirtual
                return getDataList(config.backs.search_list, params)
            }}
            rowKey='dataId'
            search={{
                labelWidth: 'auto',
            }}
            options={{
                setting: {
                    listsHeight: 400,
                },
            }}
            pagination={{
                pageSize: 10,
                onChange: (page) => console.log(page),
            }}
            dateFormatter="string"
            headerTitle="工作流列表"
            toolBarRender={() => [
                <CreateSearch key="create" moduleTypeId={moduleNo} actionRef={actionRef} isVirtual={prop.isVirtual} />
            ]}
        />
    )
}

const BackSearchList = () => {
    const [moduleList, setModuleList] = useState<ModuleOut[]>([])
    useEffect(() => {
        if (moduleList.length == 0)
            (getDataList(config.backs.module)).then((value) => {
                setModuleList(value.data)
            })
    })
    useEffect(() => {
        document.title = '展示列表'
    })
    const tabs = [
        {
            key: "Entity",
            label: (<span>实体表单台账</span>),
            children: (<SearchList isVirtual={0} />)
        }, {
            key: "Virtual",
            label: (<span>虚拟视图台账</span>),
            children: (<SearchList isVirtual={1} />)
        }
    ]
    return (
        <Layout style={{ minHeight: '98.5vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px", }}>
                <SnippetsFilled style={{ fontSize: "36px", marginTop: "30px", marginLeft: "5px", marginBottom: '30px' }} />
                <Title level={2} style={{ color: 'GrayText', marginLeft: '10px', marginBottom: '30px' }}>搜索列表</Title>
            </Header>
            <Layout hasSider>
                <Sider style={{ padding: '10px 10px', backgroundColor: "#f7f7f7" }}>
                    <List
                        style={{ minHeight: '100%' }}
                        pagination={{ position: 'top', align: 'center' }}
                        bordered={true}
                        itemLayout="horizontal"
                        dataSource={moduleList}
                        renderItem={(item, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<FolderOpenTwoTone />}
                                    title={<a href={window.location.pathname + "?moduleNo=" + item.moduleTypeId}>{item.moduleTypeName}</a>}
                                />
                            </List.Item>
                        )}
                    />
                </Sider>
                <Content style={{ padding: '15px 50px' }}>
                    <Tabs
                        defaultActiveKey='Entity'
                        items={tabs}
                    />
                </Content>
            </Layout>
        </Layout>
    );
}

export default BackSearchList