import React, { useEffect, useRef } from "react"
import { ColumnSimpleOut, Detail, FormOut, Group } from "../../const/out.tsx"
import { useLocation, useParams } from "react-router"
import PageWait from "../../componet/PageWait.tsx"
import { Button, Card, Flex, Form, FormInstance, Layout, Typography, message } from "antd"
import { UpdateData, deleteData, getDataOne, newData } from "../../const/http.tsx"
import config from "../../const/config.js"
import { EditableFormInstance, EditableProTable, ProColumns, ProForm, ProFormGroup, ProFormText } from "@ant-design/pro-components"
import { columnType, transportInput, transprotColumn } from "../../const/columnType.tsx"
import { FolderOpenTwoTone } from "@ant-design/icons"
import { Header, Content } from "antd/es/layout/layout"
import url from "../../const/url.js"



const {Title} = Typography

type FormIn = {
    tableId:number
    mains:any
    detailValueMapLists:any[][]
}

const DetailTable = (prop:{detail:Detail,getEditAble:(columnName:string)=>boolean,addable:boolean,minusable:boolean,editable:boolean}) => {
    const detail = prop.detail
    const position = prop.addable?'bottom':'hidden'
    const deleteable = prop.minusable
    const detailColumn:ProColumns[] = []
    const editorFormRef = useRef<EditableFormInstance>();
    // detail.editorFormRef = editorFormRef.current.
    const setValues = (values:any[]) => { detail.values = values}
    let entries =  Object.entries(detail.columns)
    if (entries.length === 0)
        return (<></>)
    for (let [key,column] of entries)
        detailColumn.push(transprotColumn(key,detail.values,column as ColumnSimpleOut,prop.getEditAble(key),editorFormRef))
    
    if (prop.editable)
        detailColumn.push(
            {
                title: '操作',
                valueType: 'option',
                width: 200,
                render: (text, record, _, action) => [
                <Button
                    key="editable"
                    onClick={() => {
                    action?.startEditable?.(record.detailDataId);
                    }}
                >
                    {prop.editable?"操作":""}
                </Button>,
                ],
            }
        )
    return (
        <EditableProTable
            editableFormRef={editorFormRef}
            rowKey="detailDataId"
            headerTitle={detail.detailName}
            dataSource={detail.values}
            scroll={{
            x: 960,
            }}
            recordCreatorProps={
            position !== 'hidden'
                ? {
                    position: position as 'top',
                    record: () => ({ detailDataId: (Math.random() * -1000000) }),
                }
                : false
            }
            loading={false}
            columns={detailColumn}
            request={async () => {
                return {
                    data:detail.values,
                    total:detail.values.length,
                    success:true
                }
            }}

            editable={{
            type: 'multiple',
            onSave: async (rowKey, data, row) => {
                console.log(rowKey,data,row)
                console.log(detail.values)
                detail.values[data.index] = data
            },
            onDelete:async(key, row)=>{
                detail.values = detail.values.filter((record,index,array)=>record.detailDataId !== key)  
            },
            }}
      />
    )

}

const GroupForm = (prop:{group:Group,getEditAble:(columnName:string)=>boolean,form:FormInstance}) => {
    const group = prop.group
    
    let count = 0
    let row:React.JSX.Element[] = []
    let children:React.JSX.Element[] = []
    let entries = Object.entries(group.columns)
    if (entries.length === 0)
        return (<></>)

    for (let [key,value] of entries) {
        row.push(transportInput(key,group.values,value as ColumnSimpleOut,prop.form,prop.getEditAble(key)))    
        count++
        if (count == 2 || (value as ColumnSimpleOut).columnType == columnType.areaText) {
            children.push(
                <ProForm.Group style={{width:"100vh"}} key={children.length} >{row}</ProForm.Group>
            )
            // children.push(
            //     <div style={{width:"100vh"}} />
            // )
            row = []
            count = 0
        }
    }
    if (count === 1)
        children.push(<ProForm.Group key={children.length}>{row}</ProForm.Group>)
    return (
    <ProForm.Group
        title = {group.groupName}
        key={group.groupId}
    >
        {children}
    </ProForm.Group>
    )
}



const getFormIn = (formOut:FormOut):FormIn => {
    console.log("formOut")
    console.log(formOut)
    let mains = {};
    formOut.groups.forEach((group,index,array)=>{
        for (let [key,value] of Object.entries(group.values))
            mains[key] = value;
    })
    let details:any[][] = []
    for (let {values} of formOut.details) {
        details.push(values)
    }
    let formIn: FormIn = {
        tableId:formOut.tableId,
        mains:mains,
        detailValueMapLists:details
    }
    console.log("formIn")
    console.log(formIn)
    return formIn
}

