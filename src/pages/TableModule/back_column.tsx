import { PlusOutlined } from "@ant-design/icons";
import { ActionType, ModalForm, ProForm, ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea, ProFormTreeSelect } from "@ant-design/pro-components";
import { Button, Dropdown, Form, MenuProps, Modal, Table } from "antd"
import Title from "antd/lib/typography/Title";
import React, { useState } from "react";
import config from "../../const/config";
import { ColumnOut, ContentOut, DropSelect, TableOut } from "../../const/out"
import {deleteData, getDataList, UpdateData} from "../../const/http"
import { columnType, columnTypeSelect } from "../../const/columnType";
import {getTree} from '../../utils/tree';

const ColumnDescription = (prop:{type:string,set:(description:string)=>boolean}) => {
    const trigger = <Button>编辑</Button>
    switch (prop.type) {
        case columnType.browser :
            const [form] = Form.useForm<{isVirtual:boolean,tableId:number,columnId:number}>()
            return (
                <ModalForm
                    title="浏览框编辑"
                    trigger={
                        trigger
                    }
                    submitTimeout={2000}
                    autoFocusFirstInput
                    form={form}
                    width={300}
                    onFinish={async (values:{isVirtual:boolean,tableId:number,columnId:number})=>{
                        return prop.set(JSON.stringify(values));
                    }}>
                    <ProFormSelect
                        width="md"
                        name="isVirtual"  
                        label="表单类型"
                        placeholder="请选择链接表单"
                        required={true}
                        options={[
                            {label:"虚拟视图",key:true},{label:"实体表单",key:false}
                        ]}/>    
                    <ProFormTreeSelect
                        width="md"
                        name="tableId"  
                        label="选择表单"
                        placeholder="请选择链接表单"
                        required={true}
                        request={async () => {
                            let tables:TableOut[] = (await getDataList(config.backs.table+"?isVirtual="+form.getFieldValue("isVirtual"))).data
                            return tables.map((value,index,array) => {return {title:value.tableViewName,key:value.tableId}})
                        }}/>    
                    <ProFormTreeSelect
                        width="md"
                        name="显示字段"  
                        label="选择表单"
                        placeholder="请选择字段显示字段"
                        required={true}
                        request={async () => {
                            let tables:ColumnOut[] = (await getDataList(config.backs.column,{isVirtual:form.getFieldValue("isVirtual"),tableNo:form.getFieldValue("tableId"),columnDetailNo:0})).data
                            return tables.map((value,index,array) => {return {title:value.columnDataName,key:value.columnId}})
                        }}/>  
                </ModalForm>
            )
        case columnType.select :
            return (
                <ModalForm
                    title="选择框编辑"
                    trigger={
                        trigger
                    }
                    submitTimeout={2000}
                    autoFocusFirstInput
                    width={300}
                    onFinish={async (values:{items:number})=>{
                        return prop.set(JSON.stringify(values));
                    }}>
                    <ProFormTextArea
                        width="md"
                        name="items"  
                        label="选择项"
                        tooltip="用,分隔"
                        placeholder="输入选择项,用分号分隔"
                        required={true}/>    
                </ModalForm>
            )
        case columnType.file :
            return (
                <ModalForm
                    title="存储目录选择"
                    trigger={
                        trigger
                    }
                    submitTimeout={2000}
                    autoFocusFirstInput
                    width={300}
                    onFinish={async (values:{contentId:number})=>{
                        return prop.set(JSON.stringify(values));
                    }}>
                    <ProFormTreeSelect
                        width="md"
                        name="contentId"  
                        label="上级目录"
                        tooltip="不选择代表处于根目录下"
                        placeholder="请选择上级目录,未选择代表处于根目录下"
                        request={async ()=>{
                            let contents:ContentOut[] = (await getDataList(config.backs.content)).data
                            let treeBase = contents.map((content,index,array) => {return {title:content.contentName,parent:content.leadContent,value:content.dataId}})
                            return getTree(treeBase)
                        }}
                        required={true}/>    
                </ModalForm>
            )
        default :
            return (<></>)
    }
}

