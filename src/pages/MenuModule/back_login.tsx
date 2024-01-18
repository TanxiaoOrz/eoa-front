import { useState, useEffect, useRef } from "react"
import { UpdateData, deleteData, getDataList, newData } from "../../const/http.tsx"
import { ModuleOut, TableOut, SearchListOut, ColumnOut, SearchListColumnOut, LoginConfigOut, MenuOut } from "../../const/out.tsx"
import config from "../../const/config.js"
import { SnippetsFilled, FolderOpenTwoTone, PlusOutlined } from "@ant-design/icons"
import { Button, Dropdown, Form, Layout, List, MenuProps, Tabs, Typography } from "antd"
import Sider from "antd/es/layout/Sider"
import { Header, Content } from "antd/es/layout/layout"
import React from "react"
import { ActionType, ModalForm, ProColumns, ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea, ProFormTreeSelect, ProTable } from "@ant-design/pro-components"
import { useLocation } from "react-router"
import url from "../../const/url.js"

const { Title } = Typography;

type LoginConfigIn = {
    backgroundImageUrl: string,
    logoUrl: string,
    backgroundVideoUrl: string,
    loginTitle: string,
    loginSubTitle: string,
    activeMainTitle: string,
    activeIntroduction: string,
    linkUrl: string,
    linkStr: string,
    contactManager: string
    onUse: number
}


const CreateLoginConfig = (prop: { actionRef: React.MutableRefObject<ActionType | undefined> }) => {
    const [form] = Form.useForm<LoginConfigIn>();
    return (
        <ModalForm<LoginConfigIn>
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
            onFinish={async (values: LoginConfigIn) => {
                console.log(values)
                let dataId: number = await newData(config.backs.login_config, values)
                if (dataId != -1) {
                    prop.actionRef.current?.reload()
                    form.resetFields()
                    return true
                }
                return false
            }}
        >
            <ProFormTextArea
                width="md"
                name="backgroundImageUrl"
                label="背景图片链接"
                tooltip="最长为33位"
                placeholder="请输入背景图片链接" />
            <ProFormTextArea
                width="md"
                name="logoUrl"
                label="企业标志链接"
                tooltip="最长为33位"
                placeholder="请输入企业标志链接" />
            <ProFormTextArea
                width="md"
                name="backgroundVideoUrl"
                label="背景视频链接"
                tooltip="最长为33位"
                placeholder="请输入背景视频链接" />
            <ProFormText
                width="md"
                name="loginTitle"
                label="登录主标题"
                tooltip="最长为33位"
                placeholder="请输入登录主标题" />
            <ProFormText
                width="md"
                name="loginTitle"
                label="登录主标题"
                tooltip="最长为33位"
                placeholder="请输入登录主标题" />
            <ProFormText
                width="md"
                name="loginSubTitle"
                label="登录副标题"
                tooltip="最长为33位"
                placeholder="请输入登录副标题" />
            <ProFormText
                width="md"
                name="activeMainTitle"
                label="活动主标题"
                tooltip="最长为33位"
                placeholder="请输入活动主标题" />
            <ProFormText
                width="md"
                name="activeIntroduction"
                label="活动介绍"
                tooltip="最长为33位"
                placeholder="请输入活动介绍" />
            <ProFormTextArea
                width="md"
                name="linkUrl"
                label="活动链接"
                tooltip="最长为33位"
                placeholder="请输入活动链接" />
            <ProFormText
                width="md"
                name="linkStr"
                label="活动按钮名称"
                tooltip="最长为33位"
                placeholder="请输入活动按钮名称" />
            <ProFormText
                width="md"
                name="contactManager"
                label="管理员联系方式"
                tooltip="最长为33位"
                placeholder="请输入管理员联系方式" />
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
            <ProFormDigit
                width={'md'}
                name={'viewNo'}
                label={'显示顺序'}
                placeholder={"不输入自动排到最后"}
                fieldProps={{ precision: 0 }} />
        </ModalForm>
    )
}

