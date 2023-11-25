import { PageContainer, ProCard, ProForm, ProFormDatePicker, ProFormSelect, ProFormText, ProFormTextArea, ProFormTreeSelect } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { ModuleOut, TableOut } from '../../const/out';
import { UpdateData, deleteData, getDataList, getDataOne } from '../../const/http';
import config from '../../const/config';
import { json, useParams } from 'react-router-dom';
import { Button, Spin, Table } from 'antd';
import url from '../../const/url';

type TableIn = {
     tableViewName:string
     tableDataName:string
     moduleNo:number
     groupName:string[]
     remark:string
     workFlowNo:string
     detailName:string[]
     defaultEdit:string
     defaultCreate:string
     defaultDelete:string
     defaultShare:string
     virtual:boolean
}

const getTableIn = (data:TableOut): TableIn =>{
    return {
        tableViewName:data.tableViewName,
        tableDataName:data.tableDataName,
        moduleNo:data.moduleNo,
        groupName:data.groupNames,
        remark:data.remark,
        workFlowNo:data.workFlowNo,
        detailName:data.detailNames,
        defaultEdit:data.defaultEdit,
        defaultCreate:data.defaultCreate,
        defaultDelete:data.defaultDelete,
        defaultShare:data.defaultShare,
        virtual:data.virtual
    };
}


const tableUrl = config.backs.table;



const BackTableConcrete = () => {
    
    const [table, setTable] = useState<TableOut>();
    const tableId = useParams().tableId
    useEffect(()=>{
        getDataOne(tableUrl + "/" + tableId).then((values)=>{
            if (values.success) {
                setTable(values.data);
            }
        })
    })
    if (table === undefined || table === null)
        return (
            <div
                style={{
                background: '#F5F7FA',
                }} >
                    <Spin size='large'></Spin>
            </div>)
    const updateTable = () => {
        UpdateData(tableUrl+"/"+tableId,getTableIn(table));
    }
    const deleteTable = () => {
        deleteData(tableUrl+"/"+ tableId);
    }

    const TableBase = ()=>{
        return (
            <ProForm 
                initialValues={table}
                onValuesChange={(changedValues,values)=>{
                    changedValues.forEach((element:string) => {
                        table[element] = values[element]
                    });
                    setTable(table)
                }}
            >
                <ProFormText
                    width="md"
                    name="tableViewName"
                    label="表单名称"
                    tooltip="最长为33位"
                    placeholder="请输入表单显示名称"
                    required = {true}
                    onMetaChange={}/>
                <ProFormText
                    width="md"
                    name="tableDataName"
                    label="数据库表名"
                    tooltip="最长为33位"
                    placeholder="请输入数据库表名"
                    readonly = {table.virtual}/>
                <ProFormTreeSelect 
                    width="md"
                    name="moduleNo"
                    label="所属模块"
                    tooltip=""
                    required = {true}
                    fieldProps={{
                        suffixIcon: null,
                        filterTreeNode: true,
                        showSearch: true,
                        popupMatchSelectWidth: false,
                        labelInValue: true,
                        autoClearSearchValue: true,
                        multiple: false,
                        treeNodeFilterProp: 'title',
                        fieldNames: {
                        label: 'title',
                        },
                    }}
                    request={async () => {
                        return (await getDataList(config.backs.module)).data.map(
                            (item:ModuleOut) => {
                              return {title:item.moduleTypeName,value:item.moduleTypeId,children:[]};
                            }
                        )
                    }}/>  
                <ProFormTextArea
                    width="md"
                    name="remark"  
                    label="表单备注"
                    tooltip="最长333位"
                    placeholder="请输入表单备注"
                    required={false}/>
                <ProFormSelect
                    readonly = {true}
                    width="md"
                    name="virtual"  
                    label="虚拟视图"
                    tooltip="最长333位"
                    required={true}
                    options={[{label:'是',value:true},{label:'否',value:false}]}
                    />
                <ProFormDatePicker
                    readonly = {true}
                    name="createTime"
                    label="创建时间"
                    width="md"/>
                <ProFormText
                    readonly
                    name="createName"
                    addonAfter={<Button onClick={()=>{window.open(url.frontUrl.humanResource+table.creator)}}>查看</Button>}
                />
            </ProForm>
        )
    }
    const columnList = () =>{
        return (
            <iframe src={url.backUrl.column+"&tableId="+tableId}></iframe>
        )
    }

    const AuthorityEdit = ()=>{
        return (
            
        )
    }
    return (
    <div
        style={{
        background: '#F5F7FA',
        }}
    >
        <PageContainer
            fixedHeader
            header={{
                title: '页面标题',
                breadcrumb: {
                items: [
                    {
                    path: '',
                    title: table.moduleName,
                    },
                    {
                    path: '',
                    title: table.tableViewName,
                    },
                ],
                },
                extra:[
                <Button key='1' type='primary' onClick={updateTable}>保存</Button>,
                <Button key='2' type='default' danger onClick={deleteTable}>删除</Button>
                ]
            }}
            
            tabList={[
                {
                tab: '基本信息',
                key: '1',
                children:(<TableBase/>)
                },
                {
                tab: '字段信息',
                key: '2',
                },
                {
                tab: '权限信息',
                key: '3',
                disabled: table.virtual
                },
            ]}
            >
            <ProCard direction="column" ghost gutter={[0, 16]}>
                <ProCard style={{ height: 200 }} />
                <ProCard gutter={16} ghost>
                <ProCard colSpan={16} style={{ height: 200 }} />
                <ProCard colSpan={8} style={{ height: 200 }} />
                </ProCard>
                <ProCard gutter={16} ghost>
                <ProCard colSpan={8} style={{ height: 200 }} />
                <ProCard colSpan={16} style={{ height: 200 }} />
                </ProCard>
            </ProCard>
        </PageContainer>
    </div>)
};

export default BackTableConcrete