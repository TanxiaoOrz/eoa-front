import { PageContainer, ProForm, ProFormDatePicker, ProFormSelect, ProFormText, ProFormTextArea, ProFormTreeSelect } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { ModuleOut, TableOut } from '../../const/out';
import { UpdateData, deleteData, getDataList, getDataOne } from '../../const/http.tsx';
import config from '../../const/config';
import { useParams } from 'react-router-dom';
import { Button, Spin, Tabs, message } from 'antd';
import url from '../../const/url.js';
import { AuthorityEdit } from '../../componet/AuthorityEdit.tsx';
import BackColumn from './back_column.tsx';


type TableIn = {
    tableViewName: string
    tableDataName: string
    moduleNo: number
    groupName: string[]
    remark: string
    workFlowNo: string
    detailName: string[]
    defaultEdit: string
    defaultCreate: string
    defaultDelete: string
    defaultShare: string
    virtual: boolean
}

const getTableIn = (data: TableOut): TableIn => {
    return {
        tableViewName: data.tableViewName,
        tableDataName: data.tableDataName,
        moduleNo: data.moduleNo,
        groupName: data.groupNames,
        remark: data.remark,
        workFlowNo: data.workFlowNo,
        detailName: data.detailNames,
        defaultEdit: data.defaultEdit,
        defaultCreate: data.defaultCreate,
        defaultDelete: data.defaultDelete,
        defaultShare: data.defaultShare,
        virtual: data.virtual
    };
}


const tableUrl = config.backs.table;