const UpdateLoginConfig = (prop: { loginConfig:LoginConfigOut, actionRef: React.MutableRefObject<ActionType | undefined> }) => {
    const [form] = Form.useForm<LoginConfigIn>();
    return (
        <ModalForm<LoginConfigIn>
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
            initialValues={prop.loginConfig}
            submitter={{
                searchConfig: {
                    submitText: '修改',
                    resetText: '取消',
                },
            }}
            onFinish={async (values: LoginConfigIn) => {
                console.log(values)
                if (await UpdateData(config.backs.login_config + "/" + prop.loginConfig.dataId, values)) {
                    prop.actionRef.current?.reload()
                    return true
                }
                return false
            }}
        >
            <ProFormTextArea
                width="md"
                name="backgroundImageUrl"
                label="背景图片链接"
                tooltip="最长为33位"
                placeholder="请输入背景图片链接" />
            <ProFormTextArea
                width="md"
                name="logoUrl"
                label="企业标志链接"
                tooltip="最长为33位"
                placeholder="请输入企业标志链接" />
            <ProFormTextArea
                width="md"
                name="backgroundVideoUrl"
                label="背景视频链接"
                tooltip="最长为33位"
                placeholder="请输入背景视频链接" />
            <ProFormText
                width="md"
                name="loginTitle"
                label="登录主标题"
                tooltip="最长为33位"
                placeholder="请输入登录主标题" />
            <ProFormText
                width="md"
                name="loginTitle"
                label="登录主标题"
                tooltip="最长为33位"
                placeholder="请输入登录主标题" />
            <ProFormText
                width="md"
                name="loginSubTitle"
                label="登录副标题"
                tooltip="最长为33位"
                placeholder="请输入登录副标题" />
            <ProFormText
                width="md"
                name="activeMainTitle"
                label="活动主标题"
                tooltip="最长为33位"
                placeholder="请输入活动主标题" />
            <ProFormText
                width="md"
                name="activeIntroduction"
                label="活动介绍"
                tooltip="最长为33位"
                placeholder="请输入活动介绍" />
            <ProFormTextArea
                width="md"
                name="linkUrl"
                label="活动链接"
                tooltip="最长为33位"
                placeholder="请输入活动链接" />
            <ProFormText
                width="md"
                name="linkStr"
                label="活动按钮名称"
                tooltip="最长为33位"
                placeholder="请输入活动按钮名称" />
            <ProFormText
                width="md"
                name="contactManager"
                label="管理员联系方式"
                tooltip="最长为33位"
                placeholder="请输入管理员联系方式" />
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
            <ProFormDigit
                width={'md'}
                name={'viewNo'}
                label={'显示顺序'}
                placeholder={"不输入自动排到最后"}
                fieldProps={{ precision: 0 }} />
        </ModalForm>
    )
}


const LoginConfigList = () => {
    const actionRef = useRef<ActionType>();
    const columns: ProColumns<LoginConfigOut>[] = [
        {
            key: 'code',
            title: '编号',
            dataIndex: 'dataId',
            valueType: "indexBorder",
            width: 48,
            align: "center"
        }, {
            key: 'loginTitle',
            title: '登录主标题',
            dataIndex: 'loginTitle',
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
            key: 'order',
            title: '显示顺序',
            valueType: 'index',
            dataIndex: 'viewNo'
        }, {
            key: 'action',
            title: '操作',
            dataIndex: "dataId",
            width: 48 * 3,
            hideInSearch: true,
            render: (dom, entity, index, action) => (
                <UpdateLoginConfig loginConfig={entity} actionRef={actionRef} />
            )
        }
    ]
    let create = <CreateLoginConfig key="create" actionRef={actionRef}  />
    return (
        <ProTable<LoginConfigOut>
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
            headerTitle="登录配置列表"
            toolBarRender={() => [
                create
            ]}
        />
    )
}

const BackLoginConfig = () => {

    return (
        <Layout style={{ minHeight: '98.5vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px", }}>
                <SnippetsFilled style={{ fontSize: "36px", marginTop: "30px", marginLeft: "5px", marginBottom: '30px' }} />
                <Title level={2} style={{ color: 'GrayText', marginLeft: '10px', marginBottom: '30px' }}>登录配置列表</Title>
            </Header>
            <Layout >
                <Content style={{ padding: '15px 50px' }}>
                    <LoginConfigList/>
                </Content>
            </Layout>
        </Layout>
    );
}

BackLoginConfig.defaultProps = {
    searchList: null
}

export default BackLoginConfig