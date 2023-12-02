import { FolderOpenTwoTone, PlusOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns, ProFormText, ProFormTextArea, ProFormTreeSelect, ProTable } from '@ant-design/pro-components';
import { Button, Dropdown, Form, Layout, MenuProps , Typography } from 'antd';
import React, { useRef } from 'react';
import url from '../../const/url.js';
import { UpdateData, deleteData, getDataList, newData } from '../../const/http.tsx';
import { Content, Header } from 'antd/es/layout/layout';
import { ContentOut, ModuleOut } from '../../const/out.tsx';
import config from '../../const/config.js';
import { getTree } from '../../utils/tree.tsx';
import DropdownButton from 'antd/es/dropdown/dropdown-button';

const {Title} = Typography

type ContentInSimple = {
    contentName:string
    contentRemark:string
    leadContent:number
}

const CreateContent = (prop:{action:React.MutableRefObject<ActionType|undefined>,leadContent:number|undefined}) => {
  const [form] = Form.useForm<ContentInSimple>();
  return (
    <ModalForm<ContentInSimple>
      title="新建目录"
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
      onFinish={async (values:ContentInSimple)=>{
        let dataId = await newData(config.backs.content,values)
        if (dataId!==-1) {
          if (prop.action.current!==undefined)
            prop.action.current.reload();
        }
        return dataId !== -1
      }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}>
        <ProFormText
          width="md"
          name="contentName"
          label="目录名称"
          tooltip="最长为33位"
          placeholder="请输入应用名称"
          required = {true}/>
        <ProFormTextArea
          width="md"
          name="contentRemark"  
          label="目录备注"
          tooltip="最长333位"
          placeholder="请输入应用备注"
          required={false}/>
        <ProFormTreeSelect
          width="md"
          name="leadContent"  
          label="目录备注"
          tooltip="最长333位"
          placeholder="请输入应用备注"
          initialValue={prop.leadContent}
          request={async ()=>{
            let contents:ContentOut[] = (await getDataList(config.backs.content)).data
            let treeBase = contents.map((content,index,array) => {return {title:content.contentName,parent:content.leadContent,value:content.dataId}})
            return getTree(treeBase)
          }}
          required={false}/>
      </ModalForm>

  )
}


const ContentList = (prop:{leadContent:number|undefined}) => {
  const actionRef = useRef<ActionType>();   

  const columns: ProColumns<ContentOut>[] = [
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
      title:'目录名称',
      dataIndex:'contentName',
    },
    {
      key:'remark',
      title:'目录备注',
      dataIndex:'contentRemark',
      ellipsis: true,
      tip:"备注过长会自动收缩,鼠标放上去查看",
      hideInSearch: true,
    },
    {
      key:'creator',
      title:'创建者',
      dataIndex:'creator',
      width:48*2,
      render:(dom,entity,index,action) => [
        <a href={url.frontUrl.humanResource+entity.creator} key={"href"+entity.creator}>{entity.creatorName}</a>
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
      render:(dom,entity,index,action)=>(
        <Dropdown.Button
            type="primary"
            menu={
                {items:[{
                    key: '1',
                    label: '删除',
                }],onClick:() => {
                    deleteData(config.backs.content+"/"+entity.dataId).then(
                        (value)=>{if (value) actionRef.current?.reload()}
                    )}
            }
           }
           onClick={()=>{
            window.location.assign(url.backUrl.content.replace("{id}",entity.dataId+""))
           }}>编辑</Dropdown.Button>
      )
    }
  ];
  
  return (
    <ProTable<ContentOut>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (
        params,
        sort,
        filter,
      ) => {
        if (prop.leadContent !== undefined && params.leadContent ===undefined)
            params.leadContent = prop.leadContent
        return getDataList(config.backs.content,params)
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
        <CreateContent key="create" action={actionRef} leadContent={prop.leadContent}/>,
      ]}
    />
  );
};

const BackContent = (prop:{leadContent:number|undefined}) => {
    let title
    if (prop.leadContent === undefined)
        title = "下级目录"
    else
        title = "目录列表"
    return (
        <Layout style={{ minHeight: '100vh'}}>
        <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px",}}>
            <div style={{display:'flex'}}>
            <FolderOpenTwoTone style={{fontSize:"36px",marginTop:"15px",marginLeft:"5px"}}/>
            <Title level={2} style={{color:'GrayText', marginLeft:'10px',marginBottom:'15px'}}>{title}</Title>
            </div>
        </Header>
        <Content style={{ padding: '15px 50px', minHeight:'100%'}}>
            <ContentList leadContent={prop.leadContent} />
        </Content>
        
        </Layout>


    
  )
}

export default BackContent;