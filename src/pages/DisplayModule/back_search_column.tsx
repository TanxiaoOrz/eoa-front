import React, { useEffect, useRef } from "react"
import { UpdateData, deleteData, getDataList, newData } from "../../const/http.tsx"
import { SearchListOut, ColumnOut, SearchListColumnOut } from "../../const/out.tsx"
import config from "../../const/config.js"
import { SnippetsFilled, PlusOutlined } from "@ant-design/icons"
import { Button, Dropdown, Form, Layout, MenuProps, Typography } from "antd"
import { Header, Content } from "antd/es/layout/layout"
import { ActionType, ModalForm, ProColumns, ProFormDigit, ProFormSelect, ProFormText, ProFormTreeSelect, ProTable } from "@ant-design/pro-components"
import url from "../../const/url.js"

const { Title } = Typography;

type SearchListColumnIn = {
    columnId: number
    searchListId: number
    title: string
    viewNo: number
    isVirtual: number
}


const CreateSearchListColumn = (prop: { searchListId: number, isVirtual: 0 | 1, tableId: number, actionRef: React.MutableRefObject<ActionType | undefined> }) => {
    const [form] = Form.useForm<SearchListColumnIn>();
    return (
        <ModalForm<SearchListColumnIn>
            title="展示字段"
            trigger={
                <Button type="primary">
                    <PlusOutlined />
                    创建列表字段
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
            }}
            onFinish={async (values: SearchListColumnIn) => {
                console.log(values)
                let dataId: number = await newData(config.backs.search_list_column, values)
                if (dataId != -1) {
                    prop.actionRef.current?.reload()
                    form.resetFields()
                    return true
                }
                return false
            }}
        >
            <ProFormText
                width="md"
                name="title"
                label="列表字段标题"
                tooltip="最长为33位"
                placeholder="请输入流程名称"
                required={true} />
            <ProFormTreeSelect
                width="md"
                name="searchListId"
                label="所属展示列表"
                tooltip="请选择展示列表"
                disabled
                required={true}
                request={async () => {
                    let searchLists: SearchListOut[] = (await getDataList(config.backs.search_list, { toBrowser: true })).data
                    const valueEnumModule: { title: string, value: number, children: any[] }[] = searchLists.map(
                        (item) => {
                            return { title: item.searchListName, value: item.dataId, children: [] };
                        })
                    return valueEnumModule
                }}
                initialValue={prop.searchListId} />
            <ProFormTreeSelect
                width="md"
                name="columnId"
                label="关联字段"
                tooltip="请选择关联字段"
                required={true}
                request={async () => {
                    let columnList: ColumnOut[] = (await getDataList(config.backs.column, { toBrowser: true, isVirtual: prop.isVirtual, tableNo: prop.tableId, columnDetailNo: -1 })).data
                    const valueEnumModule: { title: string, value: number, children: any[] }[] = columnList.map(
                        (item) => {
                            return { title: item.columnViewName, value: item.columnId, children: [] };
                        })
                    return valueEnumModule
                }} />
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
                initialValue={prop.isVirtual}
            />
            <ProFormDigit
                width={'md'}
                name={'viewNo'}
                label={'显示顺序'}
                placeholder={"不输入自动排到最后"}
                fieldProps={{ precision: 0 }} />
        </ModalForm>
    )
}

const UpdateSearchListColumn = (prop: { searchListColumn: SearchListColumnOut, tableId: number, actionRef: React.MutableRefObject<ActionType | undefined> }) => {
    const [form] = Form.useForm<SearchListColumnIn>();
    return (
        <ModalForm<SearchListColumnIn>
            title="展示字段"
            trigger={
                <Button type="primary">
                    编辑
                </Button>
            }
            width={400}
            form={form}
            submitTimeout={2000}
            autoFocusFirstInput
            initialValues={prop.searchListColumn}
            submitter={{
                searchConfig: {
                    submitText: '修改',
                    resetText: '取消',
                },
            }}
            onFinish={async (values: SearchListColumnIn) => {
                // console.log(values)
                if (await UpdateData(config.backs.search_list_column + "/" + prop.searchListColumn.dataId, values)) {
                    prop.actionRef.current?.reload()
                    return true
                }
                return false
            }}
        >
            <ProFormText
                width="md"
                name="title"
                label="列表字段标题"
                tooltip="最长为33位"
                placeholder="请输入列表字段标题"
                required={true} />
            <ProFormTreeSelect
                width="md"
                name="searchListId"
                label="所属展示列表"
                tooltip="请选择展示列表"
                disabled
                required={true}
                request={async () => {
                    let searchLists: SearchListOut[] = (await getDataList(config.backs.search_list, { toBrowser: true })).data
                    console.log("searchLists", searchLists)
                    const valueEnumModule: { title: string, value: number, children: any[] }[] = searchLists.map(
                        (item) => {
                            return { title: item.searchListName, value: item.dataId, children: [] };
                        })
                    return valueEnumModule
                }} />
            <ProFormTreeSelect
                width="md"
                name="columnId"
                label="关联字段"
                tooltip="请选择关联字段"
                required={true}
                request={async () => {
                    let columnList: ColumnOut[] = (await getDataList(config.backs.column, { toBrowser: true, isVirtual: prop.searchListColumn.isVirtual, tableNo: prop.tableId, columnDetailNo: -1 })).data
                    const valueEnumModule: { title: string, value: number, children: any[] }[] = columnList.map(
                        (item) => {
                            return { title: item.columnViewName, value: item.columnId, children: [] };
                        })
                    return valueEnumModule
                }} />
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
            <ProFormDigit
                width={'md'}
                name={'viewNo'}
                label={'显示顺序'}
                placeholder={"不输入自动排到最后"}
                fieldProps={{ precision: 0 }} />
        </ModalForm>
    )
}

