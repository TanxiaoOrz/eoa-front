import { ActionType, ModalForm, ProColumns, ProFormSelect, ProFormText, ProFormTextArea, ProTable } from "@ant-design/pro-components"
import { Button, Tabs, message } from "antd"
import React, { useRef } from "react"
import { Children } from "react"
import { getDataList } from "../const/http.tsx"
import config from "../const/config.js"
import { ColumnOut } from "../const/out.tsx"
import { PlusOutlined } from "@ant-design/icons"

type Task = {
    columnId: number
    input: string
    type: number
}

type Action = {
    classNames: string[]
    tasks: Task[]
}


const SQLList = (prop: { values: Task[], tableId: number, save: () => boolean, title: string }) => {
    const actionRef = useRef<ActionType>();
    const columns: ProColumns<Task>[] = [
        {
            key: 'columnId',
            dataIndex: 'columnId',
            valueType: 'select',
            title: prop.title,
            request: async () => {
                let columns: ColumnOut[] = (await getDataList(config.backs.column, { ...config.toBrowser, tableId: prop.tableId, isVirtual: false })).data
                return columns.map((column) => { return { label: column.columnViewName, value: column.columnId } })
            }
        }, {
            key: 'input',
            dataIndex: 'input',
            title: '数据库取值语句',
            valueType: 'textarea'
        }, {
            key: 'action',
            dataIndex: 'columnId',
            title: '操作',
            render: (dom, entity, index, action, schema) => (
                <Button danger onClick={() => {
                    prop.values.splice(index, 1)
                    if (prop.save()) {
                        message.success("删除成功")
                        action?.reload()
                    } else
                        message.error("删除失败")
                }}>删除</Button>
            ),
        }
    ]
    const create = (
        <ModalForm<Task>
            title="新建数据库取值"
            trigger={
                <Button type="primary">
                    <PlusOutlined />
                    新建
                </Button>
            }
            width={400}
            submitTimeout={2000}
            autoFocusFirstInput
            submitter={{
                searchConfig: {
                    submitText: '新建',
                    resetText: '取消',
                },
            }}
            onFinish={async (values: Task) => {
                values.type = 0
                prop.values.push(values)
                if (prop.save()) {
                    message.success("新建成功,请保存后刷新页面查看或继续修改")
                    actionRef.current?.reload()
                    return true
                } else {
                    message.error("新建失败")
                    return false
                }
            }}
        >
            <ProFormSelect
                width="md"
                name="columnId"
                label={prop.title}
                required={true}
                request={async () => {
                    let columns: ColumnOut[] = (await getDataList(config.backs.column, { ...config.toBrowser, tableId: prop.tableId, isVirtual: false })).data
                    return columns.map((column) => { return { label: column.columnViewName, value: column.columnId } })
                }} />
            <ProFormTextArea
                width="md"
                name="input"
                label="数据库取值语句"
                placeholder="请输入数据库取值语句"
                required
                tooltip="返回值一行一列" />
        </ModalForm>
    )
    return (
        <ProTable<Task>
            columns={columns}
            cardBordered
            actionRef={actionRef}
            request={async (params, sort, filter) => {
                return { data: prop.values, success: true, total: prop.values.length }
            }}
            rowKey='dataId'
            search={false}
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
            headerTitle="数据库取值列表"
            toolBarRender={() => [
                create
            ]}
        />
    )
}

const InputList = (prop: { values: Task[], tableId: number, save: () => boolean, title: string }) => {
    const actionRef = useRef<ActionType>();
    const columns: ProColumns<Task>[] = [
        {
            key: 'columnId',
            dataIndex: 'columnId',
            valueType: 'select',
            title: prop.title,
            request: async () => {
                let columns: ColumnOut[] = (await getDataList(config.backs.column, { ...config.toBrowser, tableId: prop.tableId, isVirtual: false })).data
                return columns.map((column) => { return { label: column.columnViewName, value: column.columnId } })
            }
        }, {
            key: 'input',
            dataIndex: 'input',
            title: '固定值'
        }, {
            key: 'action',
            dataIndex: 'columnId',
            title: '操作',
            render: (dom, entity, index, action, schema) => (
                <Button danger onClick={() => {
                    prop.values.splice(index, 1)
                    if (prop.save()) {
                        message.success("删除成功")
                        action?.reload()
                    } else
                        message.error("删除失败")
                }}>删除</Button>
            ),
        }
    ]
    const create = (
        <ModalForm<Task>
            title="新建固定值"
            trigger={
                <Button type="primary">
                    <PlusOutlined />
                    新建
                </Button>
            }
            width={400}
            submitTimeout={2000}
            autoFocusFirstInput
            submitter={{
                searchConfig: {
                    submitText: '新建',
                    resetText: '取消',
                },
            }}
            onFinish={async (values: Task) => {
                values.type = 1
                prop.values.push(values)
                if (prop.save()) {
                    message.success("新建成功,请保存后刷新页面查看或继续修改")
                    actionRef.current?.reload()
                    return true
                } else {
                    message.error("新建失败")
                    return false
                }
            }}
        >
            <ProFormSelect
                width="md"
                name="columnId"
                label={prop.title}
                required={true}
                request={async () => {
                    let columns: ColumnOut[] = (await getDataList(config.backs.column, { ...config.toBrowser, tableId: prop.tableId, isVirtual: false })).data
                    return columns.map((column) => { return { label: column.columnViewName, value: column.columnId } })
                }} />
            <ProFormText
                width="md"
                name="input"
                label="固定值"
                placeholder="请输入固定值"
                required />
        </ModalForm>
    )
    return (
        <ProTable<Task>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params, sort, filter) => {
                return { data: prop.values, success: true, total: prop.values.length }
            }}
            rowKey='dataId'
            search={false}
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
            headerTitle="固定值列表"
            toolBarRender={() => [
                create
            ]}
        />
    )
}

