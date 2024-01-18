import React, { useRef } from "react"
import { UpdateData, getDataList, newData } from "../../const/http.tsx"
import { LoginConfigOut, PageConfigOut } from "../../const/out.tsx"
import config from "../../const/config.js"
import { SnippetsFilled, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Layout, Typography } from "antd"
import { Header, Content } from "antd/es/layout/layout"
import { ActionType, ModalForm, ProColumns, ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea, ProTable } from "@ant-design/pro-components"

const { Title } = Typography;

type PageConfigIn = {
    companyName:string
    headerColor:string
    sideColor:string
    onUse:number
}


const CreatePageConfig = (prop: { actionRef: React.MutableRefObject<ActionType | undefined> }) => {
    const [form] = Form.useForm<PageConfigIn>();
    return (
        <ModalForm<PageConfigIn>
            title="登陆设置"
            trigger={
                <Button type="primary">
                    <PlusOutlined />
                    新建
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
            onFinish={async (values: PageConfigIn) => {
                console.log(values)
                let dataId: number = await newData(config.backs.page_config, values)
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
                name="headerColor"
                label="头部导航栏颜色"
                tooltip="最长为33位"
                placeholder="请输入头部导航栏颜色" />
                <ProFormText
                width="md"
                name="sideColor"
                label="侧边导航栏颜色"
                tooltip="最长为33位"
                placeholder="请输入侧边导航栏颜色" />
                <ProFormText
                width="md"
                name="companyName"
                label="公司名称"
                tooltip="最长为33位"
                placeholder="请输入公司名称" />
            <ProFormSelect
                width="md"
                name="onUse"
                label="是否启用"
                placeholder="请选择是否启用"
                request={async () => [
                    {
                        label: '是',
                        value: 1
                    }, {
                        label: '否',
                        value: 0
                    }
                ]}
                required={true}
            />
        </ModalForm>
    )
}

const UpdatePageConfig = (prop: { pageConfig:PageConfigOut, actionRef: React.MutableRefObject<ActionType | undefined> }) => {
    const [form] = Form.useForm<PageConfigIn>();
    return (
        <ModalForm<PageConfigIn>
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
            initialValues={prop.pageConfig}
            submitter={{
                searchConfig: {
                    submitText: '修改',
                    resetText: '取消',
                },
            }}
            onFinish={async (values: PageConfigIn) => {
                console.log(values)
                if (await UpdateData(config.backs.page_config + "/" + prop.pageConfig.dataId, values)) {
                    prop.actionRef.current?.reload()
                    return true
                }
                return false
            }}
        >
            <ProFormText
                width="md"
                name="headerColor"
                label="头部导航栏颜色"
                tooltip="最长为33位"
                placeholder="请输入头部导航栏颜色" />
                <ProFormText
                width="md"
                name="sideColor"
                label="侧边导航栏颜色"
                tooltip="最长为33位"
                placeholder="请输入侧边导航栏颜色" />
                <ProFormText
                width="md"
                name="companyName"
                label="顶部标题"
                tooltip="最长为33位"
                placeholder="请输入公司名称" />
            <ProFormSelect
                width="md"
                name="onUse"
                label="是否启用"
                placeholder="请选择是否启用"
                request={async () => [
                    {
                        label: '是',
                        value: 1
                    }, {
                        label: '否',
                        value: 0
                    }
                ]}
                required={true}
            />
        </ModalForm>
    )
}


const LoginConfigList = () => {
    const actionRef = useRef<ActionType>();
    const columns: ProColumns<PageConfigOut>[] = [
        {
            key: 'code',
            title: '编号',
            dataIndex: 'dataId',
            valueType: "indexBorder",
            width: 48,
            align: "center"
        }, {
            key: 'companyName',
            title: '顶部标题',
            dataIndex: 'companyName',
        }, {
            key: 'onUse',
            title: '是否启用',
            dataIndex: 'onUse',
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
            key: 'action',
            title: '操作',
            dataIndex: "dataId",
            width: 48 * 3,
            hideInSearch: true,
            render: (dom, entity, index, action) => (
                <UpdatePageConfig pageConfig={entity} actionRef={actionRef} />
            )
        }
    ]
    let create = <CreatePageConfig key="create" actionRef={actionRef}  />
    return (
        <ProTable<PageConfigOut>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params, sort, filter) => {
                return getDataList(config.backs.login_config, params)
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
            headerTitle="页面配置列表"
            toolBarRender={() => [
                create
            ]}
        />
    )
}

const BackPageConfig = () => {

    return (
        <Layout style={{ minHeight: '98.5vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px", }}>
                <SnippetsFilled style={{ fontSize: "36px", marginTop: "30px", marginLeft: "5px", marginBottom: '30px' }} />
                <Title level={2} style={{ color: 'GrayText', marginLeft: '10px', marginBottom: '30px' }}>页面配置列表</Title>
            </Header>
            <Layout >
                <Content style={{ padding: '15px 50px' }}>
                    <LoginConfigList/>
                </Content>
            </Layout>
        </Layout>
    );
}

export default BackPageConfig