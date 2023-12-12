import React, { useEffect } from "react"
import { ColumnSimpleOut, Detail, FormOut, Group } from "../../const/out.tsx"
import { useLocation, useParams } from "react-router"
import PageWait from "../../componet/PageWait.tsx"
import { Button, Form, FormInstance, Layout, Typography, message } from "antd"
import { UpdateData, getDataOne } from "../../const/http.tsx"
import config from "../../const/config.js"
import { EditableProTable, ProColumns, ProForm, ProFormGroup } from "@ant-design/pro-components"
import { columnType, transportInput, transprotColumn } from "../../const/columnType.tsx"
import { FolderOpenTwoTone } from "@ant-design/icons"
import { Header, Content } from "antd/es/layout/layout"
import url from "../../const/url.js"


const {Title} = Typography

type FormIn = {
    tableId:number
    mains:any
    details:any[][]
}

const Detail = (prop:{detail:Detail,getEditAble:(columnName:string)=>boolean,addable:boolean,minusable:boolean,editable:boolean}) => {
    const detail = prop.detail
    const position = prop.addable?'bottom':'hidden'
    const deleteable = prop.minusable
    const detailColumn:ProColumns[] = []
    const setValues = (values:any) => { detail.values = values}
    for (let [key,column] of Object.entries(detail.columns))
        detailColumn.push(transprotColumn(key,detail.values,column as ColumnSimpleOut,prop.getEditAble(key)))
    detailColumn.push(
        {
            title: '操作',
            valueType: 'option',
            width: 200,
            render: (text, record, _, action) => [
              <a
                key="editable"
                onClick={() => {
                  action?.startEditable?.(record.id);
                }}
              >
                {prop.editable?"编辑":""}
              </a>,
              <a
                key="delete"
                onClick={() => {
                  setValues(detail.values.filter((item) => item.detailDataId !== record.detailDataId));
                }}
              >
                {deleteable?"删除":""}
              </a>,
            ],
          }
    )
    return (
        <EditableProTable
            rowKey="detailDataId"
            headerTitle={detail.detailName}
            maxLength={5}
            scroll={{
            x: 960,
            }}
            recordCreatorProps={
            position !== 'hidden'
                ? {
                    position: position as 'top',
                    record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
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
                console.log(rowKey, data, row);
                // detail.values[row] = data
            },
            }}
      />
    )

}

const GroupForm = (prop:{group:Group,getEditAble:(columnName:string)=>boolean,form:FormInstance}) => {
    const group = prop.group
    const children:React.JSX.Element[] = []
    let count = 0
    let row:React.JSX.Element[] = []
    for (let [key,value] of Object.entries(group.columns)) {
        row.push(transportInput(key,group.values,value as ColumnSimpleOut,prop.form,prop.getEditAble(key)))    
        count++
        if (count == 2 || (value as ColumnSimpleOut).columnType == columnType.areaText) {
            children.push(
                <ProFormGroup>
                    {row}
                </ProFormGroup>
            )
            row = []
            count = 0
        }
    }
    if (count === 1) {
        children.push(
            <ProFormGroup>
                {row}
            </ProFormGroup>
        )
    }
    return (
    <ProForm.Group
        title = {group.groupName}
    >{children}</ProForm.Group>
    )
}



const getFormIn = (formOut:FormOut):FormIn => {
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
        details:details
    }
    return formIn
}

const FrontFormConcrete = (prop:{formOut:FormOut|null,editAbleList:string[],submitter:React.JSX.Element[],getDetailAuthority:(detailId:number,type:'add'|'remove'|'edit')=>boolean}) => {
    const query = new URLSearchParams(useLocation().search);
    const [formOut, setFormOut] = React.useState(prop.formOut);
    const params = useParams()
    const type =parseInt(query.get("type") ?? "1") 
    const getEditAble = (columnName:string):boolean => {
        if (type === 0)
            return true;
        else
            return prop.editAbleList.includes(columnName)
    }
    useEffect(()=>{
        if (formOut == null) {
                let dataId = parseInt(params.formId ?? "0")
                if (dataId === 0) {
                    message.error("未传入formOut结构且缺少指定表单数据id")
                    return
                }
                let tableId = parseInt(query.get("tableId") ?? "0")
                if (tableId === 0) {
                    message.error("未传入formOut结构且缺少指定表单id")
                    return
                }
                let isVirtual = query.get("isVirtual") === "false"
                let param:any = {
                    isVirtual:isVirtual,
                    tableId:tableId
                }
                let s:string = new URLSearchParams(param).toString();
                getDataOne(config.fronts.form+"/"+dataId+"?"+s).then((value)=>{
                    if (value.success)
                        setFormOut(value.data)
                    else
                        message.error("该数据不存在")
                })
            }
    })
    if (formOut === null)
        return (<PageWait />)
    window.sessionStorage.setItem("tableId",formOut.tableId.toString())
    window.sessionStorage.setItem("isVirtual",formOut.virtual.toString())
    window.sessionStorage.setItem("formId",formOut.dataId.toString())
    const [form] = Form.useForm()
    const save =async ()=>{
        let param:any = {isVirtual:formOut.virtual,tableId:formOut.tableId}
        let s:string = new URLSearchParams(param).toString()
        window.location.assign(url.frontUrl.form_concrete+"/"+formOut.dataId+"&"+s)
        return await UpdateData(config.fronts.form+"/"+formOut.dataId+"&"+s,getFormIn(formOut))
    }
    const mainGroups = formOut.groups.map((value,index,array)=><GroupForm key={index} group={value} form={form} getEditAble={getEditAble} />)
    const detailLists = formOut.details.map((value,index,array)=><Detail key={index} detail={value} getEditAble={getEditAble} addable={type===0||prop.getDetailAuthority(value.detailId,"add")} minusable={type===0||prop.getDetailAuthority(value.detailId,"remove")} editable={type===0||prop.getDetailAuthority(value.detailId,"edit")}/>)
    const mainForm = (<ProForm
        form={form}
        style={{
            margin:"0 auto"
        }}
        submitter={{
            render:(props,doms)=>{ 
                if (prop.submitter.length === 0)
                return (<Button type='primary' onClick={save}>保存</Button>)
            }
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
    return (
        <Layout style={{ minHeight: '100vh'}}>
            <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px",}}>
                <div style={{display:'flex'}}>
                <Title level={2} style={{color:'GrayText', marginLeft:'10px',marginBottom:'15px'}}>应用列表</Title>
                </div>
            </Header>
            <Content style={{ padding: '15px 50px', minHeight:'100%'}}>
                {mainForm}
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