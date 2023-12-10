import React, { useEffect } from "react"
import { FormOut } from "../../const/out.tsx"
import { useLocation, useParams } from "react-router"
import PageWait from "../../componet/PageWait.tsx"
import { message } from "antd"
import { getDataOne } from "../../const/http.tsx"
import config from "../../const/config.js"

type FormIn = {
    tableId:number
    mains:any
    details:any[][]
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
    
}

FrontFormConcrete.defaultProps = {
    formOut:null,
    editAbleList:[]
}

export default FrontFormConcrete