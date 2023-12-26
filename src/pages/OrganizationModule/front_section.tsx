import { FolderOpenTwoTone } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Layout, Typography } from 'antd';
import React, { useRef } from 'react';
import url from '../../const/url.js';
import { getDataList } from '../../const/http.tsx';
import { Content, Header } from 'antd/es/layout/layout';
import { HumanOut, SectionOut } from '../../const/out.tsx';
import config from '../../const/config.js';

const { Title } = Typography

const SectionList = (prop: { section: number }) => {
    const actionRef = useRef<ActionType>();
    const columns: ProColumns<SectionOut>[] = [
        {
            key: 'code',
            title: '编号',
            dataIndex: 'dataId',
            valueType: "indexBorder",
            width: 48,
            align: "center"

        },
        {
            key: 'sectionCode',
            title: '部门编号',
            dataIndex: 'sectionCode',
        },
        {
            key: 'sectionName',
            title: '分部名称',
            dataIndex: 'sectionName',
            ellipsis: true,
        }, {
            key:'sectionManagerSearch',
            hideInTable:true,
            dataIndex:'sectionManager',
            valueType:'select',
            request:async ()=>{
                let humans:HumanOut[] = (await getDataList(config.fronts.human,{toBrowser:true})).data
                return humans.map((human,index,array)=>{return {label:human.name, value:human.dataId}})
            }
        }, {
            key: 'sectionManager',
            title: '部门负责人',
            dataIndex: 'managerName',
            render: (dom, entity, index, action, schema) => {
                return (<a href={url.frontUrl.humanResource + entity.sectionManager}>{entity.managerName}</a>)
            },
            search: false
        },{
            key:'belongSectionSearch',
            hideInTable:true,
            dataIndex:'belongSection',
            valueType:'select',
            request:async ()=>{
                let sections:SectionOut[] = (await getDataList(config.fronts.section,{toBrowser:true})).data
                return sections.map((section,index,array)=>{return {label:section.sectionName, value:section.dataId}})
            }
        }, {
            key: 'belongSection',
            title: '所属分部',
            dataIndex: 'belongSectionName',
            render: (dom, entity, index, action, schema) => {
                return (<a href={url.frontUrl.section_concrete + entity.belongSection}>{entity.belongSectionName}</a>)
            },
            hideInSearch:true
        }, {
            key: 'action',
            title: '操作',
            dataIndex: "moduleTypeId",
            hideInSearch: true,
            render: (dom, entity, index, action) =>
                <Button href={url.frontUrl.section_concrete + entity.dataId}>查看</Button>
        },
    ];

    return (
        <ProTable<SectionOut>
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

                if (prop.section !== 0)
                    params.belongSection = prop.section
                params.isDeprecated = 0
                return getDataList(config.fronts.section, params)
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
            rowKey="dataId"
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
            headerTitle="分部列表"
        />
    );
};

const FrontSection = (prop: { section: number }) => {
    let header = (
        <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px", }}>
            <div style={{ display: 'flex' }}>
                <FolderOpenTwoTone style={{ fontSize: "36px", marginTop: "15px", marginLeft: "5px" }} />
                <Title level={2} style={{ color: 'GrayText', marginLeft: '10px', marginBottom: '15px' }}>分部列表</Title>
            </div>
        </Header>
    )
    if (prop.section !== 0)
        header = <></>
    return (
        <Layout style={{ minHeight: '100vh' }}>
            {header}
            <Content style={{ padding: '15px 50px', minHeight: '100%' }}>
                <SectionList section={prop.section} />
            </Content>

        </Layout>



    )
}

FrontSection.defaultProps = {
    section: 0
}

export default FrontSection;