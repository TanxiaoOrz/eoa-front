import { PageContainer, ProForm, ProFormDatePicker, ProFormGroup, ProFormText, ProFormTextArea, ProFormTreeSelect } from '@ant-design/pro-components';
import { Button, Form, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import url from '../../const/url.js';
import { UpdateData, deleteData, getDataList, getDataOne } from '../../const/http.tsx';
import { DepartOut, HumanOut, SectionOut } from '../../const/out.tsx';
import config from '../../const/config.js';
import { useParams } from 'react-router';
import PageWait from '../../componet/PageWait.tsx';
import { UploadFileProposed } from '../../componet/UpLoadFile.tsx';
import BackHuman from './back_human.tsx';
import BackDepart from './back_depart.tsx';

const { Title } = Typography

type DepartIn = {
    departName: string
    departCode: string
    fullName: string
    belongDepart: number
    belongSection: number
    departManager: number
    departIntroduction: string
    createTime: string
    photo: number
}





const BackDepartConcrete = () => {
    const departId = useParams().dataId
    const [form] = Form.useForm<DepartIn>()
    const [depart, setDepart] = useState<DepartOut>()

    useEffect(() => {
        if (depart === undefined)
            getDataOne(config.backs.depart + "/" + departId).then((value) => {
                console.log(value.data)
                if (value.success)
                    setDepart(value.data)
            })
    })
    if (departId === undefined) {
        window.location.replace(url.backUrl.depart)
        return (<div></div>)
    }
    console.log(depart)
    if (depart === undefined)
        return (<PageWait />)
    const dropDepart = async () => {
        if ((await deleteData(config.backs.depart + "/" + departId)))
            window.location.reload()
    }

    const DepartBase = () => {
        return (
            <div style={{ display: "flex", background: "#fdfdfd", paddingTop: "30px", paddingLeft: "10px" }}>
                <ProForm<DepartIn>
                    form={form}
                    style={{
                        margin: "0 auto",
                        minHeight: "90vh"
                    }}
                    submitter={false}
                    layout="horizontal"
                    initialValues={depart}
                    onFinish={async (depart: DepartIn) => {
                        return (await UpdateData(config.backs.depart + "/" + departId, depart))
                    }}

                >
                    <ProFormGroup size={"large"} title="基本信息">
                        <ProFormText
                            width="md"
                            name="departName"
                            label="部门名称"
                            tooltip="最长为33位"
                            placeholder="请输入部门名称"
                            required={true}
                        />
                        <ProFormText
                            width="md"
                            name="departCode"
                            label="部门编号"
                            tooltip="最长为33位"
                            placeholder="请输入部门编号"
                            required={true}
                        />
                        <ProFormText
                            name="fullName"
                            label="部门全称"
                            tooltip="最长为33位"
                            placeholder="请输入部门全称"
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
                            name="belongDepart"
                            label="上级部门"
                            tooltip="仅为未废弃部门"
                            placeholder="请选择上级部门"
                            required={true}
                            request={async () => {
                                let departs: DepartOut[] = (await getDataList(config.fronts.depart, { toBrowser: true, isDeperacted: 0 })).data
                                return departs.map((depart, index, array) => { return { title: depart.departName, value: depart.dataId } })
                            }}
                            addonAfter={<Button onClick={()=>{window.open(url.frontUrl.depart_concrete+form.getFieldValue("belongDepart"))}}>查看</Button>}
                        />
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
                            addonAfter={<Button onClick={()=>{window.open(url.frontUrl.section_concrete+form.getFieldValue("belongSection"))}}>查看</Button>}

                        />
                       <ProFormTreeSelect
                            width="md"
                            name="departManager"
                            label="部门经理"
                            tooltip="仅显示未离职人员"
                            placeholder="请选择领导"
                            request={async () => {
                                let humans: HumanOut[] = (await getDataList(config.fronts.human, { toBrowser: true, isDeprecated: 0 })).data
                                return humans.map((value, index, array) => { return { title: value.name, value: value.dataId } })
                            }}
                            required={true} 
                            addonAfter={<Button onClick={()=>{window.open(url.frontUrl.humanResource+form.getFieldValue("departManager"))}}>查看</Button>}

                        />
                    </ProFormGroup>
                    <ProFormGroup size={"large"} title="展示资料" >
                        <UploadFileProposed label="展示照片" name="photo" form={form} content={3} />
                        <ProFormTextArea label="部门介绍" name="departIntroduction" width="md" placeholder={"请输入部门介绍"} />
                    </ProFormGroup>
                </ProForm>
            </div>
        )
    }

    let title = ((depart.isDeprecated===0)?"":"  (已封存)")
    return (
        <div
            style={{ background: '#F5F7FA' }}
        >
            <PageContainer
                header={{
                    title: depart.departName + title,
                    breadcrumb: {
                        items: [
                            {
                                path: url.backUrl.depart,
                                title: '部门列表',
                            },
                            {
                                path: url.backUrl.depart_concrete + '/' + departId,
                                title: depart.departName,
                            },
                        ],
                    },
                    extra: [
                        <Button key='save' type="primary" onClick={()=>{form.submit()}}>{depart.isDeprecated===0?"保存":"保存并复职"}</Button>,
                        <Button key='reset' onClick={()=>{form.resetFields()}}>重置</Button>,
                        <Button key='drop' type='default' danger onClick={dropDepart} disabled={depart.isDeprecated===1} >封存</Button>
                    ]
                }}
                tabList={[
                    {
                        key:"base",
                        tab:"基本信息",
                        children:<DepartBase />
                    },{
                        key:"humans",
                        tab:"部门成员",
                        children:<BackHuman depart={depart.dataId} />
                    },{
                        key:"departs",
                        tab:"下级部门",
                        children:<BackDepart depart={depart.dataId} />
                    }
                ]}
            />
        </div>
    )

}

export default BackDepartConcrete