﻿import { FolderOpenTwoTone, PlusOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns, ProFormText, ProFormTextArea, ProFormTreeSelect, ProTable } from '@ant-design/pro-components';
import { Button, Dropdown, Form, Layout, MenuProps, Typography } from 'antd';
import React, { useRef } from 'react';
import url from '../../const/url.js';
import { UpdateData, deleteData, getDataList, newData } from '../../const/http.tsx';
import { Content, Header } from 'antd/es/layout/layout';
import { CharacterOut, DepartOut, HumanOut, ModuleOut } from '../../const/out.tsx';
import config from '../../const/config.js';

const { Title } = Typography

type HumanIn = {
    loginName: string
    password: string
    name: string
    sex: number
    birth: string
    age: number
    telephone: string
    mail: string
    phone: string
    fax: string
    workCode: string
    depart: number
    job: string
    directorLeader: number
    supporter: number
    photo: number
    signature: string
    lastLogin: Date
    safety: number
}




const HumanList = (prop:{depart:number,section:number}) => {
    const actionRef = useRef<ActionType>();

    const columns: ProColumns<HumanOut>[] = [
        {
            key: 'code',
            title: '编号',
            dataIndex: 'dataId',
            valueType: "indexBorder",
            width: 48,
            align: "center"

        },
        {
            key: 'name',
            title: '人员姓名',
            dataIndex: 'name',
        },
        {
            key: 'sex',
            title: '人员性别',
            dataIndex: 'sex',
            ellipsis: true,
            valueType:'select',
            tip: "不显示代表未录入",
            request:async ()=>{
                return [
                    {
                        label:"男",
                        value:0,
                    },{
                        label:"女",
                        value:1,
                    },
                ]
            }
        },
        {
            key: 'telephone',
            title: '联系电话',
            dataIndex: 'telephone',
        },
        {
            key: 'workCode',
            title: '工号',
            dataIndex: 'workCode',
        },
        {
            key: 'depart',
            title: '所属部门',
            dataIndex: 'depart',
            valueType: "select",
            request: async ()=>{
                let departs:DepartOut[] = (await getDataList(config.fronts.depart,{toBrowser:true,isDeperacted:0})).data
                return departs.map((depart,index,array)=>{return {label:depart.departName,value:depart.dataId}})
            }
        },{
            key:'isDeprecated',
            dataIndex:'isDeprecated',
            valueType:'select',
            request:async ()=>{
                return [
                    {
                        label:'在职',
                        value:0
                    },{
                        label:'离职',
                        value:1
                    },
                ]
            }
        }
    ];

    return (
        <ProTable<HumanOut>
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
                    params.depart = prop.depart
                if (prop.section !== 0)
                    params.section = prop.section
                return getDataList(config.fronts.human, params)
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
            headerTitle="人员列表"
        />
    );
};

const FrontHuman = (prop:{depart:number,section:number}) => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px", }}>
                <div style={{ display: 'flex' }}>
                    <FolderOpenTwoTone style={{ fontSize: "36px", marginTop: "15px", marginLeft: "5px" }} />
                    <Title level={2} style={{ color: 'GrayText', marginLeft: '10px', marginBottom: '15px' }}>人员列表</Title>
                </div>
            </Header>
            <Content style={{ padding: '15px 50px', minHeight: '100%' }}>
                <HumanList depart={prop.depart} section={prop.section}/>
            </Content>

        </Layout>



    )
}

FrontHuman.defaultProps = {
    depart:0,
    section:0
}

export default FrontHuman;