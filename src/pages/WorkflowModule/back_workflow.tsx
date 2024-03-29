﻿import { useState, useEffect, useRef } from "react"
import { getDataList, newData } from "../../const/http.tsx"
import { ModuleOut, TableOut, WorkflowOut } from "../../const/out.tsx"
import config from "../../const/config.js"
import { SnippetsFilled, FolderOpenTwoTone, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Layout, List, Modal, Tabs, Typography } from "antd"
import Sider from "antd/es/layout/Sider"
import { Header, Content } from "antd/es/layout/layout"
import React from "react"
import { ActionType, ModalForm, ProColumns, ProFormGroup, ProFormText, ProFormTextArea, ProFormTreeSelect, ProTable } from "@ant-design/pro-components"
import { useLocation } from "react-router"
import url from "../../const/url.js"
import PageWait from "../../componet/PageWait.tsx"

const { Title } = Typography;

type WorkflowIn = {
  moduleTypeId: number
  tableId: number
  workFlowName: string
  workFlowDescription: string
}

const CreateWorkflow = (prop: { moduleTypeId: string | null, actionRef: React.MutableRefObject<ActionType | undefined> }) => {
  const moduleTypeId = prop.moduleTypeId ? parseInt(prop.moduleTypeId) : null
  const [form] = Form.useForm<WorkflowIn>();
  let jump: boolean = false;
  return (
    <ModalForm<WorkflowIn>
      title="创建流程"
      trigger={
        <Button type="primary">
          <PlusOutlined />
          创建流程
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
        render: (prop, defaultDoms) => {
          return [
            ...defaultDoms,
            <Button
              key="jump"
              type='primary'
              onClick={() => {
                jump = true
                prop.submit()
              }}>新建并跳转</Button>
          ]
        }
      }}
      onFinish={async (values: WorkflowIn) => {
        console.log(values)
        let dataId: number = await newData(config.backs.workflow, values)
        if (dataId != -1) {
          if (jump)
            window.open(url.backUrl.workflow_concrete + dataId);
          form.resetFields()
          prop.actionRef.current?.reload()
          jump = false
          return true
        }
        return false
      }}
    >
      <ProFormText
        width="md"
        name="workFlowName"
        label="流程名称"
        tooltip="最长为33位"
        placeholder="请输入流程名称"
        required={true} />
      <ProFormTextArea
        width="md"
        name="workFlowDescription"
        label="流程描述"
        tooltip="最长为333位"
        placeholder="请输入流程描述"
        required={true} />
      <ProFormTreeSelect
        width="md"
        name="moduleTypeId"
        label="所属模块"
        tooltip="请选择所属模块"
        required={true}
        request={async () => {
          let moduleList: ModuleOut[] = (await getDataList(config.backs.module, { toBrowser: true })).data
          const valueEnumModule: { title: string, value: number, children: any[] }[] = moduleList.map(
            (item) => {
              return { title: item.moduleTypeName, value: item.moduleTypeId, children: [] };
            })
          return valueEnumModule
        }}
        initialValue={moduleTypeId} />
      <ProFormTreeSelect
        width="md"
        name="tableId"
        label="关联表单"
        tooltip="请选择所属模块"
        required={true}
        request={async () => {
          let tableList: TableOut[] = (await getDataList(config.backs.table, { toBrowser: true, isVirtual: false })).data
          const valueEnumModule: { title: string, value: number, children: any[] }[] = tableList.map(
            (item) => {
              return { title: item.tableViewName, value: item.tableId, children: [] };
            })
          return valueEnumModule
        }} />
      <ProFormText
        width="md"
        name="workflowBaseTitle"
        label="流程请求显示基础名称"
        tooltip="请输入请求名称"
        placeholder="不输入自动替换为流程标题"
        required={false} />

    </ModalForm>
  )
}