const DeleteSearchListColumn = (prop: { dataId: number, actionRef: React.MutableRefObject<ActionType | undefined> }) => {
    return (
        <Button
            danger
            onClick={async () => {
                deleteData(config.backs.search_list_column + "/" + prop.dataId).then((value) => {
                    if (value)
                        prop.actionRef.current?.reload()
                })

            }} >删除</Button>
    )
}


const SearchListColumnList = (prop: { searchList: SearchListOut | null }) => {
    const actionRef = useRef<ActionType>();
    const columns: ProColumns<SearchListColumnOut>[] = [
        {
            key: 'code',
            title: '编号',
            dataIndex: 'dataId',
            valueType: "indexBorder",
            width: 48,
            align: "center"
        }, {
            key: 'searchListName',
            title: '所属列表名称',
            dataIndex: 'searchListName',
            hideInSearch: true,
            render: (dom, entity, index, action, schema) => (
                <Button
                    type="link"
                    onClick={() => {
                        window.open(url.backUrl.search_list_concrete + '/' + entity.searchListId)
                    }}
                >
                    {entity.searchListName}
                </Button>
            )
        }, {
            key: 'columName',
            title: '关联字段',
            hideInSearch: true,
            dataIndex: 'columName',
        }, {
            key: 'isVirtual',
            title: '是否虚拟',
            dataIndex: 'isVirtual',
            valueType: 'select',
            request: async () => [
                {
                    label: '是',
                    value: 1
                }, {
                    label: '否',
                    value: 0
                }
            ]
        }, {
            key: 'viewNo',
            title: '显示顺序',
            valueType: 'index',
            dataIndex: 'viewNo'
        }, {
            key: 'action',
            title: '操作',
            dataIndex: "dataId",
            width: 48 * 3,
            hideInSearch: true,
            render: (dom, entity, index, action) => {
                let deleteB = <DeleteSearchListColumn key={"delete"} dataId={entity.dataId} actionRef={actionRef} />
                if (prop.searchList === null)
                    return deleteB
                let updateB = <UpdateSearchListColumn key={"edit"} searchListColumn={entity} actionRef={actionRef} tableId={prop.searchList?.tableId} />
                let items: MenuProps['items'] = [
                    {
                        key: "edit",
                        label: updateB,
                    }, {
                        key: "delete",
                        label: deleteB
                    }
                ]
                return (
                    <Dropdown
                        menu={{ items }}
                        placement='bottomLeft'

                    >
                        <Button>操作</Button>
                    </Dropdown>

                )
            }
        }
    ]
    let create = <></>
    if (prop.searchList !== null)
        create = <CreateSearchListColumn key="create" tableId={prop.searchList.tableId} searchListId={prop.searchList.dataId} actionRef={actionRef} isVirtual={prop.searchList.isVirtual as 0 | 1} />
    return (
        <ProTable<SearchListColumnOut>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params, sort, filter) => {
                if (prop.searchList?.dataId != null)
                    params.searchListId = prop.searchList.dataId
                return getDataList(config.backs.search_list_column, params)
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
            headerTitle="工作流列表"
            toolBarRender={() => [
                create
            ]}
        />
    )
}

const BackSearchListColumn = (prop: { searchList: SearchListOut | null }) => {
    useEffect(()=>{
        if (prop.searchList === null)
            document.title = '展示字段列表'
    })

    let header = <></>
    if (prop.searchList === null)
        header = (
            <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px", }}>
                <SnippetsFilled style={{ fontSize: "36px", marginTop: "30px", marginLeft: "5px", marginBottom: '30px' }} />
                <Title level={2} style={{ color: 'GrayText', marginLeft: '10px', marginBottom: '30px' }}>搜索列表</Title>
            </Header>
        )

    return (
        <Layout style={{ minHeight: '98.5vh' }}>
            {header}
            <Layout >
                <Content style={{ padding: '15px 50px' }}>
                    <SearchListColumnList searchList={prop.searchList} />
                </Content>
            </Layout>
        </Layout>
    );
}

BackSearchListColumn.defaultProps = {
    searchList: null
}

export default BackSearchListColumn