﻿import { useState, useEffect, useRef, Children } from "react"
import { UpdateData, deleteData, getDataList, getDataOne, newData } from "../../const/http.tsx"
import { ColumnOut, ModuleOut, TableOut, WorkflowNodeOut, WorkflowOut } from "../../const/out.tsx"
import config from "../../const/config"
import { SnippetsFilled, FolderOpenTwoTone, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Layout, List, Modal, Tabs, Typography } from "antd"
import Sider from "antd/es/layout/Sider"
import { Header, Content } from "antd/es/layout/layout"
import React from "react"
import { ActionType, ModalForm, PageContainer, ProColumns, ProForm, ProFormDatePicker, ProFormDigit, ProFormGroup, ProFormSelect, ProFormText, ProFormTextArea, ProFormTreeSelect, ProTable } from "@ant-design/pro-components"
import { useLocation, useParams } from "react-router"
import url from "../../const/url"
import PageWait from "../../componet/PageWait.tsx"
import BackNode from "./back_node.tsx"
import BackRoute from "./back_route.tsx"
import { tab } from "@testing-library/user-event/dist/tab"
import { AuthorityEdit } from "../../componet/AuthorityEdit.tsx"
import ActionEdit from "../../componet/ActionEdit.tsx"

type WorkflowNodeIn = {
    dataId: number
    workflowNodeName: string
    isCounterSign: number
    nodeType: number
    workflowId: number
    viewNo: number
    userAuthorityLimit: string
    beforeAction: string
    checkAction: string
    afterAction: string
}

const BackWorkflowNodeConcrete = () => {
    const nodeId = useParams().dataId
    const [form] = Form.useForm<WorkflowNodeIn>()
    const [node, setNode] = useState<WorkflowNodeOut>()


    useEffect(() => {
        if (node === undefined)
            getDataOne(config.backs.workflowNode + "/" + nodeId).then((value) => {
                console.log(value.data)
                if (value.success) {
                    setNode(value.data)
                }
            })
    })

    if (nodeId === undefined) {
        window.location.replace(url.backUrl.workflow_node)
        return (<div></div>)
    }

    if (node === undefined)
        return (<PageWait />)


    const dropDepart = async () => {
        if ((await deleteData(config.backs.workflowNode + "/" + nodeId)))
            window.location.reload()
    }

    const WorkflowNodeBase = (
        <div style={{ display: "flex", background: "#fdfdfd", paddingTop: "30px", paddingLeft: "10px" }}>
            <ProForm<WorkflowNodeIn>
                form={form}
                style={{
                    margin: "0 auto",
                    minHeight: "90vh"
                }}
                submitter={false}
                layout="horizontal"
                initialValues={node}
                onFinish={async (workflowIn: WorkflowNodeIn) => {
                    return (await UpdateData(config.backs.workflowNode + "/" + nodeId, workflowIn))
                }} >
                <ProFormGroup size={"large"} title="基本信息">
                    <ProFormText
                        width="md"
                        name="workflowNodeName"
                        label="节点名称"
                        tooltip="最长为33位"
                        placeholder="请输入节点名称"
                        required={true} />
                    <ProFormSelect
                        width="md"
                        name="nodeType"
                        label="节点类型"
                        required
                        tooltip="一个流程最多有一个创建节点"
                        placeholder="请选择节点类型"
                        request={async () => {
                            return [
                                {
                                    label: "创建",
                                    value: 0
                                }, {
                                    label: "审批",
                                    value: 1
                                }, {
                                    label: "提交",
                                    value: 2
                                }, {
                                    label: "归档",
                                    value: 3
                                }
                            ]
                        }} />
                    <ProFormSelect
                        width="md"
                        name="isCounterSign"
                        label="是否会签"
                        tooltip="会签代表节点所有人均操作后才会流转至下一节点"
                        required={true}
                        initialValue={0}
                        request={async () => {
                            return [
                                {
                                    label: "否",
                                    value: 0
                                }, {
                                    label: "是",
                                    value: 1
                                }
                            ]
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
                                onClick={() => { window.open(url.backUrl.workflow + node.workflowId + "?isVirtual=0") }}
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
                                onClick={() => { window.open(url.backUrl.table + node.tableId + "?isVirtual=0") }}
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
                        addonAfter={<Button onClick={() => { window.open(url.frontUrl.humanResource + node.creator) }}>查看</Button>}
                    />
                </ProFormGroup>

            </ProForm>
        </div>
    )
    return (
        <div style={{ background: '#F5F7FA' }} >
            <PageContainer
                header={{
                    title: node.workflowNodeName ,
                    breadcrumb: {
                        items: [
                            {
                                path: url.backUrl.workflow_node,
                                title: '节点列表',
                            },
                            {
                                path: url.backUrl.workflow_concrete + '/' + nodeId,
                                title: node.workflowNodeName,
                            },
                        ],
                    },
                    extra: [
                        <Button key='save' type="primary" onClick={() => { form.submit() }}>保存</Button>,
                        <Button key='drop' type='default' danger onClick={dropDepart} >封存</Button>
                    ]
                }}
                tabList={[
                    {
                        key: "base",
                        tab: "基本信息",
                        children: WorkflowNodeBase
                    }, {
                        key: "authority",
                        tab: "操作人员",
                        children: <AuthorityEdit entity={node} tableId={node.tableId} isVirtual={false} authorityName='userAuthorityLimit'/>
                    }, {
                        key: "beforeAction",
                        tab: "节点前操作",
                        children: <ActionEdit 
                            initialValue={node.beforeAction} 
                            type="action" 
                            setValue={()=>{

                            }} />
                    }, {
                        key:"checkAction",
                        tab:"提交校验",
                        children: 
                    }, {
                        key: 'afterAction',
                        tab: '节点后操作',
                        children: <></>
                    }
                ]}
            />
        </div>
    )

}

export default BackWorkflowNodeConcrete