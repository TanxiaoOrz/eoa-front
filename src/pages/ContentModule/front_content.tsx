import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, PageContainer, ProColumns, ProForm, ProFormDatePicker, ProFormText, ProFormTextArea, ProFormTreeSelect, ProTable } from '@ant-design/pro-components';
import { Button, Dropdown, Form, Typography, Upload, UploadProps, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import url from '../../const/url.js';
import { deleteData, getDataList, getDataOne, newData } from '../../const/http.tsx';
import { ContentOut, FileOut } from '../../const/out.tsx';
import config from '../../const/config.js';
import { getTree } from '../../utils/tree.tsx';
import { useParams } from 'react-router';

const {Title} = Typography

type FileIn = {
    fileName:string
    fileRoute:string
    leadContent:string

}

const CreateFile= (prop:{action:React.MutableRefObject<ActionType|undefined>,leadContent:number}) => {
  const [form] = Form.useForm<FileIn>();
  const upLoadProos:UploadProps = {
    headers:{
        tokens:localStorage.getItem('tokens') ?? ""
    },
    method:"POST",
    action:config.backUrl+config.fronts.upload+"/content",
    data:{
        leadContent:prop.leadContent
    },
    maxCount:1,
    onChange:(info) => {
        let {status, response, name} = info.file
        if (status === 'done')
            if (response.code === 0) {
                message.success("上传成功")
                form.setFieldValue("fileName", name)
                form.setFieldValue("fileRoute", response.entity)
            } else {
                message.error(response.description)
            }
    },
    itemRender:()=>{return (<></>)}
  } 
  return (
    <ModalForm<FileIn>
      title="新建文件"
      trigger={
        <Button type="primary">
          <PlusOutlined />
          上传文件
        </Button>
      }
      width={400}
      form={form}
      submitter={{
        searchConfig: {
          submitText: '新建',
          resetText: '取消',
        },
      }}
      submitTimeout={2000}
      autoFocusFirstInput
      onFinish={async (values:FileIn)=>{
        console.log(values)
        let dataId = await newData(config.fronts.file,values)
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
          name="fileName"
          label="文件名称"
          tooltip="最长为33位"
          placeholder="请输入文件名称"
          required = {true}/>
        <ProFormTextArea
          width="md"
          name="fileRoute"  
          label="文件路径"
          tooltip="请点击右侧按钮上传"
          placeholder="文件访问路径"
          required = {true}
          readonly
          addonAfter={<Upload {...upLoadProos}><Button icon={<UploadOutlined />}/></Upload>}
        />
        <ProFormTreeSelect
          width="md"
          name="leadContent"  
          label="上级目录"
          tooltip="文件所在目录"
          placeholder="请选择上级目录"
          initialValue={prop.leadContent}
          request={async ()=>{
            let contents:ContentOut[] = (await getDataList(config.fronts.content,{toBrowser:true})).data
            let treeBase = contents.map((content,index,array) => {return {title:content.contentName,parent:content.leadContent,value:content.dataId}})
            return getTree(treeBase)
          }}
          required = {true}
          readonly/>
      </ModalForm>

  )
}


const FrontContent = (prop:{leadContent:number|undefined}) => {
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
      ],
      hideInSearch:true
    },
    {
      key:'createTimeShow',
      title:'创建时间',
      dataIndex:'createTime',
      valueType: "dateTime",
      width:48*4,
      hideInSearch:true,
    },
    {
      key:'createTime',
      title:'创建时间',
      dataIndex:'createTime',
      valueType:"dateTimeRange",
      hideInTable:true
    },{
      key:'dataId',
      title:'操作',
      width:48*2,
      hideInSearch:true,
      render:(dom,entity,index,action) => [
        <Button type='primary' key={"href"+entity.creator} href={url.frontUrl.content_concrete+entity.dataId}>查看</Button>
      ],
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
        params.leadContent = prop.leadContent
        return getDataList(config.fronts.content,params)
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
      headerTitle="下级目录"
    />
  );
};

const FileList = (prop:{leadContent:number}) => {
    const actionRef = useRef<ActionType>();   
  
    const columns: ProColumns<FileOut>[] = [
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
        title:'文件名称',
        dataIndex:'fileName',
      },
      {
        key:'creator',
        title:'创建者',
        dataIndex:'creator',
        width:48*2,
        render:(dom,entity,index,action) => [
          <a href={url.frontUrl.humanResource+entity.creator} key={"href"+entity.creator}>{entity.creatorName}</a>
        ],
        hideInSearch:true
      },
      {
        key:'createTimeShow',
        title:'创建时间',
        dataIndex:'createTime',
        valueType: "dateTime",
        width:48*4,
        hideInSearch:true,
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
                      label: '废弃',
                      danger:true,
                  }],onClick:() => {
                      deleteData(config.fronts.file+"/"+entity.dataId).then(
                          (value)=>{if (value) actionRef.current?.reload()}
                      )}
              }
             }
             onClick={()=>{
              window.open(config.backUrl+entity.fileRoute)
             }}>下载</Dropdown.Button>
        )
      }
    ];
    return (
        <ProTable<FileOut>
          columns={columns}
          actionRef={actionRef}
          cardBordered
          request={async (
            params,
            sort,
            filter,
          ) => {
            params.leadContent = prop.leadContent
            params.isDeprecated = 0
            return getDataList(config.fronts.file,params)
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
          rowKey="dataid"
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
          headerTitle="目录列表"
          toolBarRender={() => [
            <CreateFile key="create" action={actionRef} leadContent={prop.leadContent}/>,
          ]}
        />
      );
    };

const FrontContentConcrete = () => {
    const contentId =parseInt(useParams().contentId ?? "0")
    const [content, setContent] = useState<ContentOut>({
        dataId:0,
        deprecated:false,
        contentName:'根目录',
        contentRemark:"2023-12-3 21:28:00",
        creator:"1",
        createTime:"",
        defaultEdit:"",
        defaultCreate:"",
        defaultDelete:"",
        defaultShare:"",
        leadContent:0,
        creatorName:"系统管理员",
        leadName:"无"
    });
    useEffect(()=>{
        if (contentId !==  content.dataId)
            getDataOne(config.fronts.content + "/" + contentId).then((values)=>{
                if (values.success) {
                    setContent(values.data);
                }
                console.log(content)
                if (content === null)
                    message.error("该表单不存在")
            })
        
    })
    const ContentBase = () => {
        return (
            <div style={{height:"85vh",display:"flex",background:"#fdfdfd",paddingTop:"30px"}}>
            <ProForm<ContentOut>
                readonly
                style={{
                    margin:"0 auto"
                }}
                submitter={{
                    render:false
                }}
                layout="horizontal"
                initialValues={content}
                onValuesChange={(changedValues,values)=>{
                    console.log(changedValues)
                    Object.entries(changedValues).forEach((value,index,array) =>{
                        content[value[0]] = value[1]
                    })
                    console.log(content)
                    // setTable(table)
                }}
            >
                <ProFormText
                    width="md"
                    name="contentName"
                    label="目录名称"
                    tooltip="最长为33位"
                    placeholder="请输入目录名称"
                    required = {true}/>
                <ProFormTextArea
                    width="md"
                    name="contentRemark"  
                    label="目录备注"
                    tooltip="最长333位"
                    placeholder="请输入目录备注"
                    required={false}/>
                <ProFormText
                    width="md"
                    name="leadName"  
                    label="上级目录"                
                    required={false}/>
                <ProFormDatePicker
                    readonly = {true}
                    name="createTime"
                    label="创建时间"
                    width="md"/>
                <ProFormText
                    readonly
                    label="创建人"
                    name="creatorName"
                    addonAfter={<Button onClick={()=>{window.open(url.frontUrl.humanResource+content.creator)}}>查看</Button>}
                />
            </ProForm>
            </div>)
    }
    const tabList = [
        {
        tab: '目录信息',
        key: '1',
        children:(<ContentBase/>)
        },
        {
        tab: '下级目录',
        key: '2',
        children:(<FrontContent leadContent={contentId}/>)
        },
    ]
    if (contentId !== 0)
        tabList.push({
            tab: '文件列表',
            key: '3',
            children:(<FileList leadContent={contentId}/>)
            })
    return (
    <div
        style={{
        background: '#F5F7FA',
        }}
    >
        <PageContainer
            
            fixedHeader
            header={{
                title:content.contentName,
                breadcrumb: {
                items: [
                    {
                    path:url.frontUrl.content_concrete+content.leadName,
                    title: content.leadName,
                    },
                    {
                    title: content.contentName,
                    },
                ],
                },
            }}
            
            tabList={tabList}
            >
        </PageContainer>
    </div>)
};


export default FrontContentConcrete;