import React, { useState, useEffect, useRef } from "react"
import { UpdateData, deleteData, getDataList, getDataOne } from "../../const/http.tsx"
import { ModuleOut, SearchListOut, TableOut } from "../../const/out.tsx"
import config from "../../const/config"
import { Button, Form, Input, Select } from "antd"
import { EditableFormInstance, EditableProTable, PageContainer, ProColumns, ProForm, ProFormDatePicker, ProFormGroup, ProFormSelect, ProFormText, ProFormTreeSelect } from "@ant-design/pro-components"
import { useParams } from "react-router"
import url from "../../const/url"
import PageWait from "../../componet/PageWait.tsx"
import BackSearchListColumn from "./back_search_column.tsx"
import { AuthorityEdit } from "../../componet/AuthorityEdit.tsx"


type SearchListIn = {
    moduleTypeId: number
    searchListName: string
    defaultCondition: string
    tableId: number
    shareAuthority: string
    orders: string
    isVirtual: number

}

type Order = {
    column: string
    type: string
}

type ModifyRow = {
    id: number
    columnDataName: string | null
    input: string | null
}


const BackSearchListConcrete = () => {
    const searchListId = useParams().dataId
    const [form] = Form.useForm<SearchListIn>()
    const [searchList, setSearchList] = useState<SearchListOut>()
    const [virtual, setVirtual] = useState<number>(0)
    const editorFormRef = useRef<EditableFormInstance>();
    const [modifyRows, setModifyRows] = useState<readonly ModifyRow[]>([])

    useEffect(() => {
        if (searchList === undefined)
            getDataOne(config.backs.search_list + "/" + searchListId).then((value) => {
                console.log(value.data)
                if (value.success) {
                    setSearchList(value.data)
                    setVirtual(value.data.isVirtual ?? 0)
                }
            })
    })
    useEffect(() => {
        document.title = '展示列表-' + searchList?.searchListName
    }, [searchList?.searchListName])

    if (searchListId === undefined) {
        window.location.replace(url.backUrl.workflow)
        return (<div></div>)
    }

    if (searchList === undefined)
        return (<PageWait />)


    const dropSearchList = async () => {
        if ((await deleteData(config.backs.search_list + "/" + searchListId)))
            setTimeout(() => window.close(), 1000)
    }

    const searchListBase = (
        <div style={{ display: "flex", background: "#fdfdfd", paddingTop: "30px", paddingLeft: "10px" }}>
            <ProForm<SearchListIn>
                form={form}
                style={{
                    margin: "0 auto",
                    minHeight: "90vh"
                }}

                submitter={false}
                layout="horizontal"
                initialValues={searchList}
                onFinish={async (searchListIn: SearchListIn) => {
                    let defaultCondition = {}
                    modifyRows.forEach((modifyRow) => {
                        if (modifyRow.columnDataName) {
                            defaultCondition[modifyRow.columnDataName] = modifyRow.input
                        }
                    })
                    searchListIn.defaultCondition = JSON.stringify(defaultCondition)
                    searchListIn.shareAuthority = searchList.shareAuthority
                    searchListIn.orders = searchList.orders
                    if (await UpdateData(config.backs.search_list + "/" + searchListId, searchListIn)) {
                        setTimeout(() => window.location.reload(), 1000)
                        return true
                    } else
                        return false
                }}
                onValuesChange={(changedValues, workflowIn) => {
                    if (workflowIn.isVirtual !== virtual)
                        setVirtual(workflowIn.isVirtual)
                }}
            >
                <ProFormGroup size={"large"} title="基本信息" >
                    <ProFormText
                        width="md"
                        name="searchListName"
                        label="流程名称"
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
                        }} />
                        <div style={{width:"50vh"}}/>
                    <ProFormTreeSelect
                        width="md"
                        name="tableId"
                        label="关联表单"
                        tooltip="请选择关联表单"
                        required={true}
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
                                onClick={() => { window.open(url.backUrl.table_concrete + searchList.tableId) }}
                            >查看</Button>
                        } />
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
                        name="creatorName"
                        addonAfter={<Button onClick={() => { window.open(url.frontUrl.humanResource + searchList.creator) }}>查看</Button>}
                    />
                </ProFormGroup>

            </ProForm>
        </div>
    )
    let order: Order = {
        column: '',
        type: 'asc'
    }
    if (searchList.orders !== undefined) {
        order = JSON.parse(searchList.orders)
    }
    const orderChange = (value: any, type: 0 | 1) => {
        if (type === 0)
            order.column = value
        else
            order.type = value
        searchList.orders = JSON.stringify(order)
    }




    const modifyColumn: ProColumns<ModifyRow>[] = [
        {
            key: "columnId",
            dataIndex: "columnDataName",
            title: "字段名称",
        }, {
            key: "edit",
            dataIndex: "input",
            title: "条件值",
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

    const tableModify = (
        <EditableProTable
            editableFormRef={editorFormRef}
            rowKey="id"
            headerTitle="默认查询条件"
            scroll={{
                x: 960,
            }}
            recordCreatorProps={{
                position: 'bottom',
                record: () => ({ id: parseInt((Math.random() * 1000000).toFixed(0)), columnDataName: null, input: null }),
            }}
            loading={false}
            columns={modifyColumn}
            request={async () => {
                let modifyRows = searchList.defaultCondition ?
                    Object.entries(JSON.parse(searchList.defaultCondition)).map((key, index) => {
                        return { id: index, columnDataName: key[0], input: key[1] as string }
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

    const configPage = (
        <div style={{ margin: "5px" }}>
            <p>排序字段</p>
            <Input placeholder="请输入排序字段" onChange={(value) => { orderChange(value, 0) }} style={{ width: "30%" }} />
            <Select
                options={[
                    {
                        label: '升序',
                        value: 'asc'
                    }, {
                        label: '降序',
                        value: 'desc'
                    }
                ]}
                placeholder='请输入排序选项'
                onChange={(value) => { orderChange(value, 1) }} />
            <p>默认条件</p>
            {tableModify}
        </div>
    )

    let title = ""
    return (
        <div
            style={{ background: '#F5F7FA' }}
        >
            <PageContainer
                header={{
                    title: searchList.searchListName + title,
                    breadcrumb: {
                        items: [
                            {
                                title: '展示列表',
                            },
                            {
                                title: searchList.searchListName,
                            },
                        ],
                    },
                    extra: [
                        <Button key='save' type="primary" onClick={() => { form.submit() }}>保存</Button>,
                        <Button key='reset' onClick={() => { form.resetFields() }}>重置</Button>,
                        <Button key='drop' type='default' danger onClick={dropSearchList}>封存</Button>
                    ]
                }}
                tabList={[
                    {
                        key: "base",
                        tab: "基本信息",
                        children: searchListBase
                    }, {
                        key: "columns",
                        tab: "展示字段信息",
                        children: <BackSearchListColumn searchList={searchList} />
                    }, {
                        key: "authority",
                        tab: "共享信息",
                        children: <AuthorityEdit entity={searchList} authorityName="shareAuthority" />
                    }, {
                        key: 'config',
                        tab: '配置信息',
                        children: configPage
                    }
                ]}
            />
        </div>
    )

}

export default BackSearchListConcrete