const BackTableConcrete = () => {


    const tableId = useParams().tableId

    const [table, setTable] = useState<TableOut>();
    let virtualStr = new URLSearchParams(window.location.search.substring(1)).get("isVirtual")
    if (virtualStr === null)
        virtualStr = "0"
    const isVirtual = Boolean(parseInt(virtualStr));
    
    useEffect(()=>{
        document.title = "表单详情-" + table?.tableViewName
    }, [table?.tableViewName])
    useEffect(() => {
        if (table === undefined)
            getDataOne(tableUrl + "/" + tableId + "?isVirtual=" + isVirtual).then((values) => {
                if (values.success) {
                    setTable(values.data);
                }
            })
        console.log(table)
        if (table === null)
            message.error("该表单不存在")
    })
    if (tableId === undefined) {
        window.location.replace(url.backUrl.table)
        return (<div></div>)
    }
    if (table === undefined || table === null)
        return (
            <div
                style={{
                    background: '#F5F7FA',
                    display: "flex",
                    height: "98vh"
                }} >
                <Spin size='large' style={{ margin: "auto" }}></Spin>
            </div>)
    const updateTable = async () => {
        if (await UpdateData(tableUrl + "/" + tableId, getTableIn(table))){
            setTimeout(()=>window.location.reload(),1000)
            
        }
    }
    const deleteTable = async () => {
        if (await deleteData(tableUrl + "/" + tableId + "?isVirtual=" + isVirtual)) 
        setTimeout(()=>window.close(),1000)
    }

    const TableBase = () => {
        return (
            <div style={{ height: "85vh", display: "flex", background: "#fdfdfd", paddingTop: "30px" }}>
                <ProForm
                    style={{
                        margin: "0 auto"
                    }}
                    submitter={{
                        searchConfig: {
                            resetText: "重置",
                            submitText: "保存"
                        }
                    }}
                    layout="horizontal"
                    initialValues={table}
                    onValuesChange={(changedValues, values) => {
                        console.log(changedValues)
                        Object.entries(changedValues).forEach((value, index, array) => {
                            table[value[0]] = value[1]
                        })
                        console.log(table)
                        // setTable(table)
                    }}
                    onFinish={updateTable}
                >
                    <ProFormText
                        width="md"
                        name="tableViewName"
                        label="表单名称"
                        tooltip="最长为33位"
                        placeholder="请输入表单显示名称"
                        required={true}
                    />
                    <ProFormText
                        width="md"
                        name="tableDataName"
                        label="数据库表名"
                        tooltip="最长为33位"
                        placeholder="请输入数据库表名"
                        readonly={!table.virtual} />
                    <ProFormTreeSelect
                        width="md"
                        name="moduleNo"
                        label="所属模块"
                        tooltip=""
                        required={true}
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
                            return (await getDataList(config.backs.module, { toBrowser: true })).data.map(
                                (item: ModuleOut) => {
                                    return { title: item.moduleTypeName, value: item.moduleTypeId, children: [] };
                                }
                            )
                        }} />
                    <ProFormTextArea
                        width="md"
                        name="remark"
                        label="表单备注"
                        tooltip="最长333位"
                        placeholder="请输入表单备注"
                        required={false} />
                    <ProFormSelect
                        readonly={true}
                        width="md"
                        name="virtual"
                        label="虚拟视图"
                        tooltip="最长333位"
                        required={true}
                        options={[{ label: '是', value: true }, { label: '否', value: false }]}
                    />
                    <ProFormDatePicker
                        readonly={true}
                        name="createTime"
                        label="创建时间"
                        width="md" />
                    <ProFormText
                        readonly
                        label="创建人"
                        name="createName"
                        addonAfter={<Button onClick={() => { window.open(url.frontUrl.humanResource + table.creator) }}>查看</Button>}
                    />
                </ProForm>
            </div>)
    }
    const ColumnList = () => {
        return (
            <div
                style={{
                    background: '#F5F7FA',
                }}
            >
                <BackColumn table={table} />
            </div>

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
                    title: table.tableViewName,
                    breadcrumb: {
                        items: [
                            {
                                title: table.moduleName,
                            },
                            {
                                title: table.tableViewName,
                            },
                        ],
                    },
                    extra: [
                        <Button key='1' type='primary' onClick={updateTable}>保存</Button>,
                        <Button key='2' type='default' danger onClick={deleteTable}>删除</Button>
                    ]
                }}

                tabList={[
                    {
                        tab: '基本信息',
                        key: '1',
                        children: (<TableBase />)
                    },
                    {
                        tab: '字段信息',
                        key: '2',
                        children: (<ColumnList />)
                    },
                    {
                        tab: '权限信息',
                        key: '3',
                        disabled: table.virtual,
                        children: (<div style={{ height: "80vh" }}>
                            <Tabs
                                style={{ background: "#fdfdfd" }}
                                tabBarStyle={{ borderBlockColor: "#f7f7f7", border: "3sp" }}
                                // tabBarGutter={3}
                                tabPosition='left'

                                items={[
                                    {
                                        key: "create",
                                        label: (<span style={{ writingMode: "vertical-lr" }}>创建权限</span>),
                                        children: (<AuthorityEdit entity={table} tableId={parseInt(tableId)} isVirtual={isVirtual} authorityName='defaultCreate' />)
                                    },
                                    {
                                        key: "share",
                                        label: (<span style={{ writingMode: "vertical-lr" }}>共享权限</span>),
                                        children: (<AuthorityEdit entity={table} tableId={parseInt(tableId)} isVirtual={isVirtual} authorityName='defaultShare' />)
                                    },
                                    {
                                        key: "edit",
                                        label: (<span style={{ writingMode: "vertical-lr" }}>编辑权限</span>),
                                        children: (<AuthorityEdit entity={table} tableId={parseInt(tableId)} isVirtual={isVirtual} authorityName='defaultEdit' />)
                                    }, {
                                        key: "delete",
                                        label: (<span style={{ writingMode: "vertical-lr" }}>删除权限</span>),
                                        children: (<AuthorityEdit entity={table} tableId={parseInt(tableId)} isVirtual={isVirtual} authorityName='defaultDelete' />)
                                    }
                                ]}
                            ></Tabs>

                        </div>)
                    },
                ]}
            >
            </PageContainer>
        </div>)
};

export default BackTableConcrete