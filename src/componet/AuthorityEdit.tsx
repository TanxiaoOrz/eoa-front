import React, { useRef } from "react";
import { CharacterOut, ColumnOut, DepartOut, HumanOut, SectionOut } from "../const/out";
import { getDataList } from "../const/http.tsx";
import url from "../const/url";
import { Button, Form, Tabs, message } from "antd";
import { ActionType, ModalForm, ProColumns, ProForm, ProFormDigit, ProFormSelect, ProFormTreeSelect, ProTable } from "@ant-design/pro-components";
import {columnType} from "../const/columnType.tsx";
import config from "../const/config";
import { PlusOutlined } from "@ant-design/icons";

type All = {
    start:number
    end:number
}

type Create = {
    self:boolean
    leader:boolean
    leaderRecursion:boolean
    depart:boolean
    section:boolean
    sectionRecursive:boolean
}

type Group = {
    characterId:number
    grade:number
}

type Character = {
    characters:Group[]
}

type Proposed = {
    humans:number[]
    departs:number[]
    sections:number[]
}

type Authority = {
    bodyType:string,
    body:Map<string,string>,
    tableType:string,
    table:Map<string,string>,
}
const AllConstraint = (prop:{
    default:All|undefined,
    form:All|undefined,
    useForm:boolean,
    update:(arg0: string) => boolean,
    updateForm:(arg0: string) => boolean,
    tableId:number,
    isVirtual:boolean}) => {
    const alls = [{
        key:"default",
        label:"默认",
        children:(
        <ProForm
            initialValues={prop.default}
            onFinish={async (values)=>{
                return prop.update(JSON.stringify(values))
            }}
            submitter={{
                searchConfig:{
                    submitText:"确定",
                    resetText:"重置"
                },
                submitButtonProps:{
                    style:{marginRight:"auto"}
                },
                resetButtonProps:{
                    style:{marginLeft:"auto"}
                }
            }}
        >
            <ProFormDigit
                label="最小安全等级"
                name="start"
                width="sm"
                fieldProps={{precision:0}}
                min={0}
                max={100}
                tooltip="最小0最大100"
                required = {true}
            />
            <ProFormDigit
                label="最大安全等级"
                name="end"
                fieldProps={{precision:0}}
                min={0}
                max={100}
                width="sm"
                tooltip="最小0最大100"
                required = {true}
            />
        </ProForm>)
        },
    ]
    if (prop.useForm)
        alls.push({
            key:"forms",
            label:"表单选择",
            
            children:(
                <ProForm 
                initialValues={prop.form}
                onFinish={async (values)=>{
                    return prop.updateForm(JSON.stringify(values))
                }}    
                submitter={{
                    searchConfig:{
                        submitText:"确定",
                        resetText:"重置"
                    },
                    submitButtonProps:{
                        style:{marginRight:"auto"}
                    },
                    resetButtonProps:{
                        style:{marginLeft:"auto"}
                    }
                }}
            >
                <ProFormSelect
                    label="最小安全等级"
                    name="start"
                    width="sm"
                    request={async ()=>{
                        let characters:ColumnOut[] =(await getDataList(config.backs.column,{isVirtual:prop.isVirtual,tableNo:prop.tableId,toBrowser:true})).data
                return characters.map((value,index,array) => { return {label:value.columnViewName,value:value.columnId}})
                    }}
                    placeholder="请选择代表最小安全等级的字段"
                    required = {true}
                />
                <ProFormSelect
                    label="最大安全等级"
                    name="end"
                    width="sm"
                    request={async ()=>{
                        let characters:ColumnOut[] =(await getDataList(config.backs.column,{isVirtual:prop.isVirtual,tableNo:prop.tableId,toBrowser:true})).data
                return characters.map((value,index,array) => { return {label:value.columnViewName,value:value.columnId}})
                    }}
                    placeholder="请选择代表最大安全等级的字段"
                    required = {true}
                />
            </ProForm>)
        })
    return (
    <Tabs
        defaultActiveKey="default"
        centered
        items={alls}></Tabs>
    )
}

AllConstraint.defaultProps = {
    tableId:0,
    isVirtual:false
}


