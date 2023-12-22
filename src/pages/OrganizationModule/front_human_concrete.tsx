﻿import { useEffect, useState } from "react"
import { DepartOut, FileOut, HumanOut, SectionOut } from "../../const/out.tsx"
import { UpdateData, getDataList, getDataOne } from "../../const/http"
import { useParams } from "react-router"
import { Avatar, Button, DatePicker, Flex, Form, Layout } from "antd"
import config from "../../const/config"
import React from "react"
import Sider from "antd/es/layout/Sider"
import { Header, Content } from "antd/es/layout/layout"
import PageWait from "../../componet/PageWait.tsx"
import { UserOutlined } from "@ant-design/icons"
import UpLoadFile, { UploadFileProposed } from "../../componet/UpLoadFile"
import dayjs from "dayjs"
import { Typography } from 'antd';
import { ProForm, ProFormGroup, ProFormText, ProFormSelect, ProFormDigit, ProFormDatePicker, ProFormTreeSelect, ProFormTextArea } from "@ant-design/pro-components"
import form, { FormInstance } from "antd/es/form/index"

const { Title, Paragraph } = Typography;

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

const BaseInformation = (prop:{human:HumanOut,editable:boolean,form:FormInstance}) => {
    return (
        <div style={{ display: "flex", background: "#fdfdfd", paddingTop: "30px", paddingLeft:"10px"}}>
            <ProForm<HumanIn>
                form={prop.form}
                style={{
                    margin: "0 auto",
                    minHeight: "90vh"
                }}
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
                        request={async()=>[
                            {
                                label:"男",
                                value:0,
                            },{
                                label:"女",
                                value:1,
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
                        request={async ()=>{
                            let departs:DepartOut[] = (await getDataList(config.fronts.depart,{toBrowser:true,isDeperacted:0})).data
                            return departs.map((depart,index,array)=>{return {title:depart.departName,value:depart.dataId}})
                        }}
                    />
                    <ProFormTreeSelect
                        width="md"
                        name="section"
                        label="所属分部"
                        tooltip="仅为未废弃分部"
                        placeholder="请选择分部"
                        readonly
                        request={async ()=>{
                            let sections:SectionOut[] = (await getDataList(config.fronts.depart,{toBrowser:true,isDeperacted:0})).data
                            return sections.map((depart,index,array)=>{return {title:depart.sectionName,value:depart.dataId}})
                        }}
                    />
                    <ProFormDigit
                        width="md"
                        name="safety"
                        label="安全等级"
                        tooltip="最小0最大100"
                        disabled
                        fieldProps={{ precision: 0,min:0,max:100 }}
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
                        let humans:HumanOut[] =(await getDataList(config.fronts.human,{toBrowser:true,isDeprecated:0})).data
                        return humans.map((value,index,array)=>{return {title:value.name,value:value.dataId}})
                    }}
                    required = {true}/>
                <ProFormTreeSelect
                    width="md"
                    name="supporter"
                    label="助理"
                    placeholder="请选择助理"
                    request={async () => {
                        let humans:HumanOut[] =(await getDataList(config.fronts.human,{toBrowser:true,isDeprecated:0})).data
                        return humans.map((value,index,array)=>{return {title:value.name,value:value.dataId}})
                    }}
                    required = {true}/>
                </ProFormGroup>
            </ProForm>
        </div>
    )
}

const FrontHumanConcrete = () => {
    const humanId = useParams().dataId
    const [form] = Form.useForm<HumanIn>()
    const [humanSelf,setHumanSelf] = useState<HumanOut>()
    const [human,setHuman] = useState<HumanOut>()
    const [humanPhoto,setHumanPhoto] = useState<FileOut>()
    const [signature, setSignature] = useState<string>("无")
    useEffect(()=>{
        if (human === undefined) {
            getDataOne(config.fronts.human + "/" + humanId).then((value) => {
                if (value.success) {
                    setHuman(value.data)
                    setSignature(value.data.signature ?? "无")
                    if (value.data.photo !== undefined || value.data.photo != null)
                    getDataOne(config.fronts.file+"/"+value.data.photo).then((photo)=>{
                        if (photo.success)
                            setHumanPhoto(photo.data)
                    })
                }
            })
            getDataOne(config.fronts.human_self).then((value)=>{
                if (value.success)
                    setHumanSelf(value.data)
            })
        }
    })
    if (human == undefined)
        return (<PageWait />)
    let avaterGroup:React.JSX.Element[] = []
    if (humanPhoto === undefined)
        avaterGroup.push(<Avatar style={{width:"100%"}} shape="square" size={64} icon={<UserOutlined />} />)
    else 
        avaterGroup.push(<Avatar style={{width:"100%"}} shape="square" size={64} src={config.backUrl+humanPhoto?.fileRoute}/>)
    let editable = humanSelf?.dataId === humanId
    if (editable)
        avaterGroup.push(<UploadFileProposed label="头像" form={form} content={2} name="photo"/>)
    let lastLogin = human.lastLogin ?? new Date().toDateString()
    const dateFormat = 'YYYY-MM-DD HH:mm:ss'
    avaterGroup.push(<DatePicker prevIcon="上次登录时间" showTime defaultValue={dayjs(lastLogin, dateFormat)}/>)
    
    avaterGroup.push(<Title level={5}>用户签名</Title>)
    avaterGroup.push(
        <Paragraph 
            editable={editable?false:{ onChange: (value) => {
                form.setFieldValue("signature",value)
                human.signature = value
                setSignature(value)
            } }}>{signature}</Paragraph>)
    const baseStyle: React.CSSProperties = {
        width: '25%',
        };        
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider style={{ padding: '15px 50px', minHeight: '100%', background:"#d9d9d9"}}>
                {avaterGroup}

            </Sider>
            <Layout>
                <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px", }}>
                <Title level={2} style={{color:'GrayText', marginLeft:'10px',marginBottom:'15px'}}>{human.name}</Title>
                </Header>
                <Flex vertical={false} style={{background: "#ffffff",padding:"10px"}}>
                    {Array.from({ length: 4 }).map((_, i) => (<div key={i} style={{ ...baseStyle}} />))}
                    <Button type="primary" onClick={()=>{form.submit()}}>保存</Button>
                    <div style={{width:"2.5%"}}></div>
                </Flex>
                <Content style={{ padding: '15px 50px', minHeight: '100%' }}>
                    <BaseInformation human={human} editable={editable} form={form}/>
                </Content>
        </Layout>
        </Layout>
    )
}