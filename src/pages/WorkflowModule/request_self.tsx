import { useState, useEffect, useRef } from "react"
import { getDataList, newData } from "../../const/http.tsx"
import { ModuleOut, RequestOut, TableOut, WorkflowNodeOut, WorkflowOut, WorkflowRouteOut } from "../../const/out.tsx"
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

const RequestList = () => {
    const actionRef = useRef<ActionType>()
    const columns: ProColumns<RequestOut>[] = [
        {
            key: 'code',
            title: '编号',
            dataIndex: 'requestId',
            valueType: "indexBorder",
            width: 48,
            align: "center"
        }, {
            key: 'title',
            title: '流程标题',
            dataIndex: 'requestTitle',
        }, {
            key: 'node',
            title: '当前节点',
            dataIndex: 'currentNodeName',
            hideInSearch: true
        }, {
            key: 'workflow',
            title: '所属流程',
            dataIndex: 'workflowName',
            hideInSearch: true
        }, {
            key: 'submitTime',
            title: '提交时间',
            dataIndex: 'submitTime',
            hideInSearch: true,
            valueType: 'dateTime'
        }, {
            key: 'createTime',
            title: '创建时间',
            dataIndex: 'submitTime',
            valueType: "dateTimeRange",
            hideInTable: true
        }, {
            key: 'action',
            title: '操作',
            dataIndex: 'requestId',
            hideInSearch: true,
            render: (dom, entity, index, action, schema) => {
                return (
                    <Button
                        onClick={() => {
                            window.open(url.frontUrl.request_concrete + entity.requestId + "?workflowId="+entity.workflowId)
                        }} >
                        查看
                    </Button>
                )
            },
        }
    ]

    return (
        <ProTable<RequestOut>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            rowKey='requestId'
            search={{
                labelWidth: 'auto',
            }}
            options={{
                setting: {
                    listsHeight: 400,
                },
            }}
            pagination={{pageSize: 10}}
            dateFormatter="string"
            headerTitle="我的请求"
            request={async (params,sort,filter)=>{
                params.type = 'self'
                return getDataList(config.fronts.request,params)
            }}
            />
    )
}

const RequestSelf = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px", }}>
            <div style={{ display: 'flex' }}>
                <FolderOpenTwoTone style={{ fontSize: "36px", marginTop: "15px", marginLeft: "5px" }} />
                <Title level={2} style={{ color: 'GrayText', marginLeft: '10px', marginBottom: '15px' }}>我的请求</Title>
            </div>
        </Header>
            <Content style={{ padding: '15px 50px', minHeight: '100%' }}>
                <RequestList/>
            </Content>
        </Layout>
    )
}

export default RequestSelf