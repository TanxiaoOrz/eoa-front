import { useState, useEffect, useRef, Children } from "react"
import { UpdateData, deleteData, getDataList, getDataOne, newData } from "../../const/http.tsx"
import { ColumnOut, ModuleOut, TableOut, WorkflowOut } from "../../const/out.tsx"
import config from "../../const/config"
import { SnippetsFilled, FolderOpenTwoTone, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Layout, List, Modal, Tabs, Typography } from "antd"
import Sider from "antd/es/layout/Sider"
import { Header, Content } from "antd/es/layout/layout"
import React from "react"
import { ActionType, ModalForm, PageContainer, ProColumns, ProForm, ProFormDatePicker, ProFormGroup, ProFormText, ProFormTextArea, ProFormTreeSelect, ProTable } from "@ant-design/pro-components"
import { useLocation, useParams } from "react-router"
import url from "../../const/url"
import PageWait from "../../componet/PageWait.tsx"
import BackNode from "./back_node.tsx"
import BackRoute from "./back_route.tsx"
import { tab } from "@testing-library/user-event/dist/tab"

type WorkflowIn = {
    moduleTypeId: number
    tableId: number
    workFlowName: string
    workFlowDescription: string
}

const BackWorkflowConcrete = () => {
    const workflowId = useParams().dataId
    const [form] = Form.useForm<WorkflowIn>()
    const [workflow, setWorkflow] = useState<WorkflowOut>()
    const [tableId, setTableId] = useState<number>(0)

    useEffect(() => {
        if (workflow === undefined)
            getDataOne(config.backs.workflow + "/" + workflowId).then((value) => {
                console.log(value.data)
                if (value.success) {
                    setWorkflow(value.data)
                    setTableId(value.data.tableId ?? 0)
                }
            })
    })

    if (workflowId === undefined) {
        window.location.replace(url.backUrl.workflow)
        return (<div></div>)
    }

    if (workflow === undefined)
        return (<PageWait />)

    
    const dropDepart = async () => {
        if ((await deleteData(config.backs.workflow + "/" + workflowId)))
            window.location.reload()
    }

    const WorkflowBase = (
        <div style={{ display: "flex", background: "#fdfdfd", paddingTop: "30px", paddingLeft: "10px" }}>
            <ProForm<WorkflowIn>
                form={form}
                style={{
                    margin: "0 auto",
                    minHeight: "90vh"
                }}
                submitter={false}
                layout="horizontal"
                initialValues={workflow}
                onFinish={async (workflowIn: WorkflowIn) => {
                    return (await UpdateData(config.backs.workflow + "/" + workflowId, workflowIn))
                }}
                onValuesChange={(changedValues, workflowIn) => {
                    if (workflowIn.tableId !== tableId)
                        setTableId(tableId)
                }}
            >
                <ProFormGroup size={"large"} title="基本信息">
                    <ProFormText
                        width="md"
                        name="workFlowName"
                        label="流程名称"
                        tooltip="最长为33位"
                        placeholder="请输入流程名称"
                        required={true} />
                    <ProFormTextArea
                        width="md"
                        name="workFlowDescription"
                        label="流程描述"
                        tooltip="最长为333位"
                        placeholder="请输入流程描述"
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
                        }} />
                </ProFormGroup>
                <ProFormGroup size={"large"} title="流转信息">
                    <ProFormTreeSelect
                        width="md"
                        name="tableId"
                        label="关联表单"
                        tooltip="请选择所属模块"
                        required={true}
                        disabled={true}
                        request={async () => {
                            let tableList: TableOut[] = (await getDataList(config.backs.table, { toBrowser: true, isVirtual:false })).data
                            const valueEnumModule: { title: string, value: number, children: any[] }[] = tableList.map(
                                (item) => {
                                    return { title: item.tableViewName, value: item.tableId, children: [] };
                                })
                            return valueEnumModule
                        }}
                        addonAfter={
                            <Button
                                onClick={() => { window.open(url.backUrl.table + workflow.createNode + "?isVirtual=0") }}
                            >查看</Button>
                        } />
                    <ProFormText
                        width="md"
                        name="workflowBaseTitle"
                        label="流程请求显示基础名称"
                        tooltip="请输入请求名称"
                        placeholder="不输入自动替换为流程标题"
                        required={false}
                    />
                    <ProFormTreeSelect
                        width="md"
                        name="titleColumnId"
                        label="流程标题字段"
                        placeholder="请选择流程标题字段"
                        request={async()=>{
                            let columnList:ColumnOut[] =(await getDataList(config.backs.column,{...config.toBrowser, tableId:tableId, isVirtual:false})).data
                            return columnList.map((item)=>{return {title:item.columnViewName, value:item.columnId}})
                        }}
                    />
                    <ProFormText
                        width="md"
                        name="createNodeName"
                        label="创建节点"
                        placeholder="当前未有创建节点"
                        disabled
                        addonAfter={
                            <Button
                                onClick={() => { window.open(url.backUrl.workflow_node_concrete + workflow.createNode) }}
                            >查看</Button>
                        }
                    />
                </ProFormGroup>
                <ProFormGroup size={"large"} title="创建信息">
                    <ProFormDatePicker
                        disabled
                        name="createTime"
                        label="创建时间"
                        width="md" />
                    <ProFormText
                        disabled
                        label="创建人"
                        name="createName"
                        addonAfter={<Button onClick={() => { window.open(url.frontUrl.humanResource + workflow.creator) }}>查看</Button>}
                    />
                </ProFormGroup>

            </ProForm>
        </div>
    )

    let title = (!workflow.isDeprecated) ? "" : " (废弃中)"
    return (
        <div
            style={{ background: '#F5F7FA' }}
        >
            <PageContainer
                header={{
                    title: workflow.workFlowName + title,
                    breadcrumb: {
                        items: [
                            {
                                path: url.backUrl.workflow,
                                title: '流程列表',
                            },
                            {
                                path: url.backUrl.workflow_concrete + '/' + workflowId,
                                title: workflow.workFlowName,
                            },
                        ],
                    },
                    extra: [
                        <Button key='save' type="primary" onClick={() => { form.submit() }}>{workflow.isDeprecated === 0 ? "保存" : "保存并启用"}</Button>,
                        <Button key='reset' onClick={() => { form.resetFields() }}>重置</Button>,
                        <Button key='drop' type='default' danger onClick={dropDepart} disabled={workflow.isDeprecated === 1} >封存</Button>
                    ]
                }}
                tabList={[
                    {
                        key: "base",
                        tab: "基本信息",
                        children: WorkflowBase
                    }, {
                        key: "routes",
                        tab: "路径信息",
                        children: <BackRoute workflowId={parseInt(workflowId)} />
                    }, {
                        key: "nodes",
                        tab: "节点信息",
                        children: <BackNode workflowId={parseInt(workflowId)} />
                    }, {
                        key: 'flow',
                        tab: '流程图',
                        children: <></>
                    }
                ]}
            />
        </div>
    )
            
}

export default BackWorkflowConcrete