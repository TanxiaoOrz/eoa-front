﻿import React, { useEffect, useState } from "react"
import config from "../../const/config.js"
import { UpdateData, deleteData, getDataList, getDataOne } from "../../const/http.tsx"
import { HumanOut, DepartOut, SectionOut } from "../../const/out.tsx"
import { useParams } from "react-router"
import url from "../../const/url"
import PageWait from "../../componet/PageWait.tsx"
import { PageContainer, ProForm, ProFormDatePicker, ProFormDigit, ProFormGroup, ProFormSelect, ProFormText, ProFormTextArea, ProFormTreeSelect } from "@ant-design/pro-components"
import { Button, Form } from "antd"
import { UploadFileProposed } from "../../componet/UpLoadFile.tsx"


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



const BackHumanConcrete = () => {
    const humanId = useParams().dataId
    const [form] = Form.useForm<HumanIn>()
    const [human, setHuman] = useState<HumanOut>()
    useEffect(() => {
        if (human === undefined)
            getDataOne(config.backs.human + "/" + humanId).then((value) => {
                if (value.success)
                    setHuman(value.data)
            })
    })
    useEffect(()=>{
        let title = ((human?.isDeprecated === 0) ? "" : "  (已离职)")
        document.title ="人员详情" + human?.name + title
    },[human])
    if (humanId === undefined) {
        window.location.replace(url.backUrl.human)
        return (<div></div>)
    }
    if (human === undefined)
        return (<PageWait />)
    const dropHuman = async () => {
        if ((await deleteData(config.backs.human + "/" + humanId)))
            setTimeout(()=>{window.location.reload()},1000)
    }

    const HumanBase = () => {
        return (
            <div style={{ display: "flex", background: "#fdfdfd", paddingTop: "30px", paddingLeft: "10px" }}>
                <ProForm<HumanIn>
                    form={form}
                    style={{
                        margin: "0 auto",
                        minHeight: "90vh"
                    }}
                    submitter={false}
                    layout="horizontal"
                    initialValues={human}
                    onFinish={async (human: HumanIn) => {
                        if (await UpdateData(config.backs.human + "/" + humanId, human)) {
                            setTimeout(()=>{window.location.reload()},1000)
                            return true
                        }
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
                        <ProFormDatePicker
                            name={"lastLogin"}
                            label={"上次登录时间"}
                            readonly
                            width={'md'}
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
                            addonAfter={<Button onClick={() => { window.open(url.frontUrl.depart_concrete + form.getFieldValue("depart")) }}>查看</Button>}

                        />
                        <ProFormTreeSelect
                            width="md"
                            name="section"
                            label="所属分部"
                            tooltip="仅为未废弃分部"
                            placeholder="请选择分部"
                            disabled
                            request={async () => {
                                let sections: SectionOut[] = (await getDataList(config.fronts.section, { toBrowser: true, isDeperacted: 0 })).data
                                return sections.map((section, index, array) => { return { title: section.sectionName, value: section.dataId } })
                            }}
                            addonAfter={<Button onClick={() => { window.open(url.frontUrl.section_concrete + form.getFieldValue("section")) }}>查看</Button>}

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
                            addonAfter={<Button onClick={() => { window.open(url.frontUrl.humanResource + form.getFieldValue("belodirectorLeaderngDepart")) }}>查看</Button>}

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
                            addonAfter={<Button onClick={() => { window.open(url.frontUrl.humanResource + form.getFieldValue("supporter")) }}>查看</Button>}
                        />
                    </ProFormGroup>
                    <ProFormGroup size={"large"} title="展示资料" >
                        <UploadFileProposed label="展示照片" name="photo" form={form} content={2} />
                        <ProFormTextArea label="个性签名" name="signature" width="md" placeholder={"请输入签名"} />
                    </ProFormGroup>
                </ProForm>
            </div>
        )
    }
    let title = ((human.isDeprecated === 0) ? "" : "  (已离职)")
    return (
        <div
            style={{ background: '#F5F7FA' }}
        >
            <PageContainer

                fixedHeader
                header={{
                    title: human.name + title,
                    breadcrumb: {
                        items: [
                            {
                                title: '人员列表',
                            },
                            {
                                title: human.name,
                            },
                        ],
                    },
                    extra: [
                        <Button key='save' type="primary" onClick={() => { form.submit() }}>{human.isDeprecated === 0 ? "保存" : "保存并复职"}</Button>,
                        <Button key='reset' onClick={() => { form.resetFields() }}>重置</Button>,
                        <Button key='drop' type='default' danger onClick={dropHuman} disabled={human.isDeprecated === 1} >离职</Button>
                    ]
                }}
            >
                <HumanBase />
            </PageContainer>
        </div>
    )
}

export default BackHumanConcrete