const CreatorConstraint = (prop:{
    default:Create|undefined,
    update:(arg0: string) => boolean
}) => {
    const items = [
        {
            value:true,
            label:"允许"
        },{
            value:false,
            label:"拒绝"
        }
    ]
    let value:Create
    // console.log("create")
    // console.log(prop.default)
    if (prop.default === undefined) {
        value = {
            self:false,
            leader:false,
            leaderRecursion:false,
            depart:false,
            section:false,
            sectionRecursive:false
        }
    } else {
        value = {
            self:prop.default.self,
            leader:prop.default.leader,
            leaderRecursion:prop.default.leaderRecursion,
            depart:prop.default.depart,
            section:prop.default.section,
            sectionRecursive:prop.default.sectionRecursive
        }
    }
    // console.log(value)
    const alls = [{
        key:"default",
        label:"默认",
        children:(
        <ProForm
            initialValues={value}
            onFinish={async (values)=>{
                return prop.update(JSON.stringify(values))
            }}
            layout="horizontal"
            submitter={{
                searchConfig:{
                    submitText:"确定",
                    resetText:"重置"
                },
                submitButtonProps:{
                    style:{marginRight:"auto"}
                },
                resetButtonProps:{
                    style:{marginLeft:"auto"}
                }
            }}
        >
            <ProFormSelect
                label="创建人"
                name="self"
                options={items}
                allowClear={false}
                tooltip="创建人自己是否拥有该权限"
            />
                
            <ProForm.Group>
                <ProFormSelect
                    label="直属领导"
                    name="leader"
                    options={items}
                    allowClear={false}
                    tooltip="创建人领导是否拥有该权限"
                />
                <ProFormSelect
                label="上级领导"
                name="leaderRecursion"
                options={items}
                allowClear={false}
                tooltip="创建人领导及其领导是否拥有该权限"
                />
            </ProForm.Group>

            <ProFormSelect
                label="同部门"
                name="depart"
                options={items}
                allowClear={false}
                tooltip="创建人同部门是否拥有该权限"
            />
            <ProForm.Group>
                <ProFormSelect
                    label="同分部"
                    name="section"
                    options={items}
                    allowClear={false}
                    tooltip="创建人同分布是否拥有该权限"
                />
                <ProFormSelect
                    label="上级分部"
                    name="sectionRecursive"
                    options={items}
                    allowClear={false}
                    tooltip="创建人分布及其上级分部是否拥有该权限"
                />
            </ProForm.Group>
        </ProForm>)
        }
    ]
    return (
    <Tabs
        activeKey="default"
        centered
        items={alls}></Tabs>
    )
}



