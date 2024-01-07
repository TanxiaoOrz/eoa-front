import { useState, useEffect, useRef } from "react"
import { getDataList, newData } from "../../const/http.tsx"
import { ModuleOut, TableOut, WorkflowNodeOut, WorkflowOut } from "../../const/out.tsx"
import config from "../../const/config.js"
import { SnippetsFilled, FolderOpenTwoTone, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Layout, List, Modal, Tabs, Typography } from "antd"
import Sider from "antd/es/layout/Sider"
import { Header, Content } from "antd/es/layout/layout"
import React from "react"
import { ActionType, ModalForm, ProColumns, ProFormDigit, ProFormGroup, ProFormSelect, ProFormText, ProFormTextArea, ProFormTreeSelect, ProTable } from "@ant-design/pro-components"
import { useLocation } from "react-router"
import url from "../../const/url.js"

const { Title } = Typography

type WorkflowNodeInSimple = {
    workflowNodeName: string
    isCounterSign: number
    nodeType: number
    workflowId: number
    viewNo: number
}

const CreateNode = (prop: { workflowId: number , actionRef: React.MutableRefObject<ActionType | undefined> }) => {
    const workflowId = prop.workflowId !== 0 ? prop.workflowId : null
    const [form] = Form.useForm<WorkflowNodeInSimple>();
    let jump: boolean = false;
    return (
        <ModalForm<WorkflowNodeInSimple>
            title="创建流程"
            trigger={
                <Button type="primary">
                    <PlusOutlined />
                    创建节点
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
            onFinish={async (values: WorkflowNodeInSimple) => {
                console.log(values)
                let dataId: number = await newData(config.backs.workflowNode, values)
                if (dataId != -1) {
                    if (jump)
                        window.location.assign(url.backUrl.workflow_node_concrete + dataId);
                    prop.actionRef.current?.reload()
                    form.resetFields()
                    return true
                }
                return false
            }}
        >
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

            <ProFormDigit
                width="md"
                name="viewNo"
                label="节点显示顺序"
                tooltip="节点排列时的显示顺序"
                placeholder="默认排列在最后"
                required={false}
                fieldProps={{ precision: 0 }} />

        </ModalForm>
    )
}

const BackNodeList = (prop: { workflowId: number }) => {
    const actionRef = useRef<ActionType>();
    const query = new URLSearchParams(useLocation().search);
    const columns: ProColumns<WorkflowNodeOut>[] = [
        {
            key: 'code',
            title: '编号',
            dataIndex: 'dataId',
            valueType: "indexBorder",
            width: 48,
            align: "center"
        }, {
            key: 'workflowNodeName',
            title: '节点名称',
            dataIndex: 'workflowNodeName'
        }, {
            key: 'nodeType',
            title: '节点类型',
            dataIndex: 'nodeType',
            valueType: 'select',
            request: async () => {
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
            }
        }, {
            key: 'isCounterSign',
            title: '是否会签',
            dataIndex: 'isCounterSign',
            valueType: 'select',
            request: async () => {
                return [
                    {
                        label: "否",
                        value: 0
                    }, {
                        label: "是",
                        value: 1
                    }
                ]
            }
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
                  window.open(url.backUrl.workflow_node_concrete+entity.dataId)
                }}
              >
                编辑
              </Button>
          }
    )
    return (
        <ProTable<WorkflowNodeOut>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params, sort, filter) => {
                if (prop.workflowId !== null)
                    params.workflowId = prop.workflowId
                return getDataList(config.backs.workflowNode, params)
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
            headerTitle="节点列表"
            toolBarRender={() => [
                <CreateNode key="create" workflowId={prop.workflowId} actionRef={actionRef} />
            ]}
        />
    )
}

const BackNode = (prop: { workflowId: number }) => {
    let header = (
        <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px", }}>
            <div style={{ display: 'flex' }}>
                <FolderOpenTwoTone style={{ fontSize: "36px", marginTop: "15px", marginLeft: "5px" }} />
                <Title level={2} style={{ color: 'GrayText', marginLeft: '10px', marginBottom: '15px' }}>节点列表</Title>
            </div>
        </Header>)
    if (prop.workflowId !== 0)
        header = <></>
    return (
        <Layout style={{ minHeight: '100vh' }}>
            {header}
            <Content style={{ padding: '15px 50px', minHeight: '100%' }}>
                <BackNodeList workflowId={prop.workflowId} />
            </Content>
        </Layout>
    )
}

BackNode.defaultProps = {
    workflowId: 0
}

export default BackNode