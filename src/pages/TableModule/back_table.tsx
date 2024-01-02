import { FolderOpenTwoTone, PlusOutlined, SnippetsFilled } from '@ant-design/icons';
import { Button, Dropdown, Form, Layout, List, MenuProps, Tabs, Typography } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { Content, Header } from 'antd/es/layout/layout';

import React, { useEffect, useRef, useState } from 'react';
import { deleteData, getDataList, newData } from '../../const/http.tsx';
import { PaginationAlign, PaginationPosition } from 'antd/es/pagination/Pagination';
import { ModuleOut, TableOut } from '../../const/out.tsx';
import { ActionType, ModalForm, ProFormText, ProFormTextArea, ProColumns, ProTable, ProFormSelect, ProFormTreeSelect } from '@ant-design/pro-components';
import url from '../../const/url.js';
import { useLocation } from 'react-router';
import config from '../../const/config.js';

const baseURL = "/api/v1/table/back/table"

const {Title} = Typography;

type TableInSimple = {
  tableViewName:string
  tableDataName:string
  moduleNo:number
  virtual:boolean
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
    deleteData(baseURL+"/"+prop.dataId,{isVirtual:prop.isVirtual})
    if (prop.action.current!==undefined)
      prop.action.current.reload();
  }
  return (
      <Dropdown.Button 
        type="primary"
        menu={{items,onClick:deleteMethod}}
        onClick={()=>{
          window.location.assign(url.backUrl.table+"/"+prop.dataId+"?isVirtual="+Number(prop.isVirtual))
        }}
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
      dataIndex:'remark',
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
      ],
      hideInSearch:true
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
  const query = new URLSearchParams(useLocation().search);
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
        let moduleNo = query.get("moduleNo");
        params.isVirtual = isVirtual
        if (moduleNo!==null)
          params.moduleNo = moduleNo
        return getDataList(baseURL,params)
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
      headerTitle="表单列表"
      toolBarRender={() => [
        <CreateTable key="create" isVirtual={isVirtual} />,
      ]}
    />
  )
}



const CreateTable = (prop:{isVirtual:boolean}) => {
  const [form] = Form.useForm<TableInSimple>();
  const query = new URLSearchParams(useLocation().search);
  let moduleNo = query.get("moduleNo");
  let title:string;
  let jump:boolean;
  if (prop.isVirtual)
    title = "虚拟视图"
  else
    title = "实体表单"
  // console.log(moduleNo);
  if (moduleNo == "")
    moduleNo =null;
  // console.log(valueEnumModule);
  return (
    <ModalForm<TableInSimple>
      title={title}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          {title}
        </Button>
      }
      width={400}
      form={form}
      submitTimeout={2000}
      autoFocusFirstInput
      submitter={{
        searchConfig: {
          submitText: '新建',
          resetText: '取消',
        },
        render:(prop,defaultDoms)=>{
          return [
            ...defaultDoms,
            <Button
              key="jump"
              type='primary'
              onClick={()=>{
                jump = true
                prop.submit()
              }}>新建并跳转</Button>
          ]
        }
      }}
      onFinish={async (values:TableInSimple)=>{
        console.log(values)
        let dataId:number =await newData(baseURL,values)
        if (dataId!= -1){
          if (jump)
            window.location.assign(url.backUrl.table+"/"+dataId+"?isVirtual="+Number(values.virtual));
          return true
        }
          return false
      }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}>
        <ProFormText
          width="md"
          name="tableViewName"
          label="表单名称"
          tooltip="最长为33位"
          placeholder="请输入表单显示名称"
          required = {true}/>
        <ProFormText
          width="md"
          name="tableDataName"
          label="数据库表名"
          tooltip="最长为33位"
          placeholder="请输入数据库表名"
          required = {!prop.isVirtual}
          hidden = {!prop.isVirtual}/>
        <ProFormTreeSelect 
          width="md"
          name="moduleNo"
          label="所属模块"
          tooltip=""
          required = {true}
          request={async () => {
            let moduleList:ModuleOut[] = (await getDataList(config.backs.module,{toBrowser:true})).data
            const valueEnumModule:{title:string,value:number,children:any[]}[] = moduleList.map(
              (item) => {
                return {title:item.moduleTypeName,value:item.moduleTypeId,children:[]};
              })
            return valueEnumModule  
          }}
          initialValue={moduleNo}/>  
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
          initialValue={prop.isVirtual}/>
      </ModalForm>
  )
}




const BackTable = () => {
  const [position, setPosition] = useState<PaginationPosition>('top');
  const [align, setAlign] = useState<PaginationAlign>('center');
  const [moduleList,setModuleList] = useState<ModuleOut[]>([])
  useEffect(()=>{
    if (moduleList.length==0)
      (getDataList("/api/v1/table/back/module",{toBrowser:true})).then((value)=>{
        setModuleList(value.data)
      })
  })
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