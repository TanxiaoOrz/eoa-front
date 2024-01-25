import { ProFormText } from "@ant-design/pro-components"
import { ColumnSimpleOut, FileOut } from "../const/out.tsx"
import React, { useState } from "react"
import { getDataOne } from "../const/http.tsx"
import config from "../const/config.js"
import { Button, FormInstance, Upload, UploadProps, message } from "antd"
import { UploadOutlined } from "@ant-design/icons"

export default (prop:{dataName:string,column:ColumnSimpleOut,values:any,edit:boolean,set:(key:string,value:number)=>void}) => {
    // console.log("prop.values")
    // console.log(prop.values)
    const [file,setFile] = useState<FileOut>()
    const description:{contentId:number} = JSON.parse(prop.column.columnTypeDescription)
    if (prop.values?.[prop.dataName] !== null && prop.values?.[prop.dataName] !== undefined){
        // console.log("getFile")
        if (file === undefined) {
            let tableId = window.sessionStorage.getItem("tableId")
            let formId = window.sessionStorage.getItem("formId")
            let isVirtual = window.sessionStorage.getItem("isVirtual")
            let params:any = {tableId:tableId,formId:formId,isVirtual:isVirtual}
            let s = new URLSearchParams(params).toString()
            let dataId = prop.values?.[prop.dataName]
            if (dataId === undefined || dataId === ""){
                return
            } else
                getDataOne(config.fronts.file_form+"/"+prop.values?.[prop.dataName]+"?"+s).then((ret)=>{
                    if (ret.success)
                        setFile(ret.data)
                })
        }}

    const upLoadProos:UploadProps = {
        headers:{
            tokens:localStorage.getItem('tokens') ?? ""
        },
        method:"POST",
        action:config.backUrl+config.fronts.upload+"/form",
        data:{
            leadContent:description.contentId
        },
        showUploadList:false,
        maxCount:1,
        onChange:(info) => {
            let {status, response, name} = info.file
            if (status === 'done')
                if (response.code === 0) {
                    let file:FileOut = response.entity
                    prop.set(prop.dataName,file.dataId)
                    console.log(file)
                    message.success("上传成功")
                    setFile(file)
                } else {
                    message.error(response.description)
                }
        },
        itemRender:()=>{return (<></>)}
        }
    const addonAfter = [<a href={file?.fileRoute}>{file?.fileName}</a>]
    if (prop.edit)
          addonAfter.push(<Upload {...upLoadProos} ><Button icon={<UploadOutlined />}/></Upload>)
    return (
        <ProFormText 
            width={0}
            name={prop.dataName}
            label={prop.column.columnViewName}
            readonly
            addonAfter = {<>{addonAfter}</>}
        />
    )
}

export const UploadFileProposed = (prop:{label:string,name:string,form:FormInstance,content:number}) => {
    const [file,setFile] = useState<FileOut>()
    const contentId = prop.content
    let fileId = prop.form.getFieldValue(prop.name)
    if (fileId !== null && fileId !== undefined){
        // console.log("getFile")
        if (file === undefined) {
            if (fileId === undefined || fileId === "" || fileId === "0" || fileId === 0){
                return
            } else
                getDataOne(config.fronts.file+"/"+fileId).then((ret)=>{
                    if (ret.success)
                        setFile(ret.data)
                })
        }}

    const upLoadProos:UploadProps = {
        headers:{
            tokens:localStorage.getItem('tokens') ?? ""
        },
        method:"POST",
        action:config.backUrl+config.fronts.upload+"/form",
        data:{
            leadContent:contentId
        },
        showUploadList:false,
        maxCount:1,
        onChange:(info) => {
            let {status, response, name} = info.file
            if (status === 'done')
                if (response.code === 0) {
                    let file:FileOut = response.entity
                    message.success("上传成功")
                    prop.form.setFieldValue(prop.name,file.dataId)
                    setFile(file)
                } else {
                    message.error(response.description)
                }
        },
        itemRender:()=>{return (<></>)}
        }
    const addonAfter = [<a href={file?.fileRoute}>{file?.fileName}</a>,<Upload {...upLoadProos} ><Button icon={<UploadOutlined />}/></Upload>]
    
    return <ProFormText
                width={0}
                name={prop.name}
                label={prop.label}
                readonly
                addonAfter = {addonAfter}
            />
}