const updateColumn = (prop:{column:ColumnOut,groupSelect:DropSelect[],detaildSelect:DropSelect[],actionRef:React.MutableRefObject<ActionType|undefined>}) => {
    const [form] = Form.useForm<ColumnOut>()
    const items = [
        {
          key: '1',
          label: '删除',
          danger: true
        }
      ];
    const deleteMethod: MenuProps['onClick'] = ()=>{
        deleteData(config.backs.column+"/"+prop.column.columnId+"?isVirtual="+prop.column.virtual)
        prop.actionRef.current?.reload();
    }
    return (
        <ModalForm<ColumnOut>
            initialValues={prop.column}
            title="编辑字段"
            trigger={
                <Dropdown.Button 
                type="primary"
                menu={{items,onClick:deleteMethod}}
                >
                编辑
                </Dropdown.Button>
            }
            width={400}
            form={form}
            submitTimeout={2000}
            autoFocusFirstInput
            onFinish={async (values:ColumnOut)=>{
                let success:boolean = await UpdateData(config.backs.column+"/"+prop.column.columnId,values)
                if (success)
                    prop.actionRef.current?.reload();
                return success;
            }}
            modalProps={{
                destroyOnClose: true,
                onCancel: () => console.log('run'),
            }}>
                <ProFormText
                    width="md"
                    name="columnViewName"
                    label="字段显示名称"
                    tooltip="最长为33位"
                    placeholder="请输入字段显示名称"
                    required = {true}/>
                <ProFormText
                    width="md"
                    name="columnDataName"
                    label="字段字段名称"W
                    tooltip="最长为33位"
                    placeholder="请输入字段字段名称"
                    required = {true}
                    readonly = {!prop.column.virtual}/>
                <ProFormSelect
                    width="md"
                    name = "columnType"
                    label = "字段类型"
                    options={columnTypeSelect}
                    required = {true}
                    readonly = {!prop.column.virtual}/>
                <ProFormTextArea
                    width="md"
                    label = "字段类型描述"
                    required = {false}
                    name = "columnTypeDescription"
                    addonAfter = {
                    <ColumnDescription 
                        type={form.getFieldValue(columnType)} 
                        set={(description:string)=>{form.setFieldValue("columnTypeDescription",description);return true}}
                        />
                    }/>
                <ProFormSelect
                    width="md"
                    label = "主表分组"
                    required = {false}
                    name = "columnGroup"
                    readonly
                    options={prop.groupSelect}/>
                <ProFormSelect
                    width="md"
                    label = "明细分组"
                    required = {false}
                    name = "columnDetail"
                    readonly
                    options={prop.detaildSelect}/>
                <ProFormDigit
                    width="md"
                    label = "显示排序"
                    required = {true}
                    name = "columnDetail"
                    fieldProps={{precision:0}}/>

        </ModalForm>
    )
}

const NewGroupOrDetail = (prop:{add:(name:string)=>boolean,type:string}) => {
    const [form] = Form.useForm<{groupName:string}>()
    return (
        <ModalForm<{groupName:string}>
            form={form}
            width={400}
            onFinish={async (values)=>{
                return prop.add(values.groupName)
            }}
            trigger={
                <Button type="primary">
                    <PlusOutlined />
                        {prop.type}
                </Button>
            }
            autoFocusFirstInput
        >
            <ProFormText 
                width="md"
                name="groupName"
                label="组别名称"
                required = {true}
            />
        </ModalForm>
    )
}



const ColumnGroup = (prop:{table:TableOut})=>{

    const toNovel = (names:string[]) => {
        let str = ""
        names.forEach((value,index,array)=>{
            str += ("<p>"+(index+1)+" ")
            str += value
            str += " </p>"
        })
        return str
    }

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [groups,setGroups] = useState(toNovel(prop.table.groupNames))
    const [detailNames,setDetailNames] = useState(toNovel(prop.table.detailNames))
    const showModel = ()=>{
        setIsModalOpen(true);
    }


    const addGroup = (name:string):boolean => {
        let index = prop.table.groupNames.push(name)
        prop.table.groupSelect.push({key:index,label:name,disable:false,children:[]})
        setGroups(toNovel(prop.table.groupNames))
        return true
    }

    const addDetail = (name:string):boolean => {
        let index = prop.table.detailNames.push(name)
        prop.table.detailSelect.push({key:index,label:name,disable:false,children:[]})
        setDetailNames(toNovel(prop.table.detailNames))
        return true
    }

    return (<>
        <Button type="primary" onClick={showModel}>查看字段分组</Button>
        <Modal title="字段分组信息"
            open={isModalOpen}
            footer={()=>(
                <>
                    <NewGroupOrDetail 
                        add = {addGroup}
                        type = "新建主表分组"
                    />
                    <NewGroupOrDetail 
                        add = {addDetail}
                        type = "新建明细分组"
                    />
                </>
            )}
        >
            <Title>主表组别</Title>
            <>{groups}</>    
            <Title>明细组别</Title>
            <>{detailNames}</>      
        </Modal>
    </>)
}

const ColumnList = (prop:{table:TableOut})=>{

}