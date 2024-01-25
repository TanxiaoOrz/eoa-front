import React, { useState, useEffect, useRef } from "react"
import { UpdateData, deleteData, getDataList, getDataOne } from "../../const/http.tsx"
import { ColumnOut, TableOut, WorkflowNodeOut } from "../../const/out.tsx"
import config from "../../const/config"
import { Button, Form } from "antd"
import { EditableFormInstance, EditableProTable, PageContainer, ProColumns, ProForm, ProFormDatePicker, ProFormDigit, ProFormGroup, ProFormSelect, ProFormText, ProFormTreeSelect } from "@ant-design/pro-components"
import { useParams } from "react-router"
import url from "../../const/url"
import PageWait from "../../componet/PageWait.tsx"
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
    tableModifyAuthority: string
    beforeAction: string
    checkAction: string
    afterAction: string
}

type ModifyRow = {
    id: number
    columnId: number | null
    edit: boolean | null
}

const BackWorkflowNodeConcrete = () => {
    const nodeId = useParams().dataId
    const [form] = Form.useForm<WorkflowNodeIn>()
    const [node, setNode] = useState<WorkflowNodeOut>()
    const editorFormRef = useRef<EditableFormInstance>();
    const [modifyRows, setModifyRows] = useState<readonly ModifyRow[]>([])
    useEffect(() => {
        if (node === undefined)
            getDataOne(config.backs.workflowNode + "/" + nodeId).then((value) => {
                console.log(value.data)
                if (value.success) {
                    setNode(value.data)
                    setModifyRows(value.data.tableModifyAuthority ?
                        Object.entries(JSON.parse(value.data.tableModifyAuthority)).map((key, index) => {
                            return { id: index, columnId: parseInt(key[0]), edit: key[1] as boolean }
                        })
                        : [])
                }
            })
    })

    if (nodeId === undefined) {
        window.location.replace(url.backUrl.workflow_node)
        return (<div></div>)
    }

    if (node === undefined)
        return (<PageWait />)

    useEffect(() => {
        document.title = "节点详情" + node?.workflowNodeName
    }, [node])


    const dropNode = async () => {
        if ((await deleteData(config.backs.workflowNode + "/" + nodeId)))
            setTimeout(() => { window.close() }, 1000)
    }

    const modifyColumn: ProColumns<ModifyRow>[] = [
        {
            key: "columnId",
            dataIndex: "columnId",
            valueType: "select",
            title: "字段名称",
            request: async () => {
                let columns: ColumnOut[] = (await getDataList(config.backs.column, { ...config.toBrowser, tableId: node.tableId, isVirtual: false })).data
                return columns.map((column) => { return { label: column.columnViewName, value: column.columnId } })
            }
        }, {
            key: "edit",
            dataIndex: "edit",
            valueType: "select",
            title: "字段权限",
            request: async () => {
                return [
                    {
                        label: "编辑",
                        value: true
                    }, {
                        label: "只读",
                        value: false
                    }
                ]
            }
        }, {
            title: '操作',
            valueType: 'option',
            width: 200,
            render: (text, record, _, action) => (
                <Button
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.id);
                    }}
                >
                    编辑
                </Button>
            )
        }
    ]
    let tooltipModify: string
    switch (node.nodeType) {
        case 0:
        case 1:
            tooltipModify = "默认权限-编辑"
            break;
        default:
            tooltipModify = "默认权限-只读"
    }
    const tableModify = (
        <EditableProTable
            editableFormRef={editorFormRef}
            rowKey="id"
            headerTitle="表单编辑权限"
            tooltip={tooltipModify}
            scroll={{
                x: 960,
            }}
            recordCreatorProps={{
                position: 'bottom',
                record: () => ({ id: parseInt((Math.random() * 1000000).toFixed(0)), columnId: null, edit: null }),
            }}
            loading={false}
            columns={modifyColumn}
            request={async () => {
                let modifyRows = node.tableModifyAuthority ?
                    Object.entries(JSON.parse(node.tableModifyAuthority)).map((key, index) => {
                        return { id: index, columnId: parseInt(key[0]), edit: key[1] as boolean }
                    })
                    : []
                return {
                    data: modifyRows,
                    total: modifyRows.length,
                    success: true
                }
            }}
            dataSource={modifyRows}
            value={modifyRows}
            onChange={setModifyRows}
            editable={{
                type: 'multiple',
                onSave: async (rowKey, data, row) => {
                    console.log(modifyRows)
                },

            }}
        />
    )

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
                    workflowIn.userAuthorityLimit = node.userAuthorityLimit
                    workflowIn.beforeAction = node.beforeAction
                    workflowIn.afterAction = node.afterAction
                    workflowIn.checkAction = node.checkAction
                    workflowIn.workflowId = node.workflowId
                    let tableModifyAuthority = {}
                    modifyRows.forEach((modifyRow) => {
                        if (modifyRow.columnId)
                            tableModifyAuthority[modifyRow.columnId] = modifyRow.edit
                    })
                    console.log("tableModifyAuthority", tableModifyAuthority)
                    workflowIn.tableModifyAuthority = JSON.stringify(tableModifyAuthority)
                    console.log(workflowIn)
                    if (await UpdateData(config.backs.workflowNode + "/" + nodeId, workflowIn)) {
                        setTimeout(() => { window.location.reload() }, 1000)
                        return true
                    }
                    return false
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
                                onClick={() => { window.open(url.backUrl.workflow_concrete + node.workflowId) }}
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
                                onClick={() => { window.open(url.backUrl.table_concrete + node.tableId + "?isVirtual=0") }}
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
                        name="creatorName"
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
                    title: node.workflowNodeName,
                    breadcrumb: {
                        items: [
                            {
                                title: '节点列表',
                            },
                            {
                                title: node.workflowNodeName,
                            },
                        ],
                    },
                    extra: [
                        <Button key='save' type="primary" onClick={() => { form.submit() }}>保存</Button>,
                        <Button key='drop' type='default' danger onClick={dropNode} >封存</Button>
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
                        children: <AuthorityEdit entity={node} tableId={node.tableId} isVirtual={false} authorityName='userAuthorityLimit' />
                    }, {
                        key: "beforeAction",
                        tab: "节点前操作",
                        children: <ActionEdit
                            initialValue={node.beforeAction}
                            type="action"
                            tableId={node.tableId}
                            setValue={(value: string) => {
                                node.beforeAction = value
                                form.setFieldValue("beforeAction", value)
                                return true
                            }} />
                    }, {
                        key: "checkAction",
                        tab: "提交校验",
                        children: <ActionEdit
                            initialValue={node.checkAction}
                            type='check'
                            tableId={node.tableId}
                            setValue={(value: string) => {
                                node.checkAction = value
                                form.setFieldValue("checkAction", value)
                                return true
                            }} />
                    }, {
                        key: 'afterAction',
                        tab: '节点后操作',
                        children: <ActionEdit
                            initialValue={node.afterAction}
                            type='action'
                            tableId={node.tableId}
                            setValue={(value: string) => {
                                node.afterAction = value
                                form.setFieldValue("afterAction", value)
                                return true
                            }} />
                    }, {
                        key: 'tableModifyAuthority',
                        tab: '表单操作权限',
                        children: tableModify
                    }
                ]}
            />
        </div>
    )

}

export default BackWorkflowNodeConcrete