import { FolderOpenTwoTone } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Layout, Typography } from 'antd';
import React, { useEffect, useRef } from 'react';
import url from '../../const/url.js';
import { getDataList } from '../../const/http.tsx';
import { Content, Header } from 'antd/es/layout/layout';
import { DepartOut, HumanOut, SectionOut } from '../../const/out.tsx';
import config from '../../const/config.js';

const { Title } = Typography






const DepartList = (prop: { depart: number, section: number }) => {
    const actionRef = useRef<ActionType>();

    const columns: ProColumns<DepartOut>[] = [
        {
            key: 'code',
            title: '编号',
            dataIndex: 'dataId',
            valueType: "indexBorder",
            width: 48,
            align: "center"

        },
        {
            key: 'departCode',
            title: '部门编号',
            dataIndex: 'departCode',
        },
        {
            key: 'departName',
            title: '部门名称',
            dataIndex: 'departName',
            ellipsis: true,
        }, {
            key:'departManager',
            hideInTable:true,
            dataIndex:'departManager',
            valueType:'select',
            request:async ()=>{
                let humans:HumanOut[] = (await getDataList(config.fronts.human,{toBrowser:true})).data
                return humans.map((human,index,array)=>{return {label:human.name, value:human.dataId}})
            }
        }, {
            key: 'managerName',
            title: '部门负责人',
            dataIndex: 'managerName',
            render: (dom, entity, index, action, schema) => {
                return (<a href={url.frontUrl.humanResource + entity.departManager}>{entity.managerName}</a>)
            },
            search: false
        },{
            key:'belongSection',
            hideInTable:true,
            dataIndex:'belongSection',
            valueType:'select',
            request:async ()=>{
                let sections:SectionOut[] = (await getDataList(config.fronts.section,{toBrowser:true})).data
                return sections.map((section,index,array)=>{return {label:section.sectionName, value:section.dataId}})
            }
        }, {
            key: 'belongSectionName',
            title: '所属分部',
            dataIndex: 'belongSectionName',
            render: (dom, entity, index, action, schema) => {
                return (<a href={url.frontUrl.section_concrete + entity.belongSection}>{entity.belongSectionName}</a>)
            },
            hideInSearch:true
        },{
            key:'belongDepart',
            hideInTable:true,
            dataIndex:'belongDepart',
            valueType:'select',
            request:async ()=>{
                let departs:DepartOut[] = (await getDataList(config.fronts.depart,{toBrowser:true})).data
                return departs.map((depart,index,array)=>{return {label:depart.departName, value:depart.dataId}})
            }
        },
        {
            key: 'belongDepartName',
            title: '上级部门',
            dataIndex: 'belongDepartName',
            valueType: "select",
            hideInSearch:true,
            render: (dom, entity, index, action, schema)=>{
                return (<a href={url.frontUrl.depart_concrete+entity.managerName}>{entity.belongDepartName}</a>)
            },
        },
        {
            key: 'isDeprecated',
            dataIndex: 'isDeprecated',
            title: '封存情况',
            valueType: 'select',
            request: async () => {
                return [
                    {
                        label: '正常',
                        value: 0
                    }, {
                        label: '封存',
                        value: 1
                    },
                ]
            }
        }, {
            key: 'action',
            title: '操作',
            dataIndex: "moduleTypeId",
            hideInSearch: true,
            render: (dom, entity, index, action) =>
                <Button onClick={() => { window.open(url.frontUrl.depart_concrete + entity.dataId) }}>编辑</Button>
        },
    ];

    return (
        <ProTable<DepartOut>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (
                // 第一个参数 params 查询表单和 params 参数的结合
                // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
                params,
                sort,
                filter,
            ) => {
                // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
                // 如果需要转化参数可以在这里进行修改
                // console.log(params)
                // console.log(sort);
                // console.log(filter);
                if (prop.depart !== 0)
                    params.belongDepart = prop.depart
                if (prop.section !== 0)
                    params.belongSection = prop.section
                params.isDeprecated = 0
                return getDataList(config.fronts.depart, params)
            }}
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
            rowKey="id"
            search={{
                labelWidth: 'auto',
            }}
            options={{
                setting: {
                    listsHeight: 400,
                },
            }}
            
            pagination={{
                pageSize: 10,
                onChange: (page) => console.log(page),
            }}
            dateFormatter="string"
            headerTitle="部门列表"

        />
    );
};

const FrontDepart = (prop: { depart: number, section: number }) => {
    useEffect(() => {
        if (prop.depart + prop.section === 0)
        document.title = '部门列表' 
    },[prop])
    let header = (
        <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px", }}>
            <div style={{ display: 'flex' }}>
                <FolderOpenTwoTone style={{ fontSize: "36px", marginTop: "15px", marginLeft: "5px" }} />
                <Title level={2} style={{ color: 'GrayText', marginLeft: '10px', marginBottom: '15px' }}>部门列表</Title>
            </div>
        </Header>
    )
    if (prop.depart !== 0 || prop.section !== 0)
        header = <></>
    return (
        <Layout style={{ minHeight: '100vh' }}>
            {header}
            <Content style={{ padding: '15px 50px', minHeight: '100%' }}>
                <DepartList depart={prop.depart} section={prop.section} />
            </Content>

        </Layout>



    )
}

FrontDepart.defaultProps = {
    depart: 0,
    section: 0
}

export default FrontDepart;