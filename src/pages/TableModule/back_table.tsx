import { FolderOpenTwoTone, PlusOutlined, SnippetsFilled } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Form, Layout, List, MenuProps, Tabs, Typography } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { Content, Header } from 'antd/es/layout/layout';

import React, { useRef, useState } from 'react';
import { UpdateData, deleteData, getDataList } from '../../const/http.tsx';
import { PaginationAlign, PaginationPosition } from 'antd/es/pagination/Pagination';
import { ModuleOut, TableOut } from '../../const/out.tsx';
import { ActionType, ModalForm, ProFormText, ProFormTextArea, ProColumns, ProTable } from '@ant-design/pro-components';
import url from '../../const/url.js';

type TableInSimple = {

}



const UpdateTable = (prop:{dataId:number,action:React.MutableRefObject<ActionType|undefined>,isVirtual:boolean}) => {
  const items = [
    {
      key: '1',
      label: '删除',
      danger: true
    }
  ];
  const deleteMethod: MenuProps['onClick'] = ()=>{
    deleteData("/api/v1/table/back/module"+"/"+prop.dataId)
    if (prop.action.current!==undefined)
      prop.action.current.reload();
  }
  return (
      <Dropdown.Button 
        type="primary"
        menu={{items,onClick:deleteMethod}}
      >
        编辑
      </Dropdown.Button>
  )
}



const TableList = (prop:{isvirtual:boolean}) => {
  const isVirtual = prop.isvirtual;
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableOut>[] = [
    {
      key:'code',
      title:'编号',
      dataIndex:'tableId',
      valueType:"indexBorder",
      width:48,
      align: "center"
      
    },
    {
      key:'name',
      title:'表单名称',
      dataIndex:'tableViewName',
    },
    {
      key:'remark',
      title:'表单备注',
      dataIndex:'workflowRemark',
      ellipsis: true,
      tip:"备注过长会自动收缩,鼠标放上去查看",
      hideInSearch: true,
    },
    {
      key:'creator',
      title:'创建者',
      dataIndex:'creatorId',
      width:48*2,
      render:(dom,entity,index,action) => [
        <a href={url.frontUrl.humanResource+entity.creator} key={"href"+entity.creator}>{entity.createName}</a>
      ]
    },
    {
      key:'createTimeShow',
      title:'创建时间',
      dataIndex:'createTime',
      valueType: "dateTime",
      width:48*4,
      hideInSearch:true
    },
    {
      key:'createTime',
      title:'创建时间',
      dataIndex:'createTime',
      valueType:"dateTimeRange",
      hideInTable:true
    },
    {
      key:'action',
      title:'操作',
      dataIndex:"moduleTypeId",
      width:48*3,
      hideInSearch:true,
      render:(dom,entity,index,action)=>
        <UpdateTable 
          dataId ={entity.tableId} 
          action={actionRef}
          isVirtual = {isVirtual}
        />
    }
  ]
  return (
    <ProTable<TableOut>
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
        let paramsNew = {params,isVirtual:isVirtual}
        return getDataList("/api/v1/table/back/table",paramsNew)
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
      headerTitle="应用列表"
      toolBarRender={() => [
        <CreateTable key="create"/>,
      ]}
    />
  )
}



const CreateTable = () => {
  const [form] = Form.useForm<TableInSimple>();
  return (
    <ModalForm<TableInSimple>
      title="新建表单"
      trigger={
        <Button type="primary">
          <PlusOutlined />
          新建应用
        </Button>
      }
      width={400}
      form={form}
      submitTimeout={2000}
      autoFocusFirstInput
      onFinish={async (values:TableInSimple)=>{
      }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}>
        <ProFormText
          width="md"
          name="moduleTypeName"
          label="应用名称"
          tooltip="最长为33位"
          placeholder="请输入应用名称"
          required = {true}/>
        <ProFormTextArea
          width="md"
          name="workflowRemark"  
          label="应用备注"
          tooltip="最长333位"
          placeholder="请输入应用备注"
          required={false}/>
      </ModalForm>
  )
}

const moduleList:ModuleOut[] =( await getDataList("/api/v1/table/back/module")).data
const {Title} = Typography;
const BackTable = () => {
  const [position, setPosition] = useState<PaginationPosition>('top');
  const [align, setAlign] = useState<PaginationAlign>('center');
  const tabs = [
    {
      key:"Entity",
      label: (<span>实体表单</span>),
      children: (<TableList isvirtual = {false} />)
    },{
      key:"Virtual",
      label: (<span>虚拟视图</span>),
      children: (<TableList isvirtual = {true} />)
    }
  ]
  return (
    <Layout style={{ minHeight: '98.5vh'}}>
      <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px",}}>
        <SnippetsFilled  style={{fontSize:"36px",marginTop:"30px",marginLeft:"5px",marginBottom:'30px'}} />
        <Title level = {2} style={{color:'GrayText', marginLeft:'10px',marginBottom:'30px'}}>表单列表</Title>
      </Header>
      <Layout hasSider>
        <Sider style={{ padding: '10px 10px',backgroundColor:"#f7f7f7"}}>
        <List 
          style={{ minHeight: '100%'}}
          pagination={{position,align}}
          bordered = {true}
          itemLayout="horizontal"
          dataSource={moduleList}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<FolderOpenTwoTone/>}
                title={<a href={window.location.pathname+"?moduleNo="+item.moduleTypeId}>{item.moduleTypeName}</a>}
              />
            </List.Item>
          )}
        />
        </Sider>
        <Content style={{ padding: '15px 50px'}}>
            <Tabs
              defaultActiveKey='Entity'
              items={tabs}
            />
        </Content>
      </Layout>
    </Layout>
  );
};
export default BackTable;