import { useState, useEffect, useRef } from "react"
import { getDataList, newData } from "../../const/http.tsx"
import { ModuleOut, TableOut, WorkflowNodeOut, WorkflowOut, WorkflowRouteOut } from "../../const/out.tsx"
import config from "../../const/config.js"
import { SnippetsFilled, FolderOpenTwoTone, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Layout, List, Modal, Tabs, Tooltip, Typography } from "antd"
import Sider from "antd/es/layout/Sider"
import { Header, Content } from "antd/es/layout/layout"
import React from "react"
import { ActionType, ModalForm, ProColumns, ProFormDigit, ProFormGroup, ProFormSelect, ProFormText, ProFormTextArea, ProFormTreeSelect, ProTable } from "@ant-design/pro-components"
import { useLocation } from "react-router"
import url from "../../const/url.js"

const { Title } = Typography

type WorkflowRouteInSimple = {
    routeName: string
    workflowId: number
    startNodeId: number
    endNodeId: number
    viewNo: number
}

const CreateRoute = (prop: { workflowId: number, actionRef: React.MutableRefObject<ActionType | undefined> }) => {
    const workflowId = prop.workflowId !== 0 ? prop.workflowId : null
    const [form] = Form.useForm<WorkflowRouteInSimple>();
    let jump: boolean = false;
    if (workflowId)
        return (
            <ModalForm<WorkflowRouteInSimple>
                title="创建流程"
                trigger={
                    <Button type="primary">
                        <PlusOutlined />
                        创建路径
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
                onFinish={async (values: WorkflowRouteInSimple) => {
                    console.log(values)
                    let dataId: number = await newData(config.backs.workflowRoute, values)
                    if (dataId != -1) {
                        if (jump)
                            window.open(url.backUrl.workflow_route_concrete + dataId);
                        prop.actionRef.current?.reload()
                        form.resetFields()
                        return true
                    }
                    jump = false
                    return false
                }}
            >
                <ProFormText
                    width="md"
                    name="routeName"
                    label="路径名称"
                    tooltip="最长为33位"
                    placeholder="请输入路径名称"
                    required={true} />
                <ProFormTreeSelect
                    width="md"
                    name="startNodeId"
                    label="路径起点"
                    placeholder="请选择起始节点"
                    required
                    disabled={!workflowId}
                    request={async () => {
                        let nodeList: WorkflowNodeOut[] = (await getDataList(config.backs.workflowNode, { toBrowser: true, workflowId })).data
                        return nodeList.map((value, index, array) => { return { title: value.workflowNodeName, value: value.dataId } })
                    }} />
                <ProFormTreeSelect
                    width="md"
                    name="endNodeId"
                    label="路径终点"
                    placeholder="请选择到达节点"
                    required
                    disabled={!workflowId}
                    request={async () => {
                        let nodeList: WorkflowNodeOut[] = (await getDataList(config.backs.workflowNode, { toBrowser: true, workflowId })).data
                        return nodeList.map((value, index, array) => { return { title: value.workflowNodeName, value: value.dataId } })
                    }} />

                <ProFormDigit
                    width="md"
                    name="viewNo"
                    label="节点显示顺序"
                    tooltip="节点排列时的显示顺序"
                    placeholder="默认排列在最后"
                    required={false}
                    fieldProps={{ precision: 0 }} />
                <ProFormTreeSelect
                    width="md"
                    name="workflowId"
                    label="所属流程"
                    placeholder="请选择所属流程"
                    required
                    disabled={workflowId !== null}
                    request={async () => {
                        let workflowList: WorkflowOut[] = (await getDataList(config.backs.workflow, { toBrowser: true })).data
                        return workflowList.map((value, index, array) => { return { title: value.workFlowName, value: value.dataId } })
                    }}
                    initialValue={workflowId} />

            </ModalForm>
        )
    else
        return (
            <Tooltip title="请从工作流页面创建">
                <Button
                    disabled
                    type='primary'
                >
                    创建路径
                </Button>
            </Tooltip>
        )
}

const BackRouteList = (prop: { workflowId: number }) => {
    const actionRef = useRef<ActionType>();
    const columns: ProColumns<WorkflowRouteOut>[] = [
        {
            key: 'code',
            title: '编号',
            dataIndex: 'dataId',
            valueType: "indexBorder",
            width: 48,
            align: "center"
        }, {
            key: 'routeName',
            title: '路径名称',
            dataIndex: 'routeName'
        }, {
            key: 'startNodeId',
            title: '路径起点',
            dataIndex: 'startNodeId',
            render: (dom, entity, index, action, schema) => (
                <Button
                    type="link"
                    onClick={() => {
                        window.open(url.backUrl.workflow_node_concrete + entity.startNodeId)
                    }}
                >
                    {entity.startNodeName}
                </Button>
            ),
            hideInSearch: true
        }, {
            key: 'endNodeId',
            title: '路径终点',
            dataIndex: 'endNodeId',
            render: (dom, entity, index, action, schema) => (
                <Button
                    type="link"
                    onClick={() => {
                        window.open(url.backUrl.workflow_node_concrete + entity.endNodeId)
                    }}
                >
                    {entity.endNodeName}
                </Button>
            ),
            hideInSearch: true
        }, {
            key: 'viewNo',
            title: '显示顺序',
            dataIndex: 'viewNo'
        }
    ]
    if (!prop.workflowId) {
        columns.push(
            {
                key: 'workflowId',
                title: '所属流程',
                hideInSearch: true,
                render: (dom, entity, index, action, schema) => (
                    <Button
                        type="link"
                        onClick={() => {
                            window.open(url.backUrl.workflow_concrete + entity.workflowId)
                        }}
                    >
                        {entity.workflowName}
                    </Button>
                ),
                dataIndex: "workflowId",
            }
        )
    }
    columns.push(
        {
            key: 'action',
            title: '操作',
            dataIndex: "dataId",
            width: 48 * 3,
            hideInSearch: true,
            render: (dom, entity, index, action) =>
                <Button
                    type="primary"
                    onClick={() => {
                        window.open(url.backUrl.workflow_route_concrete + entity.dataId)
                    }}
                >
                    编辑
                </Button>
        }
    )
    return (
        <ProTable<WorkflowRouteOut>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params, sort, filter) => {
                if (prop.workflowId !== null)
                    params.workflowId = prop.workflowId
                return getDataList(config.backs.workflowRoute, params)
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
            headerTitle="路径列表"
            toolBarRender={() => [
                <CreateRoute key="create" workflowId={prop.workflowId} actionRef={actionRef} />
            ]}
        />
    )
}

const BackRoute = (prop: { workflowId: number }) => {
    useEffect(() => {
        if ( prop.workflowId === 0)
            document.title = '路径列表'
    }, [prop])
    let header = (
        <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px", }}>
            <div style={{ display: 'flex' }}>
                <FolderOpenTwoTone style={{ fontSize: "36px", marginTop: "15px", marginLeft: "5px" }} />
                <Title level={2} style={{ color: 'GrayText', marginLeft: '10px', marginBottom: '15px' }}>路径列表</Title>
            </div>
        </Header>)
    if (prop.workflowId !== 0)
        header = <></>
    return (
        <Layout style={{ minHeight: '100vh' }}>
            {header}
            <Content style={{ padding: '15px 50px', minHeight: '100%' }}>
                <BackRouteList workflowId={prop.workflowId} />
            </Content>
        </Layout>
    )
}

BackRoute.defaultProps = {
    workflowId: 0
}

export default BackRoute