import { FolderOpenTwoTone, PlusOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns, ProFormText, ProFormTextArea, ProTable } from '@ant-design/pro-components';
import { Button, Dropdown, Form, Layout, MenuProps , Typography } from 'antd';
import React, { useRef } from 'react';
import url from '../../const/url.js';
import { UpdateData, deleteData, getDataList, newData } from '../../const/http.tsx';
import { Content, Header } from 'antd/es/layout/layout';
import { CharacterOut, ModuleOut } from '../../const/out.tsx';
import config from '../../const/config.js';

const {Title} = Typography

type CharacterIn = {
    characterName:string
    characterDescription:string
}

const CreateCharacter = (prop:{action:React.MutableRefObject<ActionType|undefined>}) => {
  const [form] = Form.useForm<CharacterIn>();
  return (
    <ModalForm<CharacterIn>
      title="新建角色"
      trigger={
        <Button type="primary">
          <PlusOutlined />
          新建角色
        </Button>
      }
      width={400}
      form={form}
      submitTimeout={2000}
      autoFocusFirstInput
      onFinish={async (values:CharacterIn)=>{
        let dataId = await newData(config.backs.character,values)
        if (dataId!=-1) {
          if (prop.action.current!==undefined)
            prop.action.current.reload();
        }
        return dataId != -1
      }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}>
        <ProFormText
          width="md"
          name="characterName"
          label="角色名称"
          tooltip="最长为33位"
          placeholder="请输入角色名称"
          required = {true}/>
        <ProFormTextArea
          width="md"
          name="characterDescription"  
          label="角色描述"
          tooltip="最长333位"
          placeholder="请输入角色描述"
          required={false}/>
      </ModalForm>

  )
}


const CharacterList = () => {
  const actionRef = useRef<ActionType>();
  
  const columns: ProColumns<CharacterOut>[] = [
    {
      key:'code',
      title:'编号',
      dataIndex:'dataId',
      valueType:"indexBorder",
      width:48,
      align: "center"
      
    },
    {
      key:'name',
      title:'角色名称',
      dataIndex:'characterName',
    },
    {
      key:'remark',
      title:'角色描述',
      dataIndex:'characterDescription',
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
        <Button href={url.backUrl.character_concrete+entity.dataId}>编辑</Button>
    }
  ];
  
  return (
    <ProTable<CharacterOut>
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
        return getDataList(config.backs.character,params)
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
        <CreateCharacter key="create" action={actionRef}/>,
      ]}
    />
  );
};

const BackCharacter = () => {
  return (
    <Layout style={{ minHeight: '100vh'}}>
      <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px",}}>
        <div style={{display:'flex'}}>
          <FolderOpenTwoTone style={{fontSize:"36px",marginTop:"15px",marginLeft:"5px"}}/>
          <Title level={2} style={{color:'GrayText', marginLeft:'10px',marginBottom:'15px'}}>角色列表</Title>
        </div>
      </Header>
      <Content style={{ padding: '15px 50px', minHeight:'100%'}}>
        <CharacterList />
      </Content>
      
    </Layout>


    
  )
}

export default BackCharacter;