const CharacterConstraint = (prop:{
    default:Group[]|undefined,
    form:Group[]|undefined,
    useForm:boolean,
    update:(arg0: string) => boolean,
    updateForm:(arg0: string) => boolean,
    tableId:number,
    isVirtual:boolean}) => {
    const getCharacterSelect = async () =>{
        let characters:CharacterOut[] = (await getDataList(config.fronts.character)).data
        return characters.map((value,index,array)=>{
            return {
                value:value.dataId,
                label:value.characterName
            }
        })
    }
    const columns:ProColumns<Group>[] = [
        {
            key:"name",
            title:"角色名称",
            dataIndex:"characterId",
            valueType:"select",
            request:async () => {
                let characters:CharacterOut[] =(await getDataList(config.fronts.character,{toBrowser:true})).data
                return characters.map((value,index,array) => { return {label:value.characterName,value:value.dataId}})
            },
        },{
            key:"grade",
            title:"角色最低等级",
            dataIndex:"grade",
            valueType:"select",
            request:async ()=> {
                return [
                    {
                        label:"总部",
                        value:0
                    },{
                        label:"分部",
                        value:1
                    },{
                        label:"部门",
                        value:2
                    }
                ]
            },
            tooltip:"总部级无特殊要求,分部级要求该角色人员属于创建者分部或上级分部,部门级同理"
        },{
            key:'action',
            title:'操作',
            dataIndex:"characterId",
            width:48*3,
            hideInSearch:true,
            render:(dom,entity,index,action)=>
              <Button
                danger 
                type="primary"
                onClick={()=>{
                    if (prop.default === undefined)
                        return
                    let news = prop.default?.filter((value,index,array)=>{return !(entity.characterId===value.characterId&&entity.grade===value.grade)})
                    while (prop.default?.length>0)
                        prop.default.pop()
                    news.forEach((value,index,array)=>{prop.default?.push(value)})
                    actionRef.current?.reload()
                    // console.log(prop.default)
                    return prop.update(JSON.stringify(prop.default))
                }}
              >删除</Button>
          }
    ]
    const actionRef = useRef<ActionType>();
    const columnsForm:ProColumns<Group>[] = [
        {
            key:"name",
            title:"指定角色字段名称",
            dataIndex:"characterId",
            valueType:"treeSelect",
            request:async () => {
                let characters:ColumnOut[] =(await getDataList(config.backs.column,{isVirtual:prop.isVirtual,tableNo:prop.tableId,toBrowser:true})).data
                return characters.map((value,index,array) => { return {title:value.columnViewName,value:value.columnId}})
            }
        },{
            key:"grade",
            title:"角色最低等级",
            dataIndex:"grade",
            valueType:"select",
            request:async ()=> {
                return [
                    {
                        label:"总部",
                        value:0
                    },{
                        label:"分部",
                        value:1
                    },{
                        label:"部门",
                        value:2
                    }
                ]
            },
            tooltip:"总部级无特殊要求,分部级要求该角色人员属于创建者分部或上级分部,部门级同理"
        },{
            key:'action',
            title:'操作',
            dataIndex:"characterId",
            width:48*3,
            hideInSearch:true,
            render:(dom,entity,index,action)=>
              <Button
                type="primary"
                danger 
                onClick={()=>{
                    if (prop.form === undefined)
                        return
                    let news = prop.form?.filter((value,index,array)=>{return (entity.characterId===value.characterId&&entity.grade===value.grade)})
                    while (prop.form?.length>0)
                        prop.form.pop()
                    news.forEach((value,index,array)=>{prop.form?.push(value)})
                    actionRef.current?.reload()
                    // console.log(prop.form)
                    return prop.update(JSON.stringify({characters:prop.form}))
                }}
              >删除</Button>
          }
    ]
    
    const CreateCharacterConstraint = (prop:{cons:Group[],update:(arg0: string) => boolean}) => {
        const [form] = Form.useForm<Group>();
        return (
            <ModalForm<Group> 
                title="新建角色限制"
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
            onFinish={async (values:Group)=>{
                prop.cons.push(values)
                actionRef.current?.reload()
                return prop.update(JSON.stringify({characters:prop.cons}))
            }}
            >
                <ProFormTreeSelect
                    placeholder="请输入要求的角色"
                    allowClear
                    name="characterId"
                    tooltip="角色要求"
                    label="角色"
                    request={async () => {
                        let characters:CharacterOut[] =(await getDataList(config.fronts.character,{toBrowser:true})).data
                        return characters.map((value,index,array) => { return {title:value.characterName,value:value.dataId}})
                    }}
                />
                <ProFormSelect 
                    placeholder="请输入角色等级"
                    allowClear
                    name="grade"
                    label="等级"
                    request={async ()=> {
                        return [
                            {
                                label:"总部",
                                value:0
                            },{
                                label:"分部",
                                value:1
                            },{
                                label:"部门",
                                value:2
                            }
                        ]
                    }}
                    tooltip="总部级无特殊要求,分部级要求该角色人员属于创建者分部或上级分部,部门级同理"
                />

            </ModalForm>
        )
    }
    const CreateCharacterConstraintForm = (prop:{cons:Group[],update:(arg0: string) => boolean,isVirtual:boolean,tableId:number}) => {
        const [form] = Form.useForm<Group>();
        return (
            <ModalForm<Group> 
                title="新建角色限制"
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
            onFinish={async (values:Group)=>{
                prop.cons.push(values)
                actionRef.current?.reload()
                return prop.update(JSON.stringify(prop.cons))
            }}
            >
                <ProFormTreeSelect
                    placeholder="请输入要求的角色"
                    allowClear
                    name="characterId"
                    width="md"
                    tooltip="角色要求"
                    label="角色"
                    request={async () => {
                        let characters:ColumnOut[] =(await getDataList(config.backs.column,{isVirtual:prop.isVirtual,tableNo:prop.tableId,toBrowser:true})).data
                        // console.log("tableId",prop.tableId)
                        // console.log("columnsGet",characters)
                        return characters.map((value,index,array) => { return {title:value.columnViewName,value:value.columnId}})
                    }}
                />
                <ProFormSelect 
                    placeholder="请输入角色等级"
                    allowClear
                    name="grade"
                    width="md"
                    label="等级"
                    request={async ()=> {
                        return [
                            {
                                label:"总部",
                                value:0
                            },{
                                label:"分部",
                                value:1
                            },{
                                label:"部门",
                                value:2
                            }
                        ]
                    }}
                    tooltip="总部级无特殊要求,分部级要求该角色人员属于创建者分部或上级分部,部门级同理"
                />

            </ModalForm>
        )
    }
    // console.log("createDefault")
    // console.log(prop.default)
    const alls = [{
        key:"default",
        label:"默认",
        children:(
        <ProTable<Group>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            size="large"
            search={false}
            request={async (params,sort,filter) => {
                let con =prop.default ?? []
                return {
                    total:con.length,
                    data:con,
                    success:true
                }
            }}
            headerTitle="角色限制"
            pagination={{
                pageSize: 10,
            }}
            
            toolBarRender={()=>[<CreateCharacterConstraint key="create" cons={prop.default??[]} update={prop.update} />]}
        />)
        }
    ]
    if (prop.useForm)
        alls.push({
            key:"form",
            label:"表单选择",
            children:(
                <ProTable<Group>
                    columns={columnsForm}
                    actionRef={actionRef}
                    cardBordered
                    search={false}
                    request={async (params,sort,filter) => {
                        let con =prop.form ?? []
                        return {
                            total:con.length,
                            data:con,
                            success:true
                        }
                    }}
                    headerTitle="角色限制"
                    pagination={{
                        pageSize: 10,
                    }}
                    toolBarRender={()=>[<CreateCharacterConstraintForm key="create" cons={prop.form??[]} update={prop.updateForm} tableId={prop.tableId} isVirtual={prop.isVirtual} />]}
                />
            )
        }
    )
    return (
    <Tabs
        defaultActiveKey="default"
        centered
        items={alls}></Tabs>
    )
}

