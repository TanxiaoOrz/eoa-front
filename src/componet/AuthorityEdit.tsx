import React from "react";
import { ColumnOut } from "../const/out.tsx";
import { getDataList } from "../const/http.tsx";
import url from "../const/url.js";
import { Tabs } from "antd";
import { ProForm, ProFormDigit, ProFormSelect } from "@ant-design/pro-components";
import columnType from "../const/columnType";

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
        },{
            key:"form",
            label:"表单选择",
            children:(
            <ProForm 
                initialValues={prop.form}
                layout="inline"
                onFinish={async (values)=>{
                    return prop.updateForm(JSON.stringify(values))
                }}    
            >
                <ProFormSelect
                    label="最小安全等级"
                    name="start"
                    width="sm"
                    request={async ()=>{
                        let columns:ColumnOut[] = (await getDataList(url.backUrl.column,{isVirtual:prop.isVirtual,tableNo:prop.tableId})).data
                        return columns.filter((column)=>{return column.columnType===columnType.number})
                            .map((value,index,array)=>{
                                return {
                                    value:value.columnId,
                                    label:value.columnDataName
                                }
                            })
                    }}
                    placeholder="请选择代表最小安全等级的字段"
                    required = {true}
                />
                <ProFormSelect
                    label="最大安全等级"
                    name="end"
                    width="sm"
                    request={async ()=>{
                        let columns:ColumnOut[] = (await getDataList(url.backUrl.column,{isVirtual:prop.isVirtual,tableNo:prop.tableId})).data
                        return columns.filter((column)=>{return column.columnType===columnType.number})
                            .map((value,index,array)=>{
                                return {
                                    value:value.columnId,
                                    label:value.columnDataName
                                }
                            })
                    }}
                    placeholder="请选择代表最大安全等级的字段"
                    required = {true}
                />
            </ProForm>)
        }
    ]
    if (prop.useForm)
    return (
    <Tabs
        activeKey="default"
        centered
        items={alls}></Tabs>
    )
}

AllConstraint.defaultProps = {
    tableId:0,
    isVirtual:false
}


const CreatorConstraint = (prop:{
    default:All|undefined,
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
    const alls = [{
        key:"default",
        label:"默认",
        children:(
        <ProForm
            initialValues={prop.default}
            onFinish={async (values)=>{
                return prop.update(JSON.stringify(values))
            }}
        >
            <ProFormSelect
                label="创建人"
                name="self"
                options={items}
                tooltip="创建人自己是否拥有该权限"
            />
            <ProFormSelect
                label="直属领导"
                name="leader"
                options={items}
                tooltip="创建人领导是否拥有该权限按"
            />
            <ProFormSelect
                label="上级领导"
                name="leaderRecursion"
                options={items}
                tooltip="创建人领导及其领导是否拥有该权限按"
            />
            <ProFormSelect
                label="同部门"
                name="depart"
                options={items}
                tooltip="创建人同部门是否拥有该权限按"
            />
            <ProFormSelect
                label="同分部"
                name="section"
                options={items}
                tooltip="创建人同分布是否拥有该权限按"
            />
            <ProFormSelect
                label="同分部"
                name="section"
                options={items}
                tooltip="创建人分布及其上级分部是否拥有该权限按"
            />
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

CreatorConstraint.defaultProps = {
    tableId:0,
    isVirtual:false
}




export const AuthorityEdit = (prop:{
    entity:any,
    tableId:number,
    isVirtual:boolean,
    authorityName:string
})=>{

    const tableId = prop.tableId;
    const useForm = tableId !== 0
    
    let authority:Authority =JSON.parse(prop.entity[prop.authorityName]) 
    if (authority === null)
        authority = {
            body:new Map<string,string>(),
            bodyType:"",
            table:new Map<string,string>(),
            tableType:""
        }
    const tabs = [
        {
            key:"all",
            label:"所有人",
            children:(
            <div style={{display:"flex" ,justifyContent:"center" }}>
                <AllConstraint 
                default={authority.body.get("allConstarint")===undefined?undefined:JSON.parse(""+authority.body.get("allConstarint"))}
                form={authority.table.get("allConstarint")===undefined?undefined:JSON.parse(""+authority.table.get("allConstarint"))}
                useForm={useForm}
                update={(all)=>{authority.body.set("allConstarint",all);return true}}
                updateForm={(all)=>{authority.table.set("allConstarint",all);return true}}
                tableId={tableId}
                isVirtual={prop.isVirtual}
            />
            </div>
            )
        }
    ]


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
            style={{height:"90vh"}}
            
            items={tabs}>
                
        </Tabs>
    )
}

AuthorityEdit.defaultProps = {
    tableId:0
}