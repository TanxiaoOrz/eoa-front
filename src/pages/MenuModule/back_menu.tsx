import React, { useRef } from "react"
import { getDataList, newData } from "../../const/http.tsx"
import { MenuOut } from "../../const/out.tsx"
import config from "../../const/config.js"
import { SnippetsFilled, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Layout, Typography } from "antd"
import { Header, Content } from "antd/es/layout/layout"
import { ActionType, ModalForm, ProColumns, ProFormDigit, ProFormText, ProFormTreeSelect, ProTable } from "@ant-design/pro-components"
import url from "../../const/url.js"

const { Title } = Typography;

type MenuIn = {
    contentName: string
    belongContent: number
    contentUrl: string
    viewNumber: number
    shareAuthority: string
}


const CreateMenu = (prop: { belongContent: number | null, actionRef: React.MutableRefObject<ActionType | undefined> }) => {
    const [form] = Form.useForm<MenuIn>();
    let jump: boolean = false;
    return (
        <ModalForm<MenuIn>
            title="菜单"
            trigger={
                <Button type="primary">
                    <PlusOutlined />
                    创建菜单
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
            onFinish={async (values: MenuIn) => {
                console.log(values)
                let dataId: number = await newData(config.backs.menu, values)
                if (dataId != -1) {
                    if (jump)
                        window.location.assign(url.backUrl.menu_concrete + dataId);
                    prop.actionRef.current?.reload()
                    form.resetFields()
                    return true
                }
                return false
            }}
        >
            <ProFormText
                width="md"
                name="contentName"
                label="菜单名称"
                tooltip="最长为33位"
                placeholder="请输入菜单名称"
                required={true} />
            <ProFormTreeSelect
                width="md"
                name="belongContent"
                label="上级菜单"
                placeholder="请选择所属模块"
                tooltip="置空代表根菜单"
                request={async () => {
                    let menuList: MenuOut[] = (await getDataList(config.backs.menu, { toBrowser: true })).data
                    const values: { title: string, value: number, children: any[] }[] = menuList.map(
                        (item) => {
                            return { title: item.contentName, value: item.dataId, children: [] };
                        })
                    return values
                }}
                initialValue={prop.belongContent} />
            <ProFormText
                width="md"
                name="contentUrl"
                label="菜单链接"
                tooltip="最长为333位"
                placeholder="请输入菜单链接"  />
            <ProFormDigit
                width={'md'}
                name={'viewNo'}
                label={'显示顺序'}
                placeholder={"不输入自动排到最后"}
                fieldProps={{ precision: 0 }} />
        </ModalForm>
    )
}


const MenuList = (prop: { belongContent: number | null }) => {
    const actionRef = useRef<ActionType>();
    const columns: ProColumns<MenuOut>[] = [
        {
            key: 'code',
            title: '编号',
            dataIndex: 'dataId',
            valueType: "indexBorder",
            width: 48,
            align: "center"
        }, {
            key: 'contentName',
            title: '菜单名称',
            dataIndex: 'contentName'
        }, {
            key: 'contentUrl',
            title: '菜单链接',
            ellipsis: true,
            tooltip: '鼠标移入查看全文',
            render: (dom, entity, index, action, schema) => {
                if (entity.contentUrl)
                    return (
                        <a href={entity.contentUrl}>{entity.contentUrl}</a>
                    )
                else
                    return '无链接'
            },
            dataIndex: "moduleTypeId",
        }, {
            key: 'belongContent',
            title: '上级菜单',
            hideInSearch: true,
            dataIndex: 'tableId',
            render: (dom, entity, index, action, schema) => (
                <Button
                    type="link"
                    onClick={() => {
                        window.open(url.backUrl.menu_concrete + entity.belongContent)
                    }}
                >
                    {entity.belongContentName}
                </Button>
            )
        }, {
            key: 'order',
            title: '显示顺序',
            dataIndex: 'viewNo'
        }, {
            key: 'isDeprecated',
            dataIndex: 'isDeprecated',
            title: "使用情况",
            valueType: 'select',
            request: async () => {
                return [
                    {
                        label: '正常',
                        value: 0
                    }, {
                        label: '废弃',
                        value: 1
                    },
                ]
            }
        }, {
            key: 'creator',
            title: '创建者',
            dataIndex: 'creatorId',
            width: 48 * 2,
            render: (dom, entity, index, action) => (
                <a href={url.frontUrl.humanResource + entity.creator} key={"href" + entity.creator}>{entity.creatorName}</a>
            ),
            hideInSearch: true
        },
        {
            key: 'createTimeShow',
            title: '创建时间',
            dataIndex: 'createTime',
            valueType: "dateTime",
            width: 48 * 4,
            hideInSearch: true
        }, {
            key: 'createTime',
            title: '创建时间',
            dataIndex: 'createTime',
            valueType: "dateTimeRange",
            hideInTable: true
        }, {
            key: 'action',
            title: '操作',
            dataIndex: "dataId",
            width: 48 * 3,
            hideInSearch: true,
            render: (dom, entity, index, action) =>
                <Button
                    type="primary"
                    onClick={() => {
                        window.open(url.backUrl.menu_concrete + entity.dataId)
                    }}
                >
                    编辑
                </Button>
        }
    ]
    return (
        <ProTable<MenuOut>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params, sort, filter) => {
                if (prop.belongContent != null)
                    params.belongContent = prop.belongContent
                return getDataList(config.backs.menu, params)
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
            headerTitle="菜单列表"
            toolBarRender={() => [
                <CreateMenu key="create" belongContent={prop.belongContent} actionRef={actionRef} />
            ]}
        />
    )
}

const BackMenuList = (prop: { belongContent: number | null }) => {
    let header = <></>
    if (prop.belongContent === null)
        header = (
            <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px", }}>
                <SnippetsFilled style={{ fontSize: "36px", marginTop: "30px", marginLeft: "5px", marginBottom: '30px' }} />
                <Title level={2} style={{ color: 'GrayText', marginLeft: '10px', marginBottom: '30px' }}>菜单列表</Title>
            </Header>
        )
    return (
        <Layout style={{ minHeight: '98.5vh' }}>
            {header}
            <Layout hasSider>

                <Content style={{ padding: '15px 50px' }}>
                    <MenuList belongContent={prop.belongContent} />
                </Content>
            </Layout>
        </Layout>
    );
}

BackMenuList.defaultProps = {
    belongContent: null
}


export default BackMenuList