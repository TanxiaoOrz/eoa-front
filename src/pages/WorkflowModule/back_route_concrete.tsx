import { useState, useEffect, useRef, Children } from "react"
import { UpdateData, deleteData, getDataList, getDataOne, newData } from "../../const/http.tsx"
import { ColumnOut, ModuleOut, TableOut, WorkflowNodeOut, WorkflowOut, WorkflowRouteOut } from "../../const/out.tsx"
import config from "../../const/config"
import { SnippetsFilled, FolderOpenTwoTone, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Layout, List, Modal, Tabs, Typography, message } from "antd"
import Sider from "antd/es/layout/Sider"
import { Header, Content } from "antd/es/layout/layout"
import React from "react"
import { ActionType, EditableFormInstance, EditableProTable, ModalForm, PageContainer, ProColumns, ProForm, ProFormDatePicker, ProFormDigit, ProFormGroup, ProFormSelect, ProFormText, ProFormTextArea, ProFormTreeSelect, ProTable } from "@ant-design/pro-components"
import { useLocation, useParams } from "react-router"
import url from "../../const/url"
import PageWait from "../../componet/PageWait.tsx"
import BackNode from "./back_node.tsx"
import BackRoute from "./back_route.tsx"
import { tab } from "@testing-library/user-event/dist/tab"
import { AuthorityEdit } from "../../componet/AuthorityEdit.tsx"
import ActionEdit from "../../componet/ActionEdit.tsx"

type WorkflowRouteIn = {
    routeName: string
    workflowId: number
    startNodeId: number
    endNodeId: number
    viewNo: number
    enterCondition: string
    routeAction: string
}


const BackWorkflowRouteConcrete = () => {
    const routeId = useParams().dataId
    const [form] = Form.useForm<WorkflowRouteIn>()
    const [route, setRoute] = useState<WorkflowRouteOut>()

    useEffect(() => {
        if (route === undefined)
            getDataOne(config.backs.workflowRoute + "/" + routeId).then((value) => {
                console.log(value.data)
                if (value.success) {
                    setRoute(value.data)
                }
            })
    })

    if (routeId === undefined) {
        window.location.replace(url.backUrl.workflow_route)
        return (<div></div>)
    }

    if (route === undefined)
        return (<PageWait />)
        
    const dropRoute = async () => {
        if ((await deleteData(config.backs.workflowRoute + "/" + routeId)))
            window.location.reload()
    }

    const WorkflowNodeBase = (
        <div style={{ display: "flex", background: "#fdfdfd", paddingTop: "30px", paddingLeft: "10px" }}>
            <ProForm<WorkflowRouteIn>
                form={form}
                style={{
                    margin: "0 auto",
                    minHeight: "90vh"
                }}
                submitter={false}
                layout="horizontal"
                initialValues={route}
                onFinish={async (workflowIn: WorkflowRouteIn) => {
                    workflowIn.routeAction = route.routeAction
                    workflowIn.enterCondition = route.enterCondition
                    workflowIn.workflowId = route.workflowId
                    console.log(workflowIn)
                    return (await UpdateData(config.backs.workflowRoute + "/" + routeId, workflowIn))
                }} >
                <ProFormGroup size={"large"} title="基本信息">
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
                    request={async () => {
                        let nodeList: WorkflowNodeOut[] = (await getDataList(config.backs.workflowNode, { toBrowser: true, workflowId })).data
                        return nodeList.map((value, index, array) => { return { title: value.workflowNodeName, value: value.dataId } })
                    }} />
                    <ProFormText
                        width="md"
                        name="workflowName"
                        label="所属流程"
                        placeholder="请选择所属流程"
                        required
                        disabled
                        addonAfter={
                            <Button
                                onClick={() => { window.open(url.backUrl.workflow + route.workflowId + "?isVirtual=0") }}
                            >查看</Button>
                        } />
                    <ProFormDigit
                        width="md"
                        name="viewNo"
                        label="节点显示顺序"
                        tooltip="节点排列时的显示顺序"
                        placeholder="默认排列在最后"
                        required={false}
                        fieldProps={{ precision: 0 }} />
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
                            let tableList: TableOut[] = (await getDataList(config.backs.table, { toBrowser: true, isVirtual: false })).data
                            const valueEnumModule: { title: string, value: number, children: any[] }[] = tableList.map(
                                (item) => {
                                    return { title: item.tableViewName, value: item.tableId, children: [] };
                                })
                            return valueEnumModule
                        }}
                        addonAfter={
                            <Button
                                onClick={() => { window.open(url.backUrl.table + route.tableId + "?isVirtual=0") }}
                            >查看</Button>
                        } />
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
                        addonAfter={<Button onClick={() => { window.open(url.frontUrl.humanResource + route.creator) }}>查看</Button>}
                    />
                </ProFormGroup>

            </ProForm>
        </div>
    )
    return (
        <div style={{ background: '#F5F7FA' }} >
            <PageContainer
                header={{
                    title: route.routeName,
                    breadcrumb: {
                        items: [
                            {
                                path: url.backUrl.workflow_route,
                                title: '节点列表',
                            },
                            {
                                path: url.backUrl.workflow_concrete + '/' + routeId,
                                title: route.routeName,
                            },
                        ],
                    },
                    extra: [
                        <Button key='save' type="primary" onClick={() => { form.submit() }}>保存</Button>,
                        <Button key='drop' type='default' danger onClick={dropRoute} >封存</Button>
                    ]
                }}
                tabList={[
                    {
                        key: "base",
                        tab: "基本信息",
                        children: WorkflowNodeBase
                    }, {
                        key: "routeAction",
                        tab: "路径操作",
                        children: <ActionEdit
                            initialValue={route.routeAction}
                            type="action"
                            tableId={route.tableId}
                            setValue={(value: string) => {
                                route.routeName = value
                                form.setFieldValue("routeAction", value)
                                return true
                            }} />
                    }, {
                        key: "checkAction",
                        tab: "进入条件",
                        children: <ActionEdit
                            initialValue={route.enterCondition}
                            type='check'
                            tableId={route.tableId}
                            setValue={(value: string) => {
                                route.enterCondition = value
                                form.setFieldValue("enterCondition", value)
                                return true
                            }} />
                    }
                ]}
            />
        </div>
    )

}

export default BackWorkflowRouteConcrete