const FrontFormConcrete = (prop:{formOut:FormOut|null,editAbleList:string[],submitter:React.JSX.Element[],getDetailAuthority:(detailId:number,type:'add'|'remove'|'edit')=>boolean}) => {
    const query = new URLSearchParams(useLocation().search);
    const [formOut, setFormOut] = React.useState(prop.formOut);
    const params = useParams()
    const type =parseInt(query.get("type") ?? "1") 
    const [form] = Form.useForm()
    const getEditAble = (columnName:string):boolean => {
        if (type === 0)
            return true;
        else
            return prop.editAbleList.includes(columnName)
    }
    useEffect(()=>{
        if (formOut == null) {
                let dataId = parseInt(params.formId ?? "0")
                let tableId = parseInt(query.get("tableId") ?? "0")
                if (tableId === 0) {
                    message.error("未传入formOut结构且缺少指定表单id")
                    return
                }
                let isVirtual = query.get("isVirtual") === "true"
                let param:any = {
                    isVirtual:isVirtual,
                    tableId:tableId
                }
                let s:string = new URLSearchParams(param).toString();
                console.log(config.fronts.form+"/"+dataId+"?"+s)
                param.type = dataId === 0?0:1
                let auParam = new URLSearchParams(param).toString();
                if  (type === 0)
                    getDataOne(config.fronts.form+"/"+dataId+"?"+auParam).then((value)=>{
                        if (value.success && value.data)
                            getDataOne(config.fronts.form+"/"+dataId+"?"+s).then((value)=>{
                                if (value.success)
                                    setFormOut(value.data)
                            })
                        else 
                            message.warning("没有编辑权限")
                    })
                else
                    getDataOne(config.fronts.form+"/"+dataId+"?"+s).then((value)=>{
                        if (value.success)
                            setFormOut(value.data)
                        
                    })
            }
    })
    const baseStyle: React.CSSProperties = {
        width: '25%',
      };
    if (formOut === null)
        return (<PageWait />)
    console.log(formOut)
    window.sessionStorage.setItem("tableId",formOut.tableId.toString())
    window.sessionStorage.setItem("isVirtual",formOut.virtual.toString())
    window.sessionStorage.setItem("formId",formOut.dataId.toString())
    const save =async ()=>{
        let param:any = {isVirtual:formOut.virtual,tableId:formOut.tableId,type:1}
        let s:string = new URLSearchParams(param).toString()
        console.log("formIn")
        console.log(getFormIn(formOut))
        let returns:boolean = false
        if (formOut.dataId === -1||formOut.dataId === 0)
            formOut.dataId = await newData(config.fronts.form+"?"+s,getFormIn(formOut))
        else
            returns = !(await UpdateData(config.fronts.form+"/"+formOut.dataId+"?"+s,getFormIn(formOut)))
        if (formOut.dataId === 0||formOut.dataId === -1|| returns)
            return
        window.location.assign(url.frontUrl.form_concrete+formOut.dataId+"?"+s)

    }
    const edit =async ()=>{
        let param:any = {isVirtual:formOut.virtual,tableId:formOut.tableId,type:0}
        let s:string = new URLSearchParams(param).toString()
        window.location.assign(url.frontUrl.form_concrete+formOut.dataId+"?"+s)
    }
    const deletes = async ()=>{
        let param:any = {isVirtual:formOut.virtual,tableId:formOut.tableId,formId:formOut.dataId}
        let s:string = new URLSearchParams(param).toString()
        console.log()
        await deleteData(config.fronts.form+"/"+formOut.dataId,param)
        window.close()
    }
    const mainGroups = formOut.groups.map((value,index,array)=><GroupForm key={index} group={value} form={form} getEditAble={getEditAble} />)
    const detailLists = formOut.details.map((value,index,array)=><DetailTable key={index} detail={value} getEditAble={getEditAble} addable={type===0||prop.getDetailAuthority(value.detailId,"add")} minusable={type===0||prop.getDetailAuthority(value.detailId,"remove")} editable={type===0||prop.getDetailAuthority(value.detailId,"edit")}/>)
    let subbmiter:React.JSX.Element[]
    
    if (prop.submitter.length === 0)
        if (type === 0)
            subbmiter =  [<Button key='save' type='primary' onClick={save}>保存</Button>]
        else
            subbmiter = [<Button key={"edit"} type='primary' onClick={edit}>编辑</Button>,<div key="border" style={{width:'10px'}}/>,<Button danger key={"delete"} onClick={deletes}>删除</Button>]
    else 
        subbmiter = prop.submitter
    
    const mainForm = (<ProForm
        form={form}
        style={{
            margin:"0 auto"
        }}
        rowProps={{
            gutter: [16, 16],
          }}
        submitter={{
            render:(props,doms)=>(<></>)
        }}
        
        layout="horizontal"
        onValuesChange={(changedValues,values)=>{
            console.log(changedValues)
            Object.entries(changedValues).forEach((value,index,array) =>{
                for (let group of formOut.groups)
                    for(let key of Object.keys(group.values))
                        if (key === value[0])
                            group.values[value[0]] = value[1]
            })
            console.log(formOut)
        }}
    >
        {mainGroups}
    </ProForm>)
    config.globalSrollHidden = false
    return (
        <Layout style={{ minHeight: '100vh'}}>
            <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px",}}>
                <div style={{display:'flex'}}>
                <Title level={2} style={{color:'GrayText', marginLeft:'10px',marginBottom:'15px'}}>{formOut.tableName}</Title>
                </div>
            </Header>
            <Flex vertical={false} style={{background: "#ffffff",padding:"10px"}}>{Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ ...baseStyle}} />
        ))}{subbmiter}<div style={{width:"2.5%"}}></div></Flex>
            <Content style={{ padding: '15px 50px', minHeight:'100%',overflowY:'auto'}}>
                <Card>{mainForm}</Card>
                
                <div style={{margin:"10px"}}></div>
                {detailLists}
            </Content>
        </Layout>
    )
    
}

FrontFormConcrete.defaultProps = {
    formOut:null,
    editAbleList:[],
    submitter:[],
    getDetailAuthority:()=>false
}

export default FrontFormConcrete