const WorkflowList = () => {
  const actionRef = useRef<ActionType>();
  const query = new URLSearchParams(useLocation().search);
  const moduleNo = query.get("moduleNo");
  const columns: ProColumns<WorkflowOut>[] = [
    {
      key: 'code',
      title: '编号',
      dataIndex: 'dataId',
      valueType: "indexBorder",
      width: 48,
      align: "center"
    }, {
      key: 'workflowName',
      title: '流程名称',
      dataIndex: 'workFlowName'
    }, {
      key: 'workFlowDescription',
      title: '流程描述',
      dataIndex: 'workFlowDescription',
      ellipsis: true,
      tip: "备注过长会自动收缩,鼠标放上去查看",
      hideInSearch: true,
    }, {
      key: 'tableId',
      title: '关联表单',
      hideInSearch: true,
      dataIndex: 'tableId',
      render: (dom, entity, index, action, schema) => (
        <Button
          type="link"
          onClick={() => {
            window.open(url.backUrl.table + '/' + entity.tableId)
          }}
        >
          {entity.tableName}
        </Button>
      )
    }, {
      key: 'moduleTypeId',
      title: '所属模块',
      hideInSearch: true,
      render: (dom, entity, index, action, schema) => (
        <Button
          type="link"
          onClick={() => {
            window.open(url.backUrl.module + '/' + entity.moduleTypeId)
          }}
        >
          {entity.moduleTypeName}
        </Button>
      ),
      dataIndex: "moduleTypeId",
    }, {
      key: 'creator',
      title: '创建者',
      dataIndex: 'creatorId',
      width: 48 * 2,
      render: (dom, entity, index, action) => (
        <a href={url.frontUrl.humanResource + entity.creator} key={"href" + entity.creator}>{entity.creatorName}</a>
      ),
      hideInSearch: true
    },
    {
      key: 'createTimeShow',
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: "dateTime",
      width: 48 * 4,
      hideInSearch: true
    }, {
      key: 'createTime',
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: "dateTimeRange",
      hideInTable: true
    }, {
      key: 'isDeprecated',
      dataIndex: 'isDeprecated',
      title: "流程状态",
      valueType: 'select',
      request: async () => {
        return [
          {
            label: '正常',
            value: 0
          }, {
            label: '废弃',
            value: 1
          },
        ]
      }
    }, {
      key: 'action',
      title: '操作',
      dataIndex: "dataId",
      width: 48 * 3,
      hideInSearch: true,
      render: (dom, entity, index, action) =>
        <Button
          type="primary"
          onClick={() => {
            window.open(url.backUrl.workflow_concrete + entity.dataId)
          }}
        >
          编辑
        </Button>
    }
  ]
  return (
    <ProTable<WorkflowOut>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter) => {
        if (moduleNo != null)
          params.moduleTypeId = moduleNo
        return getDataList(config.backs.workflow, params)
      }}
      rowKey='dataId'
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
      headerTitle="工作流列表"
      toolBarRender={() => [
        <CreateWorkflow key="create" moduleTypeId={moduleNo} actionRef={actionRef} />
      ]}
    />
  )
}


const BackWorkflow = () => {
  const [moduleList, setModuleList] = useState<ModuleOut[]>()
  useEffect(() => {
    if (moduleList === undefined)
      (getDataList("/api/v1/table/back/module", { toBrowser: true })).then((value) => {
        setModuleList(value.data)
      })
  })
  useEffect(() => {
    document.title = '流程列表'
  })
  if (moduleList === undefined)
    return <PageWait />
  if (moduleList?.length === 0)
    return <PageWait />
  
  return (
    <Layout style={{ minHeight: '98.5vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px", }}>
        <SnippetsFilled style={{ fontSize: "36px", marginTop: "30px", marginLeft: "5px", marginBottom: '30px' }} />
        <Title level={2} style={{ color: 'GrayText', marginLeft: '10px', marginBottom: '30px' }}>流程列表</Title>
      </Header>
      <Layout hasSider>
        <Sider style={{ padding: '10px 10px', backgroundColor: "#f7f7f7" }}>
          <List
            style={{ minHeight: '100%' }}
            pagination={{ position: 'top', align: 'center' }}
            bordered={true}
            itemLayout="horizontal"
            dataSource={moduleList}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<FolderOpenTwoTone />}
                  title={<a href={window.location.pathname + "?moduleNo=" + item.moduleTypeId}>{item.moduleTypeName}</a>}
                />
              </List.Item>
            )}
          />
        </Sider>
        <Content style={{ padding: '15px 50px' }}>
          <WorkflowList />
        </Content>
      </Layout>
    </Layout>
  );
}

export default BackWorkflow;