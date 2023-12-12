import { ProFormText, ProFormTextArea, ProFormDigit, ProFormDateTimePicker, ProFormUploadButton, ProFormSelect, ProFormTreeSelect, ProColumns } from "@ant-design/pro-components"
import group from "antd/es/avatar/group"
import React from "react"
import { ColumnSimpleOut, FormOut } from "./out"
import { getDataList } from "./http"
import config from "./config"
import { Button, FormInstance, Upload } from "antd"
import url from "./url"
import UpLoadFile from "../componet/UpLoadFile"

export const columnType = {
    singleText: "SINGLE_TEXT",
    areaText:"TEXT",
    number:"NUMBER",
    browser:"BROWSER_BOX",
    select:"SELECT_ITEM",
    date:"DATETIME",
    file:"FILE"
}

export const columnTypeSelect = [
    {
        label:"单行文本",
        value:'SINGLE_TEXT'
    },{
        label:"多行文本",
        value:'TEXT'
    },{
        label:"数字",
        value:'NUMBER'
    },{
        label:"表单浏览框",
        value:'BROWSER_BOX'
    },{
        label:"选择框",
        value:'SELECT_ITEM'
    },{
        label:"时间",
        value:'DATETIME'
    },{
        label:"文件",
        value:'FILE'
    },
]

export const transprotColumn = (key:string,values:any,columnSimple:ColumnSimpleOut,editable:boolean):ProColumns => {
    let column:ProColumns = {
        title:columnSimple.columnViewName,
        dataIndex:key,
        editable:(text, record, index) => {
            return (editable && columnSimple.columnTypeDescription === columnType.file)
        }
    }
    switch (columnSimple.columnType) {
        case columnType.singleText: {
            column.valueType = 'text'
            return column
        }
        case columnType.areaText :{
            column.valueType = 'textarea'
            return column
        }
        case columnType.number :{
            column.valueType = 'digit'
            return column
        }
        case columnType.date :{
            column.valueType = 'dateTime'
            return column
        }
        case columnType.select :{
            column.valueType = 'select'
            column.request=async ()=>{
                if (columnSimple.columnTypeDescription === null || columnSimple.columnTypeDescription === "")
                    return []
                return columnSimple.columnTypeDescription.split(',').map((value,index,array)=>{
                    return {label:value,value,index}
                })
            }
            return column
        }
        case columnType.browser :{
            const description:{
                isVirtual:false,
                tableId:undefined,
                columnId:undefined
            } = JSON.parse(columnSimple.columnTypeDescription);
            let dataId = values[key]
            column.valueType = 'treeSelect'
            column.request = async () => {
                let formOut:FormOut[] = (await getDataList(config.fronts.form,description)).data
                return formOut.map((value,index,array)=>{return {title:value.title,value:value.dataId}})
            }
            column.render = (text,entity,index,action) => {
                let title = text?.valueOf().toString()
                let param:any = {isVirtual:description.isVirtual,tableId:description.tableId} 
                let s = new URLSearchParams(param).toString()
                return <a href={url.frontUrl.form_concrete+"/"+values[key]+"&"+s}>{title??""}</a>
            }
            return column
        }
        case columnType.file :{
            column.render=(text,entity,index,action)=>{
                return <UpLoadFile key={key} column={columnSimple} action={action} values={values} edit={editable}/>
            }
            return column
        }
        default : return column
    }   
}

export const transportInput = (key:string,values:any,columnSimple:ColumnSimpleOut,form:FormInstance,editable:boolean):React.JSX.Element => {
    switch (columnSimple.columnType) {
        case columnType.singleText: {
            return (
                <ProFormText
                    width='md'
                    name={key}
                    label={columnSimple.columnViewName}
                    initialValue={values[key]}
                    readonly={editable}
                />
            )
        }
        case columnType.areaText :{
            return (
                <ProFormTextArea
                    width='xl'
                    name={key}
                    label={columnSimple.columnViewName}
                    initialValue={values[key]}
                    readonly={editable}
                />
            )
        }
        case columnType.number :{
            return (
                <ProFormDigit
                    width='md'
                    name={key}
                    label={columnSimple.columnViewName}
                    initialValue={values[key]}
                    readonly={editable}
                />
            )
        }
        case columnType.date :{
            return (
                <ProFormDateTimePicker
                    width='md'
                    name={key}
                    label={columnSimple.columnViewName}
                    initialValue={values[key]}
                    readonly={editable}
                />
            )
        }
        case columnType.select :{
            return (
                <ProFormSelect 
                    width='md'
                    name={key}
                    label={columnSimple.columnViewName}
                    initialValue={values[key]}
                    readonly={editable}
                    request={async ()=>{
                        if (columnSimple.columnTypeDescription === null || columnSimple.columnTypeDescription === "")
                            return []
                        return columnSimple.columnTypeDescription.split(',').map((value,index,array)=>{
                            return {label:value,value,index}
                        })
                    }}
                />
            )
        }
        case columnType.browser :{
            const description:{
                isVirtual:false,
                tableId:undefined,
                columnId:undefined
            } = JSON.parse(columnSimple.columnTypeDescription);
            let dataId = values[key]
            return (
                
                <ProFormTreeSelect
                    width='md'
                    name={key}
                    label={columnSimple.columnViewName}
                    initialValue={values[key]}
                    readonly={editable}
                    request={async () => {
                        let formOut:FormOut[] = (await getDataList(config.fronts.form,description)).data
                        return formOut.map((value,index,array)=>{return {title:value.title,value:value.dataId}})
                    }}
                    addonAfter={
                        <Button 
                            onClick={()=>{
                                let param:any = {isVirtual:description.isVirtual,tableId:description.tableId} 
                                let s = new URLSearchParams(param).toString()
                                window.open(url.frontUrl.form_concrete+"/"+values[key]+"&"+s)
                            }}
                        >查看</Button>
                    }/>
            )
        }
        case columnType.file :{
            return (<UpLoadFile key={key} column={columnSimple} form={form} values={values} edit={editable} />)
        }
        default : return (<></>)
    }
}