CharacterConstraint.defaultProps = {
    tableId:0,
    isVirtual:false
}

const ProposedConstraint = (prop:{
    default:Proposed|undefined,
    form:Proposed|undefined,
    useForm:boolean,
    update:(arg0: string) => boolean,
    updateForm:(arg0: string) => boolean,
    tableId:number,
    isVirtual:boolean}) => {
        console.log("prop",prop)

        type Row = {type:number,url:string,id:number}

        const getRowsFormConstraint = (con:Proposed) => {
            let rows:Row[] = []
            con.humans.forEach((value,index,array)=>{rows.push({type:0,url:"0:"+value,id:value,})})
            con.departs.forEach((value,index,array)=>{rows.push({type:1,url:"1:"+value,id:value})})
            con.sections.forEach((value,index,array)=>{rows.push({type:2,url:"2:"+value,id:value})})
            return rows
        }

        const addConstraintFormRows = (rows:Row[],con:Proposed) => {
            console.log(rows)
            rows.forEach((value,index,array)=>{
                switch (value.type) {
                    case 0:
                        con.humans.push(value.id)
                        break
                    case 2:
                        con.departs.push(value.id)
                        break
                    case 3:
                        con.sections.push(value.id)
                }
            })
            console.log("prop",prop)
        }
        const defaults = prop.default??{humans:[],departs:[],sections:[]}
        const forms =prop.form??{humans:[],departs:[],sections:[]}
        const actionRef = useRef<ActionType>();
        const actionForm = useRef<ActionType>()
        const columnsForm:ProColumns<Row>[] = [
            {
                key:"type",
                title:"指定类型",
                dataIndex:"type",
                valueType:"select",
                params:prop,
                request:async () => {
                    return [
                        {
                            value:0,
                            label:"人员"
                        },{
                            value:1,
                            label:"部门"
                        },{
                            value:2,
                            label:"分部"
                        } 
                    ]
                    
                }
            },{
                key:"type",
                title:"指定对象字段名称",
                dataIndex:"id",
                //params:prop,
                valueType:'treeSelect',
                request:async () => {
                    let columns:ColumnOut[] =(await getDataList(config.backs.column,{isVirtual:prop.isVirtual,tableNo:prop.tableId,toBrowser:true})).data
                    let con = columns.map((value,index,array) => { return {title:value.columnViewName,label:value.columnViewName,value:value.columnId,key:value.columnId}})
                    console.log("con")
                    console.log(con)
                    return con
                }
            },{
                key:'action',
                title:'操作',
                dataIndex:"url",
                width:48*3,
                hideInSearch:true,
                render:(dom,entity,index,action)=>
                  <Button
                    danger 
                    type="primary"
                    onClick={()=>{
                        switch (entity.type) {
                            case 0:
                                forms.humans = forms.humans.filter((value,index,array)=>value!==entity.id)
                                break
                            case 1:
                                forms.departs = forms.departs.filter((value,index,array)=>value!==entity.id)
                                break
                            case 2:
                                forms.sections = forms.sections.filter((value,index,array)=>value!==entity.id)
                        }
                    prop.updateForm(JSON.stringify(forms))
                    // console.log(forms)
                    actionForm.current?.reload()
                    }}
                  >删除</Button>
              }
        ]

        const columns:ProColumns<Row>[] = [
            {
                key:"type",
                title:"指定类型",
                dataIndex:"type",
                valueType:"select",
                request:async () => {
                    return [
                        {
                            value:0,
                            label:"人员"
                        },{
                            value:1,
                            label:"部门"
                        },{
                            value:2,
                            label:"分部"
                        } 
                    ]
                }
            },{
                key:"name",
                title:"指定对象名称",
                dataIndex:"url",
                valueType:"select",
                request:async () => {
                    let request:{label:string,
                        value:string}[] = []
                    let humans:HumanOut[] = (await getDataList(config.fronts.human,{toBrowser:true})).data
                    humans.forEach((value,index,array)=>{request.push({label:value.name,value:"0:"+value.dataId})})
                    let departs:DepartOut[] = (await getDataList(config.fronts.depart,{toBrowser:true})).data
                    departs.forEach((value,index,array)=>{request.push({label:value.departName,value:"1:"+value.dataId})})
                    let sections:SectionOut[] = (await getDataList(config.fronts.section,{toBrowser:true})).data
                    sections.forEach((value,index,array)=>{request.push({label:value.sectionName,value:"2:"+value.dataId})})
                    return request
                }
            },{
                key:'action',
                title:'操作',
                dataIndex:"url",
                width:48*3,
                hideInSearch:true,
                render:(dom,entity,index,action)=>
                  <Button
                    danger 
                    type="primary"
                    onClick={()=>{
                        switch (entity.type) {
                            case 0:
                                defaults.humans = defaults.humans.filter((value,index,array)=>value!==entity.id)
                                break
                            case 1:
                                defaults.departs = defaults.departs.filter((value,index,array)=>value!==entity.id)
                                break
                            case 2:
                                defaults.sections = defaults.sections.filter((value,index,array)=>value!==entity.id)
                        }
                    prop.update(JSON.stringify(defaults))
                    // console.log(defaults)
                    actionRef.current?.reload()
                    }}
                  >删除</Button>
              }
        ]

        const CreateDefault = () => {
            const [form] = Form.useForm<Row>()
            return (<ModalForm<Row>
                title="新建指定对象限制"
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
            onFinish={async (values:Row)=>{
                let s = values.url.split(":")
                values.id = parseInt(s[1])
                values.type = parseInt(s[0])
                addConstraintFormRows([values],defaults)
                console.log(defaults)
                prop.update(JSON.stringify(defaults))
                // console.log(defaults)
                actionRef.current?.reload()
                return true
            }}
            >
                <ProFormTreeSelect 
                    placeholder="人员|部门|分部"
                    allowClear
                    name="url"
                    width="md"
                    label="指定对象"
                    required
                    request={async ()=> {
                        let human:{label:string,
                            value:string}[] = []
                        let depart:{label:string,
                            value:string}[] = []
                        let section:{label:string,
                            value:string}[] = []    
                        let humans:HumanOut[] = (await getDataList(config.fronts.human)).data
                        humans.forEach((value,index,array)=>{human.push({label:value.name,value:"0:"+value.dataId})})
                        let departs:DepartOut[] = (await getDataList(config.fronts.depart)).data
                        departs.forEach((value,index,array)=>{depart.push({label:value.departName,value:"1:"+value.dataId})})
                        let sections:SectionOut[] = (await getDataList(config.fronts.section)).data
                        sections.forEach((value,index,array)=>{section.push({label:value.sectionName,value:"2:"+value.dataId})})
                        let request = [
                            {
                                value:"0",
                                label:"人员",
                                selectable:false,
                                children:human
                            },{
                                value:"1",
                                label:"部门",
                                selectable:false,
                                children:depart
                            },{
                                value:"2",
                                label:"分部",
                                selectable:false,
                                children:section
                            },
                        ]
                        // console.log(request)
                        return request
                    }}
                    tooltip="指定拥有该权限的人员"
                />
            </ModalForm>)
        }

        const CreateForms = () => {
            const [form] = Form.useForm<Row>()
            return (<ModalForm<Row>
                title="新建指定对象限制"
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
            onFinish={async (values:Row)=>{
                addConstraintFormRows([values],forms)
                // console.log("form")
                prop.updateForm(JSON.stringify(forms))
                // console.log(forms)
                await actionForm.current?.reload()
                return true
            }}
            >
                <ProFormSelect 
                    placeholder="类型"
                    allowClear
                    name="type"
                    width="md"
                    label="指定对象"
                    required                    
                    tooltip="人员|部门|分部"
                    request={async () => {
                        return [
                            {
                                value:0,
                                label:"人员"
                            },{
                                value:1,
                                label:"部门"
                            },{
                                value:2,
                                label:"分部"
                            } 
                        ]                    
                    }}
                />
                <ProFormTreeSelect 
                    placeholder="指定对象赋值字段"
                    allowClear
                    name="id"
                    width="md"
                    label="指定对象"
                    
                    
                    tooltip="请选择取值字段"
                    request={async () => {
                        let columns:ColumnOut[] =(await getDataList(config.backs.column,{isVirtual:prop.isVirtual,tableNo:prop.tableId,toBrowser:true})).data
                        return columns.map((value,index,array) => { return {title:value.columnViewName,value:value.columnId}})
                    }}
                />
                
            </ModalForm>)
        }



        const alls = [{
            key:"default",
            label:"默认",
            children:(
                <ProTable<Row>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                search={false}
                request={async (params,sort,filter) => {
                    let con =getRowsFormConstraint(defaults)
                    return {
                        total:con.length,
                        data:con,
                        success:true
                    }
                }}
                dataSource={getRowsFormConstraint(defaults)}
                headerTitle="指定对象"
                pagination={{
                    pageSize: 10,
                }}
                toolBarRender={()=>[<CreateDefault key={"create"}/>]}
            />)
            },
        ]
        if (prop.useForm)
            alls.push({
                key:"forms",
                label:"表单选择",
                
                children:(<ProTable<Row>
                    columns={columnsForm}
                    actionRef={actionForm}
                    cardBordered
                    request={async (params,sort,filter) => {
                        let con =getRowsFormConstraint(forms)
                        console.log(con)
                        return {
                            total:con.length,
                            data:con,
                            success:true
                        }
                    }}
                    headerTitle="指定对象"
                    search={false}
                    pagination={{
                        pageSize: 10,
                    }}
                    toolBarRender={()=>[<CreateForms key={"create"}/>]}
                />)
            })
        return (
        <Tabs
            defaultActiveKey="default"
            centered
            items={alls}></Tabs>
        )
}

