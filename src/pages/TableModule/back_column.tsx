import { PlusOutlined } from "@ant-design/icons";
import { ActionType, ModalForm, ProColumns, ProFormDependency, ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea, ProFormTreeSelect, ProTable } from "@ant-design/pro-components";
import { Button, Dropdown, Form, MenuProps, Modal } from "antd"
import Title from "antd/lib/typography/Title";
import React, { useRef, useState } from "react";
import config from "../../const/config";
import { ColumnOut, ContentOut, DropSelect, TableOut } from "../../const/out"
import {deleteData, getDataList, newData, UpdateData} from "../../const/http.tsx"
import { columnType, columnTypeSelect } from "../../const/columnType.tsx";
import {getTree} from '../../utils/tree.tsx';
import url from "../../const/url.js";

export type ColumnIn = {
    columnViewName:string,
    columnDataName:string,
    columnType:string,
    columnTypeDescription:string,
    tableNo:number,
    columnGroupNo:number,
    columnViewNo:number,
    columnDetailNo:number,
    columnViewDisplay:boolean,
    virtual:boolean
}

const ColumnDescription = (prop:{type:string,set:(description:string)=>boolean}) => {
    const [form] = Form.useForm<{isVirtual:boolean,tableId:number,columnId:number}>()
    const [virtual,setVirtual] = useState<boolean>(false)
    const trigger = <Button>编辑</Button>
    switch (prop.type) {
        case columnType.browser :
            
            return (
                <ModalForm
                    title="浏览框编辑"
                    trigger={
                        trigger
                    }
                    submitTimeout={2000}
                    initialValues={
                        {
                            isVirtual:false,
                            tableId:undefined,
                            columnId:undefined
                        }
                    }
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
                        request={async () => [
                            {label:"虚拟视图",value:true},{label:"实体表单",value:false}
                        ]}
                        onChange={(value,option)=>{
                            setVirtual(value === 1)
                        }}/>
                        <ProFormTreeSelect
                            width="md"
                            name="tableId"  
                            label="选择表单"
                            placeholder="请选择链接表单"
                            required={true}
                            request={async () => {
                                let tables:TableOut[] = (await getDataList(config.backs.table,{isVirtual:virtual,toBrowser:true})).data
                                return tables.map((value,index,array) => {return {title:value.tableViewName,value:value.tableId}})
                            }}/>

                        <ProFormDependency name={['isVirtual','tableId']}>
                            {(object)=>(
                                <ProFormTreeSelect
                                    width="md"
                                    name="columnId"  
                                    label="选择显示字段"
                                    placeholder="请选择字段显示字段"
                                    required={true}
                                    request={async () => {
                                        let columns:ColumnOut[] = (await getDataList(config.backs.column,{isVirtual:object.isVirtual,tableNo:object.tableId,columnDetailNo:-1,toBrowser:true})).data
                                        let nodes = columns.map((value,index,array) => {return {title:value.columnDataName,label:value.columnDataName,value:value.columnId,key:value.columnId}})
                                        console.log(nodes)
                                        return nodes
                                    }}
                                />  
                            )}
                        </ProFormDependency>   
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
                        console.log(values)
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
            return (<Button>无需编辑</Button>)
    }
}

const UpdateColumn = (prop:{column:ColumnOut,groupSelect:DropSelect[],detaildSelect:DropSelect[],actionRef:React.MutableRefObject<ActionType|undefined>,tableNo:number,virtual:boolean}) => {
    const [form] = Form.useForm<ColumnIn>()
    const [type, setType] = useState<string>(prop.column.columnType)
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
        <ModalForm<ColumnIn>
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
            onFinish={async (values:ColumnIn)=>{
                values.virtual = prop.virtual
                values.tableNo = prop.tableNo
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
                    label="字段数据库名称"
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
                    readonly = {!prop.column.virtual}
                    onChange={(value:string,option) => {
                        setType(option['data-item'].key)
                    }}
                    allowClear = {false}
                    />
                <ProFormText
                    width="md"
                    label = "字段类型描述"
                    required = {false}
                    name = "columnTypeDescription"
                    addonAfter = {
                    <ColumnDescription 
                        type={type} 
                        set={(description:string)=>{form.setFieldValue("columnTypeDescription",description);return true}}
                        />
                    }
                    readonly/>
                <ProFormSelect
                    width="md"
                    label = "主表分组"
                    required = {false}
                    name = "columnGroupNo"
                    options={prop.groupSelect}/>
                <ProFormSelect
                    width="md"
                    label = "明细分组"
                    required = {false}
                    name = "columnDetailNo"
                    readonly
                    options={prop.detaildSelect}/>
                <ProFormDigit
                    width="md"
                    label = "显示排序"
                    placeholder={"不输入自动排到最后"}
                    name = "columnViewNo"
                    fieldProps={{precision:0}}/>
        </ModalForm>
    )
}

const CreateColumn = (prop:{virtual:boolean,groupSelect:DropSelect[],detaildSelect:DropSelect[],actionRef:React.MutableRefObject<ActionType|undefined>,tableNo:number}) => {
    const [form] = Form.useForm<ColumnIn>()
    const [type, setType] = useState<string>("")
    return (
        <ModalForm<ColumnIn>
            title="新建字段"
            trigger={
                <Button 
                type="primary"
                >
                新建
                </Button>
            }
            width={400}
            form={form}
            submitTimeout={2000}
            autoFocusFirstInput
            onFinish={async (values:ColumnIn)=>{
                values.virtual = prop.virtual
                values.tableNo = prop.tableNo
                console.log(values)
                let id:number = await newData(config.backs.column,values)
                if (id>0) {
                    prop.actionRef.current?.reload();
                    return true;
                }
                return false
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
                    label="字段数据库名称"
                    tooltip="最长为33位"
                    placeholder="请输入字段字段名称"
                    required = {true}
                />
                <ProFormSelect
                    width="md"
                    name = "columnType"
                    label = "字段类型"
                    request={async()=>columnTypeSelect}
                    required = {true}
                    allowClear = {false}
                    onChange={(value:string,option) => {
                        console.log(value)
                        console.log(option)
                        // console.log(option)
                        console.log(columnTypeSelect)
                        setType(value)
                    }}
                />
                <ProFormText
                    width="sm"
                    label = "字段类型描述"
                    required = {false}
                    name = "columnTypeDescription"
                    addonAfter = {
                    <ColumnDescription 
                        type={type} 
                        set={(description:string)=>{form.setFieldValue("columnTypeDescription",description);return true}}
                        />
                    }
                    readonly/>
                <ProFormSelect
                    width="md"
                    label = "主表分组"
                    required = {false}
                    name = "columnGroupNo"
                    options={prop.groupSelect}/>
                <ProFormSelect
                    width="md"
                    label = "明细分组"
                    required = {false}
                    name = "columnDetailNo"
                    options={prop.detaildSelect}/>
                <ProFormDigit
                    width="md"
                    label = "显示排序"
                    name = "columnViewNo"
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

const toNovel = (names:string[]) => {
    return  names.map((value,index,array)=>{
        return (<li key={"main"+value} tabIndex={index}>{value}</li>)
    })
}

const ColumnGroup = (prop:{table:TableOut|undefined})=>{

    

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [groups,setGroups] = useState(toNovel(prop.table?.groupNames ?? []))
    const [detailNames,setDetailNames] = useState(toNovel(prop.table?.detailNames ?? []))
    const showModel = ()=>{
        setIsModalOpen(true);
    }


    const addGroup = (name:string):boolean => {
        let index = prop.table?.groupNames.push(name) ?? 0
        prop.table?.groupSelect.push({key:index,label:name,disable:true,children:[]})
        setGroups(toNovel(prop.table?.groupNames??[]))
        return true
    }

    const addDetail = (name:string):boolean => {
        let index = prop.table?.detailNames.push(name)?? 0
        prop.table?.detailSelect.push({key:index,label:name,disable:true,children:[]})
        setDetailNames(toNovel(prop.table?.detailNames??[]))
        return true
    }

    return (<>
        <Button type="primary" onClick={showModel}>查看字段分组</Button>
        <Modal title="字段分组信息"
            open={isModalOpen}
            onCancel={() => {
                setIsModalOpen(false);
            }}
            width={350}
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
            <div style={{display:"flex",justifyContent:"center"}}>
                <ol>
                    <Title level={5}>主表分组</Title>
                    {groups}
                </ol>
                <ol></ol>    
                <ol>
                    <Title level={5}>明细子表</Title>
                    {detailNames}
                </ol>
            </div>    
        </Modal>
    </>)
}

const BackColumn = (prop:{table:TableOut|undefined})=>{
    const actionRef = useRef<ActionType>();
    const columnsList: ProColumns<ColumnOut>[] = [
        {
            key:'id',
            title:'字段编号',
            valueType:'indexBorder',
            dataIndex:'columnId',
            width:'48',
            align:'center',
            hideInSearch:true
        },{
            key:'name',
            title:'字段名称',
            dataIndex:'columnViewName',
        },{
            key:'dataName',
            title:'数据库名称',
            dataIndex:'columnDataName'
        },{
            key:'type',
            title:'字段类型',
            valueType:'select',
            dataIndex:'columnType',
            request: async () =>{
                return columnTypeSelect;
            }
        },{
            key:'order',
            title:'显示顺序',
            valueType:'index',
            dataIndex:'columnViewNo'
        },{
            key:'group',
            title:'主表分组',
            valueType:'select',
            dataIndex:'columnGroupNo',
            request: async () => {
                if (prop.table === undefined)
                    return []
                return prop.table.groupSelect.map((v)=>{v.disable=false; return {value:v.key,label:v.label}})
            }
        },{
            key:'detail',
            title:'明细分组',
            valueType:'select',
            dataIndex:'columnDetailNo',
            request: async () => {
                if (prop.table === undefined)
                    return []
                return prop.table.detailSelect.map((v)=>{v.disable=false; return {value:v.key,label:v.label}})
            }
        },{
            key:'creator',
            title:'创建者',
            dataIndex:'creator',
            width:48*2,
            render:(dom,entity,index,action) => [
              <a href={url.frontUrl.humanResource+entity.creator} key={"href"+entity.creator}>{entity.creatorName}</a>
            ],
            hideInSearch:true
        },{
            key:'createTimeShow',
            title:'创建时间',
            dataIndex:'createTime',
            valueType: "dateTime",
            width:48*4,
            hideInSearch:true,
        },{
            key:'createTime',
            title:'创建时间',
            dataIndex:'createTime',
            valueType:"dateTimeRange",
            hideInTable:true
        },{
            key:'action',
            title:'操作',
            dataIndex:"columnId",
            width:48*3,
            hideInSearch:true,
            render:(dom,entity,index,action)=>{
                if (prop.table === undefined)
                return (<></>)
                return (
                    <UpdateColumn column={entity} groupSelect={prop.table.groupSelect} detaildSelect={prop.table.detailSelect} actionRef={actionRef} tableNo={entity.tableNo} virtual={entity.virtual}/>
                )
            }
        }
    ]

    // if (prop.table === undefined)
    //     columnsList.push({
    //         key:'type',
    //         title:'是否虚拟',
    //         dataIndex:"virtual",
    //         valueType:'select',
    //         request:async () => {
    //             return [
    //                 {label:"是",value:true},
    //                 {label:"否",value:false},
    //             ]
    //         },
    //         hideInTable:true
    //     })

    return (
        <ProTable<ColumnOut> 
            columns={columnsList}
            actionRef={actionRef}
            cardBordered
            request={async (params,
                sort,
                filter
              ) => {
                if (prop.table !== undefined) {
                    params.tableNo = prop.table.tableId
                    params.virtual = prop.table.virtual
                } else {
                    params.virtual = true
                }
                return getDataList(config.backs.column, params)
              }
            }
            editable={{
                type: 'multiple',
              }}
            columnsState={{
            persistenceKey: 'pro-table-singe-demos',
            persistenceType: 'localStorage',
            onChange(value) {
                console.log('value: ', value);
            },
            }}
            rowKey="columnId"
            search={{
            labelWidth: 'auto',
            }}
            options={{
            setting: {
                listsHeight: 400,
            },
            }}
            form={{
            // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
            syncToUrl: (values, type) => {
                if (type === 'get') {
                return {
                    ...values,
                    created_at: [values.startTime, values.endTime],
                };
                }
                return values;
            },
            }}
            pagination={{
            pageSize: 10,
            onChange: (page) => console.log(page),
            }}
            dateFormatter="string"
            headerTitle="字段列表"
            toolBarRender={() => {
                if (prop.table === undefined)
                    return []
                let create = [
                    <CreateColumn 
                        key="create"
                        virtual={prop.table.virtual} 
                        actionRef={actionRef}
                        groupSelect={prop.table.groupSelect}
                        detaildSelect={prop.table.detailSelect}
                        tableNo={prop.table.tableId}
                    />,
                    <ColumnGroup key="group" table={prop.table}/>
                ]
                return create
            }}
        />
    )
}

BackColumn.defaultProps = {
    table:undefined
}

export default BackColumn
