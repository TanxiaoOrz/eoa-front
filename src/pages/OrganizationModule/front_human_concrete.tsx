import React, { useEffect, useState } from "react"
import { DepartOut, FileOut, HumanOut, SectionOut } from "../../const/out.tsx"
import { UpdateData, getDataList, getDataOne } from "../../const/http.tsx"
import { useParams } from "react-router"
import { Avatar, Button, Flex, Form, Layout, Typography, Upload, UploadProps, message } from "antd"
import config from "../../const/config.js"
import Sider from "antd/es/layout/Sider"
import { Header, Content } from "antd/es/layout/layout"
import PageWait from "../../componet/PageWait.tsx"
import { UploadOutlined, UserOutlined } from "@ant-design/icons"
import { ProForm, ProFormGroup, ProFormText, ProFormSelect, ProFormDigit, ProFormDatePicker, ProFormTreeSelect } from "@ant-design/pro-components"
import { FormInstance } from "antd/es/form/index"
import url from "../../const/url.js"

const { Title, Paragraph, Text } = Typography;

type HumanIn = {
    loginName: string
    password: string
    name: string
    sex: number
    birth: string
    age: number
    telephone: string
    mail: string
    phone: string
    fax: string
    workCode: string
    depart: number
    job: string
    directorLeader: number
    supporter: number
    photo: number
    signature: string
    lastLogin: Date
    safety: number
}

const BaseInformation = (prop: { human: HumanOut, editable: boolean, form: FormInstance }) => {
    console.log("prop.editable", prop.editable)
    return (
        <div style={{ display: "flex", background: "#fdfdfd", paddingTop: "30px", paddingLeft: "10px" }}>
            <ProForm<HumanIn>
                form={prop.form}
                style={{
                    margin: "0 auto",
                    minHeight: "90vh"
                }}
                disabled={!(prop.editable)}
                submitter={false}
                layout="horizontal"
                initialValues={prop.human}
                onFinish={async (human: HumanIn) => {
                    return (await UpdateData(config.fronts.human + "/" + prop.human.dataId, human))
                }}

            >
                <ProFormGroup size={"large"} title="登录信息">
                    <ProFormText
                        width="md"
                        name="loginName"
                        label="登录名"
                        tooltip="最长为33位"
                        placeholder="请输入表单显示名称"
                        required={true}
                    />
                    <ProFormText.Password
                        width="md"
                        name="password"
                        label="密码"
                        tooltip="最长为33位"
                        placeholder="不填写即为不修改"
                        required={false}
                    />
                </ProFormGroup>
                <ProFormGroup size={"large"} title="基本信息">
                    <ProFormText
                        width="md"
                        name="name"
                        label="姓名"
                        tooltip="最长为33位"
                        placeholder="请输入姓名"
                        required={true}
                    />
                    <ProFormSelect
                        width="md"
                        name="sex"
                        label="性别"
                        tooltip="最长为33位"
                        request={async () => [
                            {
                                label: "男",
                                value: 0,
                            }, {
                                label: "女",
                                value: 1,
                            },
                        ]}
                        required={false}
                    />
                    <ProFormDigit
                        width="md"
                        name="age"
                        label="年龄"
                        tooltip="最长为33位"
                        disabled
                        fieldProps={{ precision: 0 }}
                        required={false}
                    />
                    <ProFormDatePicker
                        width="md"
                        name="birth"
                        label="出生日期"
                        required={false}
                    />
                </ProFormGroup>
                <ProFormGroup size="large" title="通讯信息">
                    <ProFormText
                        width="md"
                        name="telephone"
                        label="手机号"
                        tooltip="最长为33位"
                        placeholder="请输入手机号"
                        required={false}
                    />
                    <ProFormText
                        width="md"
                        name="mail"
                        label="邮箱"
                        tooltip="最长为33位"
                        placeholder="请输入邮箱"
                        required={false}
                    />
                    <ProFormText
                        width="md"
                        name="phone"
                        label="电话"
                        tooltip="最长为33位"
                        placeholder="请输入电话"
                        required={false}
                    />
                    <ProFormText
                        width="md"
                        name="fax"
                        label="传真"
                        tooltip="最长为33位"
                        placeholder="请输入传真"
                        required={false}
                    />
                </ProFormGroup>
                <ProFormGroup size={"large"} title="工作信息">
                    <ProFormText
                        width="md"
                        name="workCode"
                        label="工号"
                        tooltip="最长为33位"
                        placeholder="请输入工号"
                        required={true}
                    />
                    <ProFormText
                        width="md"
                        name="job"
                        label="岗位"
                        tooltip="最长为33位"
                        placeholder="请输入岗位"
                        required={false}
                    />
                    <ProFormTreeSelect
                            width="md"
                            name="depart"
                            label="所属部门"
                            tooltip="仅为未废弃部门"
                            placeholder="请选择部门"
                            required={true}
                            request={async () => {
                                let departs: DepartOut[] = (await getDataList(config.fronts.depart, { toBrowser: true, isDeperacted: 0 })).data
                                return departs.map((depart, index, array) => { return { title: depart.departName, value: depart.dataId } })
                            }}
                            addonAfter={<Button onClick={() => { window.open(url.frontUrl.depart_concrete + prop.form.getFieldValue("depart")) }}>查看</Button>}

                        />
                        <ProFormTreeSelect
                            width="md"
                            name="section"
                            label="所属分部"
                            tooltip="仅为未废弃分部"
                            placeholder="请选择分部"
                            readonly
                            request={async () => {
                                let sections: SectionOut[] = (await getDataList(config.fronts.section, { toBrowser: true, isDeperacted: 0 })).data
                                return sections.map((section, index, array) => { return { title: section.sectionName, value: section.dataId } })
                            }}
                            addonAfter={<Button onClick={() => { window.open(url.frontUrl.section_concrete + prop.form.getFieldValue("section")) }}>查看</Button>}

                        />
                        <ProFormDigit
                            width="md"
                            name="safety"
                            label="安全等级"
                            tooltip="最小0最大100"
                            disabled
                            fieldProps={{ precision: 0, min: 0, max: 100 }}
                            required={false}
                        />
                    </ProFormGroup>
                    <ProFormGroup size={"large"} title="上下级信息">
                        <ProFormTreeSelect
                            width="md"
                            name="directorLeader"
                            label="上级领导"
                            placeholder="请选择领导"
                            request={async () => {
                                let humans: HumanOut[] = (await getDataList(config.fronts.human, { toBrowser: true, isDeprecated: 0 })).data
                                return humans.map((value, index, array) => { return { title: value.name, value: value.dataId } })
                            }}
                            required={true}
                            addonAfter={<Button onClick={() => { window.open(url.frontUrl.humanResource + prop.form.getFieldValue("belodirectorLeaderngDepart")) }}>查看</Button>}

                        />
                        <ProFormTreeSelect
                            width="md"
                            name="supporter"
                            label="助理"
                            placeholder="请选择助理"
                            request={async () => {
                                let humans: HumanOut[] = (await getDataList(config.fronts.human, { toBrowser: true, isDeprecated: 0 })).data
                                return humans.map((value, index, array) => { return { title: value.name, value: value.dataId } })
                            }}
                            required={true}
                            addonAfter={<Button onClick={() => { window.open(url.frontUrl.humanResource + prop.form.getFieldValue("supporter")) }}>查看</Button>}
                        />
                    </ProFormGroup>

            </ProForm>
        </div>
    )
}

