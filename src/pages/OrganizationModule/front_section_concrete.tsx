import React, { useEffect, useState } from "react"
import { FileOut, HumanOut, SectionOut } from "../../const/out.tsx"
import { UpdateData, getDataList, getDataOne } from "../../const/http.tsx"
import { useParams } from "react-router"
import { Avatar, Button, Flex, Form, Layout, Tabs, TabsProps, Typography, Upload, UploadProps, message } from "antd"
import config from "../../const/config.js"
import Sider from "antd/es/layout/Sider"
import { Header, Content } from "antd/es/layout/layout"
import PageWait from "../../componet/PageWait.tsx"
import { UploadOutlined, UserOutlined } from "@ant-design/icons"
import { ProForm, ProFormGroup, ProFormText, ProFormDatePicker, ProFormTreeSelect } from "@ant-design/pro-components"
import { FormInstance } from "antd/es/form/index"
import FrontDepart from "./front_depart.tsx"
import url from "../../const/url.js"
import FrontSection from "./front_section.tsx"

const { Title, Paragraph, Text } = Typography;

type SectionIn = {
    sectionName: string
    sectionCode: string
    fullName: string
    belongSection: number
    sectionManager: number
    sectionIntroduction: string
    createTime: string
    photo: number
}

const BaseInformation = (prop: { section: SectionOut, editable: boolean, form: FormInstance }) => {
    console.log("prop.editable", prop.editable)
    return (
        <div style={{ display: "flex", background: "#fdfdfd", paddingTop: "30px", paddingLeft: "10px" }}>
            <ProForm<SectionIn>
                form={prop.form}
                style={{
                    margin: "0 auto",
                    minHeight: "90vh"
                }}
                disabled={!(prop.editable)}
                submitter={false}
                layout="horizontal"
                initialValues={prop.section}
                onFinish={async (section: SectionIn) => {
                    return (await UpdateData(config.fronts.section + "/" + prop.section.dataId, section))
                }}

            >
                <ProFormGroup size={"large"} title="基本信息">
                    <ProFormText
                        width="md"
                        name="sectionName"
                        label="分部名称"
                        tooltip="最长为33位"
                        placeholder="请输入分部名称"
                        required={true}
                    />
                    <ProFormText
                        width="md"
                        name="sectionCode"
                        label="分部编号"
                        tooltip="最长为33位"
                        placeholder="请输入分部编号"
                        required={true}
                    />
                    <ProFormText
                        name="fullName"
                        label="分部全称"
                        tooltip="最长为33位"
                        placeholder="请输入分部全称"
                        width='md'
                    />
                    <ProFormDatePicker
                        name="createTime"
                        label="创建时间"
                        placeholder="请选择创建时间"
                        width='md'
                    />
                </ProFormGroup>
                <ProFormGroup size={"large"} title="组织信息">
                    <ProFormTreeSelect
                        width="md"
                        name="belongSection"
                        label="所属分部"
                        tooltip="仅为未废弃分部"
                        placeholder="请选择分部"
                        disabled
                        request={async () => {
                            let sections: SectionOut[] = (await getDataList(config.fronts.section, { toBrowser: true, isDeperacted: 0 })).data
                            return sections.map((depart, index, array) => { return { title: depart.sectionName, value: depart.dataId } })
                        }}
                        required={true}
                        addonAfter={<Button onClick={() => (window.open(url.frontUrl.humanResource + prop.form.getFieldValue("belongSection")))}>查看</Button>}
                    />
                    <ProFormTreeSelect
                        width="md"
                        name="sectionManager"
                        label="分部经理"
                        tooltip="仅显示未离职人员"
                        placeholder="请选择领导"
                        request={async () => {
                            let humans: HumanOut[] = (await getDataList(config.fronts.human, { toBrowser: true, isDeprecated: 0 })).data
                            return humans.map((value, index, array) => { return { title: value.name, value: value.dataId } })
                        }}
                        required={true}
                        addonAfter={<Button onClick={() => (window.open(url.frontUrl.humanResource + prop.form.getFieldValue("sectionManager")))}>查看</Button>}
                    />
                </ProFormGroup>
            </ProForm>
        </div>
    )
}

