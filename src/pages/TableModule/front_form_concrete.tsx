import React, { useEffect } from "react"
import { ColumnSimpleOut, FormOut, Group } from "../../const/out.tsx"
import { useLocation, useParams } from "react-router"
import PageWait from "../../componet/PageWait.tsx"
import { Form, message } from "antd"
import { getDataOne } from "../../const/http.tsx"
import config from "../../const/config.js"
import { ProForm, ProFormDateTimePicker, ProFormDigit, ProFormGroup, ProFormText, ProFormTextArea } from "@ant-design/pro-components"
import { columnType, transportInput } from "../../const/columnType.tsx"

type FormIn = {
    tableId:number
    mains:any
    details:any[][]
}

const GroupForm = (prop:{group:Group,getEditAble:(columnName:string)=>boolean}) => {
    const group = prop.group
    const children:React.JSX.Element[] = []
    let count = 0
    let row:React.JSX.Element[] = []
    for (let [key,value] of Object.entries(group.columns)) {
        row.push(transportInput(key,group.values,value as ColumnSimpleOut,prop.getEditAble(key)))    
        count++
        if (count == 2 || (value as ColumnSimpleOut).columnType == columnType.areaText) {
            children.push(
                <ProFormGroup>
                    row
                </ProFormGroup>
            )
            row = []
            count = 0
        }
    }
    if (count === 1) {
        children.push(
            <ProFormGroup>
                row
            </ProFormGroup>
        )
    }
    return (
    <ProForm.Group
        title = {group.groupName}
        children = {children}
    />)
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

const FrontFormConcrete = (prop:{formOut:FormOut|null,editAbleList:string[]}) => {
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
    
}

FrontFormConcrete.defaultProps = {
    formOut:null,
    editAbleList:[]
}

export default FrontFormConcrete