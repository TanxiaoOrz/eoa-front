﻿import React, { useEffect, useRef } from "react"
import { getDataList } from "../../const/http.tsx"
import { RequestOut } from "../../const/out.tsx"
import config from "../../const/config.js"
import { FolderOpenTwoTone } from "@ant-design/icons"
import { Button, Layout, Typography } from "antd"
import { Header, Content } from "antd/es/layout/layout"
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components"
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
            key: 'submitTimeFilter',
            title: '提交时间',
            dataIndex: 'submitTime',
            valueType: "dateTimeRange",
            hideInTable: true
        }, {
            key: 'finishTime',
            title: '归档时间',
            dataIndex: 'finishTime',
            hideInSearch: true,
            valueType: 'dateTime'
        }, {
            key: 'action',
            title: '操作',
            dataIndex: 'requestId',
            hideInSearch: true,
            render: (dom, entity, index, action, schema) => {
                return (
                    <Button
                        onClick={() => {
                            window.open(url.backUrl.request_concrete + entity.requestId + "?workflowId=" + entity.workflowId)
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
            pagination={{ pageSize: 10 }}
            dateFormatter="string"
            headerTitle="流程监控"
            request={async (params, sort, filter) => {
                return getDataList(config.backs.request, params)
            }}
        />
    )
}

const BackRequest = () => {
    useEffect(() => {
        document.title = '流程监控'
    })
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px", }}>
                <div style={{ display: 'flex' }}>
                    <FolderOpenTwoTone style={{ fontSize: "36px", marginTop: "15px", marginLeft: "5px" }} />
                    <Title level={2} style={{ color: 'GrayText', marginLeft: '10px', marginBottom: '15px' }}>流程监控</Title>
                </div>
            </Header>
            <Content style={{ padding: '15px 50px', minHeight: '100%' }}>
                <RequestList />
            </Content>
        </Layout>
    )
}

export default BackRequest