const FrontHumanConcrete = () => {
    const humanId = useParams().dataId
    const [form] = Form.useForm<HumanIn>()
    const [humanSelf, setHumanSelf] = useState<HumanOut>()
    const [human, setHuman] = useState<HumanOut>()
    const [humanPhoto, setHumanPhoto] = useState<FileOut>()
    const [signature, setSignature] = useState<string>("无")
    useEffect(() => {
        if (human === undefined) {
            getDataOne(config.fronts.human + "/" + humanId).then((value) => {
                if (value.success) {
                    setHuman(value.data)
                    setSignature(value.data.signature ?? "无")
                    if (value.data.photo !== undefined && value.data.photo != null && value.data.photo !== 0)
                        getDataOne(config.fronts.file + "/" + value.data.photo).then((photo) => {
                            if (photo.success)
                                setHumanPhoto(photo.data)
                        })
                }
            })
            getDataOne(config.fronts.human_self).then((value) => {
                if (value.success)
                    setHumanSelf(value.data)
            })
        }
    })
    if (human == undefined)
        return (<PageWait />)
    let avaterGroup: React.JSX.Element[] = []
    if (humanPhoto === undefined)
        avaterGroup.push(<Avatar style={{ width: "100%" }} shape="square" size={64} icon={<UserOutlined />} />)
    else
        avaterGroup.push(<Avatar style={{ width: "100%" }} shape="square" size={64} src={config.backUrl + humanPhoto?.fileRoute} />)
    let editable = humanSelf?.dataId.toString() === humanId
    let lastLogin = (human.lastLogin ?? new Date())
    avaterGroup.push(<Title level={5}>上次登录时间</Title>)
    avaterGroup.push(<Text>{lastLogin.toLocaleString()}</Text>)

    avaterGroup.push(<Title level={5}>用户签名</Title>)
    avaterGroup.push(
        <Paragraph
            editable={!editable ? false : {
                onChange: (value) => {
                    form.setFieldValue("signature", value)
                    human.signature = value
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
            leadContent: 2
        },
        showUploadList: false,
        maxCount: 1,
        onChange: (info) => {
            let { status, response, name } = info.file
            if (status === 'done')
                if (response.code === 0) {
                    let file: FileOut = response.entity
                    message.success("上传成功")
                    form.setFieldValue("photo", file.dataId)
                    setHumanPhoto(file)
                } else {
                    message.error(response.description)
                }
        },
        itemRender: () => { return (<></>) }
    }

    let buttons = [<Upload {...upLoadProos} ><Button icon={<UploadOutlined />}>修改头像</Button></Upload>, <Button style={{ marginLeft: "5px" }} type="primary" key={"save"} onClick={() => { form.submit() }} disabled={!editable}>编辑并保存</Button>]
    let title = ((human.isDeprecated===0)?"":"  (已离职)")
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider style={{ padding: '15px 50px', minHeight: '100%', background: "#f1ffff", marginRight: "5px" }} width={210}>
                {avaterGroup}

            </Sider>

            <Layout>
                <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px", }}>
                    <Title level={2} style={{ color: 'GrayText', marginLeft: '10px', marginBottom: '15px' }}>{human.name + title}</Title>
                </Header>
                <Flex vertical={false} style={{ background: "#ffffff", padding: "10px" }}>
                    {Array.from({ length: 4 }).map((_, i) => (<div key={i} style={{ ...baseStyle }} />))}
                    {buttons}
                    <div style={{ width: "2.5%" }}></div>
                </Flex>
                <Content style={{ padding: '15px 50px', minHeight: '100%' }}>
                    <BaseInformation human={human} editable={editable} form={form} />
                </Content>
            </Layout>
        </Layout>
    )
}

export default FrontHumanConcrete