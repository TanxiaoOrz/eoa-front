import React, { useEffect, useState } from "react";
import { ColumnOut, TableOut } from "../const/out";
import { getDataList } from "../const/http";
import url from "../const/url";
import { tab } from "@testing-library/user-event/dist/tab";
import { Tabs } from "antd";
import { ProForm } from "@ant-design/pro-components";

type All = {
    start:number
    end:number
}
type Authority = {
    bodyType:string,
    body:Map<string,string>,
    tableType:string,
    table:Map<string,string>,
}
const AllConstraint = (prop:{default:All,form:All,useForm:boolean,update:function(string):void}) => {
    const alls = [{
        key:"default",
        label:"默认",
        children:(<ProForm>

        </ProForm>)
    }]
    return (
    <Tabs
        activeKey="default"
        centered
        items={}
    )
}





const AuthorityEdit = (prop:{
    entity:any,
    setTable:React.Dispatch<React.SetStateAction<any>>,
    tableId:number,
    authorityName:string
})=>{

    const tableId = prop.tableId;
    const useForm = tableId !== 0
    const [columns,setColumns] = useState<ColumnOut[]>([])
    if (useForm)
        useEffect(()=>{
            getDataList(url.backUrl.column,{tableNo:tableId}).then(
                (value)=>{
                    if (value.success = true)
                        setColumns(value.data);
                }
            )
        })
    const tabs = [
        {
            key:"all",
            label:"所有人"
            children:(<AllConstraint />)
        }
    ]

    const authority:Authority =JSON.parse(prop.entity[prop.authorityName]) 
    const saveAuthority = () =>{
        authority.bodyType = ""
        authority.body.forEach((value,key,map)=>{
            authority.bodyType += (key+",")
        })
        if (useForm) {
            authority.tableType = ""
            authority.table.forEach((value,key,map)=>{
                authority.bodyType += (key+",")
            })
        }
        prop.entity[prop.authorityName] = JSON.stringify(authority)
    }
    return (
        <Tabs
            tabPosition="left"
            style={{writingMode:"vertical-lr"}}
            items={tabs}
    )
}

AuthorityEdit.defaultProps = {
    tableId:0
}