type javaLie = {
    java: string
}

const JAVAList = (prop: { javas: string[], save: () => boolean }) => {
    const actionRef = useRef<ActionType>();
    const columns: ProColumns<javaLie>[] = [
        {
            key: 'java',
            dataIndex: 'java',
            title: '全路径类名'
        }, {
            key: 'action',
            dataIndex: 'columnId',
            title: '操作',
            render: (dom, entity, index, action, schema) => (
                <Button danger onClick={() => {
                    prop.javas.splice(index, 1)
                    if (prop.save()) {
                        message.success("新建成功,请保存后刷新页面查看或继续修改")
                        actionRef.current?.reload()
                        return true
                    } else {
                        message.error("新建失败")
                        return false
                    }
                }}>删除</Button>
            ),
        }
    ]
    const create = (
        <ModalForm<javaLie>
            title="新建类操作"
            trigger={
                <Button type="primary">
                    <PlusOutlined />
                    新建
                </Button>
            }
            width={400}
            submitTimeout={2000}
            autoFocusFirstInput
            submitter={{
                searchConfig: {
                    submitText: '新建',
                    resetText: '取消',
                },
            }}
            onFinish={async (values: javaLie) => {
                prop.javas.push(values.java)
                if (prop.save()) {
                    message.success("新建成功,请保存后刷新页面查看或继续修改")
                    actionRef.current?.reload()
                }
                else
                    message.error("新建失败")
            }}
        >
            <ProFormText
                width="md"
                name="java"
                label="全路径类名"
                required={true} />
        </ModalForm>
    )
    return (
        <ProTable<javaLie>
            columns={columns}
            cardBordered
            request={async (params, sort, filter) => {
                return { data: prop.javas.map((string) => { return { java: string } }), success: true, total: prop.javas.length }
            }}
            rowKey='dataId'
            actionRef={actionRef}
            search={false}
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
            headerTitle="类操作列表"
            toolBarRender={() => [
                create
            ]}
        />
    )
}


const ActionEdit = (prop: { initialValue: string | null, tableId: number, setValue: (value: string) => boolean, type: "action" | "check" }) => {
    const sqls: Task[] = []
    const inputs: Task[] = []
    const javas: string[] = []
    if (prop.initialValue) {
        let action: Action = JSON.parse(prop.initialValue)
        for (let task of action.tasks) {
            if (task.type === 0)
                sqls.push(task)
            if (task.type === 1)
                inputs.push(task)
        }
        for (let java of action.classNames) {
            javas.push(java)
        }
    }
    let title: string
    let javaToolitip: string
    switch (prop.type) {
        case "action": {
            javaToolitip = '请保证该类继承org.eoa.projectbudget.extension.WorkflowCheck类并实现其中的check方法'
            title = '赋值字段'
            break
        }
        case "check": {
            javaToolitip = '请保证该类继承org.eoa.projectbudget.extension.WorkflowAction类并实现其中的action方法'
            title = '校验字段'
            break
        }
        default: {
            javaToolitip = ''
            title = ''
        }

    }

    const save = () => {
        let action: Action = {
            tasks: sqls.concat(inputs),
            classNames: javas
        }
        return (prop.setValue(JSON.stringify(action)))
    }

    const tabs = [
        {
            key: 'inputs',
            label: '输入值',
            children: <InputList save={save} values={inputs} tableId={prop.tableId} title={title} />
        }, {
            key: 'sqls',
            label: '数据库取值',
            children: <SQLList save={save} values={sqls} tableId={prop.tableId} title={title} />
        },{
            key: 'java',
            label: 'java接口',
            children: <JAVAList save={save} javas={javas} />
        }, 
    ]
    return (
        <Tabs
            style={{ height: "90vh", margin: "5px" }}
            items={tabs}
            tabPosition='left'>
        </Tabs>
    )
}

export default ActionEdit