ProposedConstraint.defaultProps = {
    tableId:0,
    isVirtual:false
}


function replacer(key:string, value:any) {
    if(value instanceof Map) {
        let object = {};
        // console.log(value)
        for (let i of value.entries()) {
            // console.log(i)
            object[i[0]] = i[1]
        };
      return object;
    } else {
      return value;
    }
}

function receiver(key:string, value:any) {
    if(key === "table" || key === "body") {
      let map =   new Map<string,string>()
      if (value === null)
        return map
      Object.entries(value).forEach((value)=>{
        map.set(value[0],value[1]+"")
      })
      return map;
    } else {
      return value;
    }
}



export const AuthorityEdit = (prop:{
    entity:any,
    tableId:number,
    isVirtual:boolean,
    authorityName:string
})=>{

    const tableId = prop.tableId;
    const useForm = tableId !== 0
    
    let authority:Authority =JSON.parse(prop.entity[prop.authorityName],receiver) 
    

    const saveAuthority = () =>{
        authority.bodyType = ""
        authority.body.forEach((value,key,map)=>{
            authority.bodyType += (key+",")
        })
        if (useForm) {
            authority.tableType = ""
            authority.table.forEach((value,key,map)=>{
                authority.tableType += (key+",")
            })
        }
        // console.log(authority)
        // console.log(JSON.stringify(authority,replacer))
        prop.entity[prop.authorityName] = JSON.stringify(authority,replacer)
        // console.log(prop.entity)
        message.info("修改成功,请保存后刷新页面查看或继续修改")
    }

    if (authority === null)
        authority = {
            body:new Map<string,string>(),
            bodyType:"",
            table:new Map<string,string>(),
            tableType:""
        }

    const divStyle = {display:"flex" ,justifyContent:"center", background:"#fafafa", height:"72vh"}

    // console.log(authority)
    // console.log(JSON.parse(authority.body.get("createConstraint")+""))
    const tabs = [
        {
            key:"all",
            label:"所有人",
            children:(
            <div style={divStyle}>
                <AllConstraint 
                default={authority.body.get("allConstraint")===undefined?undefined:JSON.parse(""+authority.body.get("allConstraint"))}
                form={authority.table.get("allConstraint")===undefined?undefined:JSON.parse(""+authority.table.get("allConstraint"))}
                useForm={useForm}
                update={(all)=>{authority.body.set("allConstraint",all);saveAuthority();return true}}
                updateForm={(all)=>{authority.table.set("allConstraint",all);saveAuthority();return true}}
                tableId={tableId}
                isVirtual={prop.isVirtual}
            />
            </div>
            )
        },{
            key:"creater",
            label:"创建人相关",
            children:(<div style={divStyle}>
                <CreatorConstraint
                    default={authority.body.get("createConstraint")===undefined?undefined:JSON.parse(""+authority.body.get("createConstraint"))}
                    update={(all)=>{authority.body.set("createConstraint",all);saveAuthority();return true}}
                />
            </div>)
        },{
            key:"character",
            label:"角色",
            children:(<div >
                <CharacterConstraint
                    default={authority.body.get("characterConstraint")===undefined?undefined:JSON.parse(""+authority.body.get("characterConstraint")).characters}
                    form={authority.table.get("characterConstraint")===undefined?undefined:JSON.parse(""+authority.table.get("characterConstraint")).characters}
                    useForm={useForm}
                    update={(characters)=>{authority.body.set("characterConstraint",characters);saveAuthority();return true}}
                    updateForm={(characters)=>{authority.table.set("characterConstraint",characters);saveAuthority();return true}}
                    tableId={tableId}
                />
            </div>)
        },{
            key:"proposed",
            label:"指定对象",
            children:(<div >
                <ProposedConstraint 
                    default={authority.body.get("proposedConstraint")===undefined?undefined:JSON.parse(""+authority.body.get("proposedConstraint"))}
                    form={authority.table.get("proposedConstraint")===undefined?undefined:JSON.parse(""+authority.table.get("proposedConstraint"))}
                    useForm={useForm}
                    update={(character)=>{authority.body.set("proposedConstraint",character);saveAuthority();return true}}
                    updateForm={(character)=>{authority.table.set("proposedConstraint",character);saveAuthority();return true}}
                    tableId={tableId}
                />
            </div>)
        }
    ]


    
    return (
        <Tabs 
            style={{height:"90vh", margin:"5px"}}
            items={tabs}>
                
        </Tabs>
    )
}

AuthorityEdit.defaultProps = {
    tableId:0,
    isVirtual: true
}