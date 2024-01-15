import { useState, useEffect, useRef } from "react"
import { UpdateData, deleteData, getDataList, getDataOne } from "../../const/http.tsx"
import { ColumnOut, FormOut, SearchListColumnOut, SearchListDtoOut, TableOut, WorkflowNodeOut, WorkflowRouteOut } from "../../const/out.tsx"
import config from "../../const/config"
import { Button, Form, Layout, Typography } from "antd"
import React from "react"
import { ActionType, PageContainer, ProColumns, ProForm, ProFormDatePicker, ProFormDigit, ProFormGroup, ProFormText, ProFormTreeSelect, ProTable } from "@ant-design/pro-components"
import { useParams } from "react-router"
import url from "../../const/url"
import PageWait from "../../componet/PageWait.tsx"
import ActionEdit from "../../componet/ActionEdit.tsx"
import { transprotColumnSearch } from "../../const/columnType.tsx"
import { FolderOpenTwoTone } from "@ant-design/icons"
import { Header, Content } from "antd/es/layout/layout"

const { Title } = Typography

type ModifyRow = {
    id: number
    columnDataName: string |null
    input: string |null
}

type Order = {
    column:string
    type:string
}

const columnGet = (searchListDto: SearchListDtoOut) => {
    window.sessionStorage.setItem("tableId", searchListDto.searchListOut.tableId.toString())
    window.sessionStorage.setItem("isVirtual", (searchListDto.searchListOut.isVirtual === 1).toString())
    let columns: ProColumns[] = []
    for (let i = 0; i < searchListDto.searchListColumns.length; i++) {
        let column: ColumnOut = searchListDto.columns[i]
        let searchColumn: SearchListColumnOut = searchListDto.searchListColumns[i]
        transprotColumnSearch(column, searchColumn.title).forEach((column) => {
            columns.push(column)
        })
    }
    columns.push({
        key: 'action',
        title: '操作',
        dataIndex: 'dataId',
        hideInSearch: true,
        render: (dom, entity, index, action, schema) => {
            return (
                <Button
                    onClick={() => {
                        window.open(url.frontUrl.form_concrete + entity.dataId + "?tableId=" + searchListDto.searchListOut.tableId + "&isVirtual" + (searchListDto.searchListOut.isVirtual === 1))
                    }} >
                    查看
                </Button>
            )
        },
    })
    return columns
}

const translateForm = (form: FormOut) => {
    let display = { dataId: form.dataId }
    for (let [key, value] of Object.entries(form.groups))
        display[key] = value
    return display
}

const FrontSearchConcrete = () => {
    const searchListId = useParams().dataId
    const [searchList, setSearchList] = useState<SearchListDtoOut>()
    const actionRef = useRef<ActionType>()

    useEffect(() => {
        if (searchList === undefined)
            getDataOne(config.fronts.search_list + "/" + searchListId).then((value) => {
                console.log(value.data)
                if (value.success) {
                    setSearchList(value.data)
                }
            })
    })

    if (searchListId === undefined) {
        window.location.replace(url.backUrl.workflow)
        return (<div></div>)
    }

    if (searchList === undefined)
        return (<PageWait />)

    const constraint:ModifyRow[] = JSON.parse(searchList.searchListOut.defaultCondition)
    const order:Order = JSON.parse(searchList.searchListOut.orders)

    const table = (
        <ProTable
            columns={columnGet(searchList)}
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
                for (let {columnDataName, input} of constraint)
                    params[columnDataName??""] = [input]
                params.order = [order.type, order.column]
                let formCon = await getDataList(config.fronts.form, params)
                return {
                    data: (formCon.data as FormOut[]).map((form) => translateForm(form)),
                    success: formCon.success,
                    total: formCon.total
                }
            }}
        />


    )

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px", }}>
                <div style={{ display: 'flex' }}>
                    <FolderOpenTwoTone style={{ fontSize: "36px", marginTop: "15px", marginLeft: "5px" }} />
                    <Title level={2} style={{ color: 'GrayText', marginLeft: '10px', marginBottom: '15px' }}>{searchList.searchListOut.searchListName}</Title>
                </div>
            </Header>
            <Content style={{ padding: '15px 50px', minHeight: '100%' }}>
                {table}
            </Content>
        </Layout>
    )
}

export default FrontSearchConcrete