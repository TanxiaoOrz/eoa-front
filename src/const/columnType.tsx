import { ProFormText, ProFormTextArea, ProFormDigit, ProFormDateTimePicker, ProFormSelect, ProFormTreeSelect, ProColumns, EditableFormInstance } from "@ant-design/pro-components"
import React from "react"
import { ColumnOut, ColumnSimpleOut, FormOut } from "./out.tsx"
import { getDataList } from "./http.tsx"
import config from "./config"
import { Button, FormInstance, message } from "antd"
import url from "./url"
import UpLoadFile from "../componet/UpLoadFile.tsx"

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

export const transprotColumn = (key:string,values:any[],columnSimple:ColumnSimpleOut,editable:boolean,editorFormRef:React.MutableRefObject<EditableFormInstance | undefined>):ProColumns => {
    // console.log(values)
    let column:ProColumns = {
        title:columnSimple.columnViewName,
        dataIndex:key,
        editable:(text, record, index) => {
            return (editable && columnSimple.columnType !== columnType.file)
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
                let description:{
                    items:string
                } = JSON.parse(columnSimple.columnTypeDescription);
                return description.items.split(',').map((value,index,array)=>{
                    return {label:value,value:index}
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
            column.valueType = 'treeSelect'
            column.request = async () => {
                let formOut:FormOut[] = (await getDataList(config.fronts.form,description)).data
                return formOut.map((value,index,array)=>{return {title:value.title,value:value.dataId}})
            }
            column.render = (text,entity,index,action) => {
                let title = text?.valueOf().toString()
                let param:any = {isVirtual:description.isVirtual,tableId:description.tableId} 
                let s = new URLSearchParams(param).toString()
                return <a href={url.frontUrl.form_concrete+"/"+values[index][key]+"&"+s}>{title??""}</a>
            }
            return column
        }
        case columnType.file :{
            column.render=(text,entity,index,action)=>{
                // console.log(entity)
                return <UpLoadFile 
                dataName={key} 
                column={columnSimple} 
                set={(key,value)=>{
                    let change = {}
                     change[key] = value
                     editorFormRef.current?.setRowData?.(index,change)
                    }} 
                values={entity} 
                edit={editable}/>
            }
            return column
        }
        default : return column
    }   
}

export const transportInput = (key:string,values:any,columnSimple:ColumnSimpleOut,form:FormInstance,editable:boolean) => {
    switch (columnSimple.columnType) {
        case columnType.singleText: {
            return (
                <ProFormText
                    key={key}
                    width='lg'
                    name={key}
                    label={columnSimple.columnViewName}
                    initialValue={values[key]}
                    disabled={!editable}
                />
            )
        }
        case columnType.areaText :{
            return (
                <ProFormTextArea
                    style={{width:"20vh"}}
                    width='xl'
                    key={key}
                    name={key}
                    label={columnSimple.columnViewName}
                    initialValue={values[key]}
                    disabled={!editable}
                />
            )
        }
        case columnType.number :{
            return (
                <ProFormDigit
                    key={key}
                    width='lg'
                    name={key}
                    label={columnSimple.columnViewName}
                    initialValue={values[key]}
                    disabled={!editable}
                />
            )
        }
        case columnType.date :{
            return (
                <ProFormDateTimePicker
                    width='lg'
                    key={key}
                    name={key}
                    label={columnSimple.columnViewName}
                    initialValue={values[key]}
                    disabled={!editable}
                />
            )
        }
        case columnType.select :{
            return (
                <ProFormSelect 
                    width='lg'
                    key={key}
                    name={key}
                    label={columnSimple.columnViewName}
                    initialValue={values[key]}
                    disabled={!editable}
                    request={async ()=>{
                        let returns:any[]
                        if (columnSimple.columnTypeDescription === null || columnSimple.columnTypeDescription === "")
                            returns = []
                        returns = JSON.parse(columnSimple.columnTypeDescription).items.split(',').map((value,index,array)=>{
                            return {label:value,value:index}
                        })
                        return returns
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
            return (
                
                <ProFormTreeSelect
                    width='lg'
                    key={key}
                    name={key}
                    label={columnSimple.columnViewName}
                    initialValue={values[key]}
                    disabled={!editable}
                    request={async () => {
                        let formOut:FormOut[] = (await getDataList(config.fronts.form,description)).data
                        return formOut.map((value,index,array)=>{return {title:value.title,value:value.dataId}})
                    }}
                    addonAfter={
                        <Button 
                            onClick={()=>{
                                if (values[key]===null||values[key]===undefined) {
                                    message.warning(columnSimple.columnViewName+"没有值")
                                    return
                                }
                                let param:any = {isVirtual:description.isVirtual,tableId:description.tableId} 
                                let s = new URLSearchParams(param).toString()
                                window.open(url.frontUrl.form_concrete+values[key]+"?"+s)
                            }}
                        >查看</Button>
                    }/>
            )
        }
        case columnType.file :{
            return (<UpLoadFile dataName={key} column={columnSimple} set={form.setFieldValue} values={values} edit={editable} />)
        }
        default : return (<></>)
    }
}

export const transprotColumnSearch = (columnSimple:ColumnOut, title:string):ProColumns[] => {
    let key = columnSimple.columnDataName
    // console.log(values)
    let column:ProColumns = {
        title:title,
        dataIndex:columnSimple.columnDataName,
    }
    switch (columnSimple.columnType) {
        case columnType.singleText: {
            column.valueType = 'text'
            return [column]
        }
        case columnType.areaText :{
            column.valueType = 'textarea'
            return [column]
        }
        case columnType.number :{
            column.valueType = 'digit'
            column.key = columnSimple.columnDataName+"show"
            let columnSearch:ProColumns = JSON.parse(JSON.stringify(column))
            column.hideInSearch = true
            columnSearch.hideInTable = true
            columnSearch.valueType = 'digitRange'
            columnSearch.key = columnSimple.columnDataName
            return [column, columnSearch]
        }
        case columnType.date :{
            let columnSearch:ProColumns = JSON.parse(JSON.stringify(column))
            column.valueType = 'dateTime'
            column.key = columnSimple.columnDataName
            column.hideInSearch = true
            columnSearch.hideInTable = true
            columnSearch.valueType = 'dateRange'
            columnSearch.key = columnSimple.columnDataName
            return [column, columnSearch]
        }
        case columnType.select :{
            column.valueType = 'select'
            
            column.request=async ()=>{
                if (columnSimple.columnTypeDescription === null || columnSimple.columnTypeDescription === "")
                    return []
                let description:{
                    items:string
                } = JSON.parse(columnSimple.columnTypeDescription);
                return description.items.split(',').map((value,index,array)=>{
                    return {label:value,value:index}
                })
            }
            return [column]
        }
        case columnType.browser :{
            const valueEnum:{val:any[]} = {val:[]}
            const description:{
                isVirtual:false,
                tableId:undefined,
                columnId:undefined
            } = JSON.parse(columnSimple.columnTypeDescription);
            column.valueType = 'select'
            column.request = async () => {
                let formOut:FormOut[] = (await getDataList(config.fronts.form,description)).data
                let con = formOut.map((value,index,array)=>{return {label:value.title,title:value.title,value:value.dataId,index:value.dataId}})
                valueEnum.val = con
                console.log("valueEnum",valueEnum)
                return con
            }
            column.render = (text,entity,index,action) => {
                let param:any = {isVirtual:description.isVirtual,tableId:description.tableId} 
                let s = new URLSearchParams(param).toString()
                return <a href={url.frontUrl.form_concrete+entity[key]+"&"+s}>{text}</a>
            }
            return [column]
        }
        case columnType.file :{
            column.render=(text,entity,index,action)=>{
                window.sessionStorage.setItem("formId", entity.dataId.toString())
                return <UpLoadFile 
                dataName={key} 
                column={columnSimple} 
                set={(key,value)=>{}} 
                values={entity} 
                edit={false}/>
            }
            column.hideInSearch = true
            return [column]
        }
        default : return [column]
    }   
}