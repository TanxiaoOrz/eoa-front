import { PageContainer, ProForm, ProFormDatePicker, ProFormGroup, ProFormText, ProFormTextArea, ProFormTreeSelect } from '@ant-design/pro-components';
import { Button, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import url from '../../const/url.js';
import { UpdateData, deleteData, getDataList, getDataOne } from '../../const/http.tsx';
import { HumanOut, SectionOut } from '../../const/out.tsx';
import config from '../../const/config.js';
import { useParams } from 'react-router';
import PageWait from '../../componet/PageWait.tsx';
import { UploadFileProposed } from '../../componet/UpLoadFile.tsx';
import BackDepart from './back_depart.tsx';
import BackSecion from './back_section.tsx';


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


const BackSectionConcrete = () => {
    const sectionId = useParams().dataId
    const [form] = Form.useForm<SectionIn>()
    const [section, setSection] = useState<SectionOut>()

    useEffect(() => {
        if (section === undefined)
            getDataOne(config.backs.section + "/" + sectionId).then((value) => {
                console.log(value.data)
                if (value.success)
                    setSection(value.data)
            })
    })
    useEffect(()=>{
        let title = ((section?.isDeprecated ?? 0 === 0) ? "" : "  (已封存)")
        document.title ="分部详情" + section?.sectionName + title
    },[section])
    if (sectionId === undefined) {
        window.location.replace(url.backUrl.depart)
        return (<div></div>)
    }
    console.log(section)
    if (section === undefined)
        return (<PageWait />)
    const dropSection = async () => {
        if ((await deleteData(config.backs.section + "/" + sectionId)))
            setTimeout(() => { window.location.reload() }, 1000)
    }

    const sectionBase = (
        <div style={{ display: "flex", background: "#fdfdfd", paddingTop: "30px", paddingLeft: "10px" }}>
            <ProForm<SectionIn>
                form={form}
                style={{
                    margin: "0 auto",
                    minHeight: "90vh"
                }}
                submitter={false}
                layout="horizontal"
                initialValues={section}
                onFinish={async (section: SectionIn) => {
                    if (await UpdateData(config.backs.section + "/" + sectionId, section)) {
                        setTimeout(()=>{window.location.reload()},1000)
                        return true
                    }
                    return false
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
                            return sections.map((depart) => { return { title: depart.sectionName, value: depart.dataId } })
                        }}
                        required={true}
                        addonAfter={<Button onClick={() => (window.open(url.frontUrl.humanResource + form.getFieldValue("belongSection")))}>查看</Button>}
                    />
                    <ProFormTreeSelect
                        width="md"
                        name="sectionManager"
                        label="分部经理"
                        tooltip="仅显示未离职人员"
                        placeholder="请选择领导"
                        request={async () => {
                            let humans: HumanOut[] = (await getDataList(config.fronts.human, { toBrowser: true, isDeprecated: 0 })).data
                            return humans.map((value) => { return { title: value.name, value: value.dataId } })
                        }}
                        required={true}
                        addonAfter={<Button onClick={() => (window.open(url.frontUrl.humanResource + form.getFieldValue("sectionManager")))}>查看</Button>}
                    />
                </ProFormGroup>
                <ProFormGroup size={"large"} title="展示资料" >
                    <UploadFileProposed label="展示照片" name="photo" form={form} content={4} />
                    <ProFormTextArea label="分部介绍" name="sectionIntroduction" width="md" placeholder={"请输入分部介绍"} />
                </ProFormGroup>
            </ProForm>
        </div>
    )


    let title = ((section.isDeprecated === 0) ? "" : "  (已封存)")
    return (
        <div
            style={{ background: '#F5F7FA' }}
        >
            <PageContainer
                header={{
                    title: section.sectionName + title,
                    breadcrumb: {
                        items: [
                            {
                                title: '分部列表',
                            },
                            {
                                title: section.sectionName,
                            },
                        ],
                    },
                    extra: [
                        <Button key='save' type="primary" onClick={() => { form.submit() }}>{section.isDeprecated === 0 ? "保存" : "保存并复职"}</Button>,
                        <Button key='reset' onClick={() => { form.resetFields() }}>重置</Button>,
                        <Button key='drop' type='default' danger onClick={dropSection} disabled={section.isDeprecated === 1} >封存</Button>
                    ]
                }}
                tabList={[
                    {
                        key: "base",
                        tab: "基本信息",
                        children: sectionBase
                    }, {
                        key: "sections",
                        tab: "下级分部",
                        children: <BackSecion section={section.dataId} />
                    }, {
                        key: "departs",
                        tab: "下级部门",
                        children: <BackDepart section={section.dataId} />
                    }
                ]}
            />
        </div>
    )

}

export default BackSectionConcrete