import { FolderOpenTwoTone, PlusOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns, ProFormText, ProFormTextArea, ProTable } from '@ant-design/pro-components';
import { Button, Dropdown, Form, Layout, MenuProps, Typography } from 'antd';
import React, { useEffect, useRef } from 'react';
import url from '../../const/url.js';
import { UpdateData, deleteData, getDataList, newData } from '../../const/http.tsx';
import { Content, Header } from 'antd/es/layout/layout';
import { ModuleOut } from '../../const/out.tsx';
import config from '../../const/config.js';

const { Title } = Typography

const baseURL = config.backs.module

type FormModule = {
  moduleTypeName: string
  workflowRemark: string
}



const UpdateModule = (prop: { dataId: number, data: FormModule, action: React.MutableRefObject<ActionType | undefined> }) => {
  const [form] = Form.useForm<FormModule>();
  const items = [
    {
      key: '1',
      label: '删除',
      danger: true
    }
  ];
  const deleteMethod: MenuProps['onClick'] = () => {
    deleteData(baseURL + "/" + prop.dataId)
    if (prop.action.current !== undefined)
      prop.action.current.reload();
  }
  return (
    <ModalForm<{ moduleTypeName: string; workflowRemark: string }>
      initialValues={prop.data}
      title="编辑应用"
      trigger={
        <Dropdown.Button
          type="primary"
          menu={{ items, onClick: deleteMethod }}
        >
          编辑
        </Dropdown.Button>
      }
      width={400}
      form={form}
      submitTimeout={2000}
      autoFocusFirstInput
      onFinish={async (values: FormModule) => {
        let success: boolean = await UpdateData(baseURL + "/" + prop.dataId, values)
        if (success)
          if (prop.action.current !== undefined)
            prop.action.current.reload();
        return success;
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
        required={true} />
      <ProFormTextArea
        width="md"
        name="workflowRemark"
        label="应用备注"
        tooltip="最长333位"
        placeholder="请输入应用备注"
        required={false} />
    </ModalForm>

  )
}

const CreateModule = (prop: { action: React.MutableRefObject<ActionType | undefined> }) => {
  const [form] = Form.useForm<FormModule>();
  return (
    <ModalForm<{ moduleTypeName: string; workflowRemark: string }>
      title="新建应用"
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
      onFinish={async (values: FormModule) => {
        let dataId = await newData(baseURL, values)
        if (dataId !== -1) {
          if (prop.action.current !== undefined)
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
        name="moduleTypeName"
        label="应用名称"
        tooltip="最长为33位"
        placeholder="请输入应用名称"
        required={true} />
      <ProFormTextArea
        width="md"
        name="workflowRemark"
        label="应用备注"
        tooltip="最长333位"
        placeholder="请输入应用备注"
        required={false} />
    </ModalForm>

  )
}


const ModuleList = () => {
  useEffect(()=>{
    document.title = "模块列表"
  })
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<ModuleOut>[] = [
    {
      key: 'code',
      title: '编号',
      dataIndex: 'moduleTypeId',
      valueType: "indexBorder",
      width: 48,
      align: "center"

    },
    {
      key: 'moduleTypeName',
      title: '应用名称',
      dataIndex: 'moduleTypeName',
    },
    {
      key: 'workflowRemark',
      title: '应用备注',
      dataIndex: 'workflowRemark',
      ellipsis: true,
      tip: "备注过长会自动收缩,鼠标放上去查看",
      hideInSearch: true,
    },
    {
      key: 'creator',
      title: '创建者',
      dataIndex: 'creatorId',
      width: 48 * 2,
      render: (dom, entity, index, action) => [
        <a href={url.frontUrl.humanResource + entity.creatorId} key={"href" + entity.creatorId}>{entity.creatorName}</a>
      ],
      hideInSearch: true
    },
    {
      key: 'createTimeShow',
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: "dateTime",
      width: 48 * 4,
      hideInSearch: true
    },
    {
      key: 'createTime',
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: "dateTimeRange",
      hideInTable: true
    },
    {
      key: 'action',
      title: '操作',
      dataIndex: "moduleTypeId",
      width: 48 * 3,
      hideInSearch: true,
      render: (dom, entity, index, action) =>
        <UpdateModule
          dataId={entity.moduleTypeId}
          data={{
            moduleTypeName: entity.moduleTypeName,
            workflowRemark: entity.workflowRemark
          }}
          action={actionRef}
        />
    }
  ];

  return (
    <ProTable<ModuleOut>
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
        return getDataList("/api/v1/table/back/module", params)
      }}
      editable={{
        type: 'multiple',
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
        <CreateModule key="create" action={actionRef} />,
      ]}
    />
  );
};

const BackModule = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px", }}>
        <div style={{ display: 'flex' }}>
          <FolderOpenTwoTone style={{ fontSize: "36px", marginTop: "15px", marginLeft: "5px" }} />
          <Title level={2} style={{ color: 'GrayText', marginLeft: '10px', marginBottom: '15px' }}>应用列表</Title>
        </div>
      </Header>
      <Content style={{ padding: '15px 50px', minHeight: '100%' }}>
        <ModuleList />
      </Content>

    </Layout>



  )
}

export default BackModule;