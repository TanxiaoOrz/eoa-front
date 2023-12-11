import { ProForm, ProFormText } from "@ant-design/pro-components"
import { ColumnSimpleOut, FileOut } from "../const/out.tsx"
import React, { useEffect, useState } from "react"
import { getDataOne } from "../const/http.js"
import config from "../const/config.js"
import { useSearchParams } from "react-router-dom"
import { Dropdown } from "antd"

export default (prop:{key:string,column:ColumnSimpleOut,value:number|null}) => {
    const [file,setFile] = useState<FileOut>()
    if (prop.value !== null || prop.value !== undefined)
        useEffect(()=>{
            if (file === undefined) {
                let tableId = window.sessionStorage.getItem("tableId")
                let formId = window.sessionStorage.getItem("formId")
                let isVirtual = window.sessionStorage.getItem("isVirtual")
                let params:any = {tableId:tableId,formId:formId,isVirtual:isVirtual}
                let s = new URLSearchParams(params).toString()
                getDataOne(config.fronts.file_form+"/"+prop.value+"&"+s).then((ret)=>{
                    if (ret.success)
                        setFile(ret.data)
                })
            }
        })
    return (
        <ProFormText 
            width={0}
            name={prop.key}
            label={prop.column.columnViewName}
            initialValue={prop.value}
            readonly
            addonAfter = {
                // TODO
                // <Dropdown.Button
                //     type="primary"
                //     menu={
                //         {items:[{
                //             key: '1',
                //             label: '废弃',
                //             danger:true,
                //         }],onClick:() => {
                //             deleteData(config.fronts.file+"/"+entity.dataId).then(
                //                 (value)=>{if (value) actionRef.current?.reload()}
                //             )}
                //     }
                //     }
                //     onClick={()=>{
                //     window.open(config.backUrl+entity.fileRoute)
                //     }}>下载</Dropdown.Button>
            }
        />
    )
}