const FrontSectionConcrete = () => {
    const departId = useParams().dataId
    const [form] = Form.useForm<SectionIn>()
    const [humanSelf, setHumanSelf] = useState<HumanOut>()
    const [section, setSection] = useState<SectionOut>()
    const [photo, setPhoto] = useState<FileOut>()
    const [signature, setSignature] = useState<string>("无")
    useEffect(() => {
        if (section === undefined) {
            getDataOne(config.fronts.section + "/" + departId).then((value) => {
                if (value.success) {
                    setSection(value.data)
                    setSignature(value.data.signature ?? "无")
                    if (value.data.photo !== undefined && value.data.photo != null && value.data.photo !== 0)
                        getDataOne(config.fronts.file + "/" + value.data.photo).then((photo) => {
                            if (photo.success)
                                setPhoto(photo.data)
                        })
                }
            })
            getDataOne(config.fronts.human_self).then((value) => {
                if (value.success)
                    setHumanSelf(value.data)
            })
        }
    })
    if (section == undefined)
        return (<PageWait />)
    let avaterGroup: React.JSX.Element[] = []
    if (photo === undefined)
        avaterGroup.push(<Avatar style={{ width: "100%" }} shape="square" size={64} icon={<UserOutlined />} />)
    else
        avaterGroup.push(<Avatar style={{ width: "100%" }} shape="square" size={64} src={config.backUrl + photo?.fileRoute} />)
    let editable = humanSelf?.dataId === section.sectionManager


    avaterGroup.push(<Title level={5}>分部介绍</Title>)
    avaterGroup.push(
        <Paragraph
            editable={!editable ? false : {
                onChange: (value) => {
                    form.setFieldValue("signature", value)
                    section.sectionIntroduction = value
                    setSignature(value)
                }
            }}>{signature}</Paragraph>)
    const baseStyle: React.CSSProperties = {
        width: '25%',
    };

    const upLoadProos: UploadProps = {
        headers: {
            tokens: localStorage.getItem('tokens') ?? ""
        },
        method: "POST",
        action: config.backUrl + config.fronts.upload + "/form",
        data: {
            leadContent: 4
        },
        showUploadList: false,
        maxCount: 1,
        onChange: (info) => {
            let { status, response } = info.file
            if (status === 'done')
                if (response.code === 0) {
                    let file: FileOut = response.entity
                    message.success("上传成功")
                    form.setFieldValue("photo", file.dataId)
                    setPhoto(file)
                } else {
                    message.error(response.description)
                }
        },
        itemRender: () => (<></>)
    }

    let buttons = [<Upload {...upLoadProos} ><Button icon={<UploadOutlined />}>修改展示照片</Button></Upload>, <Button style={{ marginLeft: "5px" }} type="primary" key={"save"} onClick={() => { form.submit() }} disabled={!editable}>编辑并保存</Button>]
    let title = ((section.isDeprecated === 0) ? "" : "  (已封存)")

    const items: TabsProps['items'] = [
        {
            key: 'base',
            label: '基本信息',
            children: <BaseInformation section={section} editable={editable} form={form} />,
        },
        {
            key: 'sections',
            label: '下级分部',
            children: <FrontSection section={section.dataId} />,
        },
        {
            key: 'departs',
            label: '下级部门',
            children: <FrontDepart section={section.dataId} />,
        },
    ];
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider style={{ padding: '15px 50px', minHeight: '100%', background: "#f1ffff", marginRight: "5px" }} width={210}>
                {avaterGroup}

            </Sider>

            <Layout>
                <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px", }}>
                    <Title level={2} style={{ color: 'GrayText', marginLeft: '10px', marginBottom: '15px' }}>{section.sectionName + title}</Title>
                </Header>
                <Flex vertical={false} style={{ background: "#ffffff", padding: "10px" }}>
                    {Array.from({ length: 4 }).map((_, i) => (<div key={i} style={{ ...baseStyle }} />))}
                    {buttons}
                    <div style={{ width: "2.5%" }}></div>
                </Flex>
                <Content style={{ padding: '15px 50px', minHeight: '100%' }}>
                    <Tabs defaultActiveKey="base" items={items} />
                </Content>
            </Layout>
        </Layout>
    )
}

export default FrontSectionConcrete