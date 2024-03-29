﻿import React, { useEffect, useRef, useState } from "react"
import config from "../../const/config.js"
import { UpdateData, deleteData, getDataList, getDataOne } from "../../const/http.tsx"
import { CharacterOut, Authority, HumanOut } from "../../const/out.tsx"
import { useParams } from "react-router"
import url from "../../const/url"
import PageWait from "../../componet/PageWait.tsx"
import { ActionType, ModalForm, PageContainer, ProColumns, ProForm, ProFormDatePicker, ProFormSelect, ProFormText, ProFormTextArea, ProFormTreeSelect, ProTable } from "@ant-design/pro-components"
import { Button } from "antd"
import { PlusOutlined } from "@ant-design/icons"

type CharacterIn = {
    characterName: string
    characterDescription: string
}

type Grade = {
    characterId: number
    grade: number
    humanId: number
}

const AuthorityList = (prop: { characterId: number }) => {
    const actionRef = useRef<ActionType>();
    const link = async (dataId: number) => {
        let param: any = {
            dataId: dataId,
            type: "authority",
        }
        let paramString = new URLSearchParams(param).toString()
        return await UpdateData(config.backs.character_link + "/" + prop.characterId + "?" + paramString, {})
    }
    const drop = async (dataId: number) => {
        let param: any = {
            dataId: dataId,
            type: "authority",
        }
        let paramString = new URLSearchParams(param).toString()
        if (await UpdateData(config.backs.character_drop + "/" + prop.characterId + "?" + paramString, {}))
            actionRef.current?.reload()
    }

    const columns: ProColumns<Authority>[] = [
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
            title: '权限名称',
            dataIndex: 'authorityName',
        },
        {
            key: 'description',
            title: '权限描述',
            dataIndex: 'authorityDescription',
            ellipsis: true,
            tip: "备注过长会自动收缩,鼠标放上去查看",
            hideInSearch: true,
        }, {
            key: 'remark',
            title: '权限备注',
            dataIndex: 'authorityRemark',
            ellipsis: true,
            tip: "备注过长会自动收缩,鼠标放上去查看",
            hideInSearch: true,
        }, {
            key: 'action',
            title: '操作',
            dataIndex: 'dataId',
            render: (dom, entity, index, action) => {
                return (<Button danger onClick={() => { drop(entity.dataId) }}>删除</Button>)
            }
        }
    ]
    const newLink = (
        <ModalForm<{ dataId: number }>
            key="create"
            title="添加权限"
            trigger={
                <Button type="primary">
                    <PlusOutlined />
                    添加权限
                </Button>
            }
            width={400}
            submitTimeout={2000}
            autoFocusFirstInput
            onFinish={async (values: { dataId: number }) => {
                if (await link(values.dataId)) {
                    actionRef.current?.reload()
                    return true
                }
                else
                    return false
            }}
            modalProps={{
                destroyOnClose: true,
                onCancel: () => console.log('run'),
            }}>
            <ProFormTreeSelect
                width="md"
                name="dataId"
                label="权限"
                placeholder="请选择权限"
                request={async () => {
                    let authorities: Authority[] = (await getDataList(config.backs.authority, { toBrowser: true })).data
                    return authorities.map((value, index, array) => { return { title: value.authorityName, value: value.dataId } })
                }}
                required={true} />
        </ModalForm>
    )
    return (
        <ProTable<Authority>
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
                params.characterId = prop.characterId
                return getDataList(config.backs.character_authority, params)
            }}
            editable={{
                type: 'multiple',
            }}
            rowKey="id"
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
            headerTitle="权限列表"
            toolBarRender={() => [
                newLink
            ]}
        />
    )
}

const HumanList = (prop: { characterId: number }) => {
    const actionRef = useRef<ActionType>();
    const link = async (dataId: number, grade: number) => {
        let param: any = {
            dataId: dataId,
            type: "human",
            grade: grade
        }
        let paramString = new URLSearchParams(param).toString()
        return await UpdateData(config.backs.character_link + "/" + prop.characterId + "?" + paramString, {})
    }
    const drop = async (dataId: number) => {
        let param: any = {
            dataId: dataId,
            type: "human",
        }
        let paramString = new URLSearchParams(param).toString()
        if (await UpdateData(config.backs.character_drop + "/" + prop.characterId + "?" + paramString, {}))
            actionRef.current?.reload()
    }

    const columns: ProColumns<Grade>[] = [
        {
            key: 'code',
            title: '编号',
            valueType: "indexBorder",
            width: 48,
            align: "center"

        },
        {
            key: 'humanId',
            title: '人力资源',
            dataIndex: 'humanId',
            valueType: 'select',
            request: async () => {
                let humans: HumanOut[] = (await getDataList(config.fronts.human, { toBrowser: true })).data
                console.log(humans)
                let tree = humans.map((value, index, array) => { return { label: value.name, value: value.dataId } })
                console.log(tree)
                return tree
            },
            hideInSearch: true
        },
        {
            key: 'grade',
            title: '角色等级',
            dataIndex: 'grade',
            valueType: 'select',
            request: async () => {
                return [
                    {
                        label: '总部',
                        value: 0
                    }, {
                        label: '分部',
                        value: 1
                    }, {
                        label: '部门',
                        value: 2
                    },
                ]
            },
            hideInSearch: true,
        }, {
            key: 'action',
            title: '操作',
            dataIndex: 'dataId',
            render: (dom, entity, index, action) => {
                return (<Button danger onClick={() => { drop(entity.humanId) }}>删除</Button>)
            },
            hideInSearch: true
        }
    ]
    const newLink =  (
        <ModalForm<{ dataId: number, grade: number }>
            key="create"
            title="添加人员"
            trigger={
                <Button type="primary">
                    <PlusOutlined />
                    添加人员
                </Button>
            }
            width={400}
            submitTimeout={2000}
            autoFocusFirstInput
            onFinish={async (values: { dataId: number, grade: number }) => {
                if (await link(values.dataId, values.grade)) {
                    actionRef.current?.reload()
                    return true
                }
                else
                    return false
            }}
            modalProps={{
                destroyOnClose: true,
                onCancel: () => console.log('run'),
            }}>
            <ProFormTreeSelect
                width="md"
                name="dataId"
                label="人员"
                placeholder="请选择人员"
                request={async () => {
                    let humans: HumanOut[] = (await getDataList(config.fronts.human, { toBrowser: true })).data
                    return humans.map((value, index, array) => { return { title: value.name, value: value.dataId } })
                }}
                required={true} />
            <ProFormSelect
                width="md"
                name="grade"
                label="权限等级"
                placeholder="请选择权限"
                request={async () => {
                    return [
                        {
                            label: '总部',
                            value: 0
                        }, {
                            label: '分部',
                            value: 1
                        }, {
                            label: '部门',
                            value: 2
                        },
                    ]
                }}
                required={true} />
        </ModalForm>
    )

    return (
        <ProTable<Grade>

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
                params.characterId = prop.characterId
                return getDataList(config.backs.character_human, params)
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
            search={false}
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
            headerTitle="所属人员"
            toolBarRender={() => [
                newLink,
            ]}
        />
    )
}

const BaseCharacterConcrete = () => {
    const characterId = useParams().dataId
    const [character, setCharacter] = useState<CharacterOut>()
    useEffect(() => {
        if (character === undefined)
            getDataOne(config.backs.character + "/" + characterId).then((value) => {
                if (value.success)
                    setCharacter(value.data)
            })
    })
    useEffect(() => {
        document.title = '角色详情-' + character?.characterName
    }, [character?.characterName])
    if (characterId === undefined) {
        window.location.replace(url.backUrl.character)
        return (<div></div>)
    }
    if (character === undefined)
        return (<PageWait />)
    const deleteCharacter = async () => {
        return (await deleteData(config.backs.character + "/" + characterId))
    }

    const characterBase = (
        <div style={{ height: "85vh", display: "flex", background: "#fdfdfd", paddingTop: "30px" }}>
            <ProForm<CharacterOut>
                style={{
                    margin: "0 auto"
                }}
                submitter={{
                    searchConfig: {
                        resetText: "重置",
                        submitText: "保存"
                    },
                    submitButtonProps: {
                        style: { marginRight: "auto" }
                    },
                    resetButtonProps: {
                        style: { marginLeft: "auto" }
                    }
                }}
                layout="horizontal"
                initialValues={character}
                onFinish={async (character: CharacterOut) => {
                    return (await UpdateData(config.backs.character + "/" + characterId, character))
                }}
            >
                <ProFormText
                    width="xl"
                    name="characterName"
                    label="角色名称"
                    tooltip="最长为33位"
                    placeholder="请输入表单显示名称"
                    required={true}
                />
                <ProFormTextArea
                    width="xl"
                    name="characterDescription"
                    label="角色名称"
                    tooltip="最长为33位"
                    placeholder="请输入表单显示名称"
                    required={true}
                />
                <ProFormDatePicker
                    readonly={true}
                    name="createTime"
                    label="创建时间"
                    width="md"
                />
                <ProFormText
                    readonly
                    label="创建人"
                    name="createName"
                    addonAfter={<Button onClick={() => { window.open(url.frontUrl.humanResource + character.creator) }}>查看</Button>}
                />
            </ProForm>
        </div>
    )

    return (
        <div
            style={{ background: '#F5F7FA' }}
        >
            <PageContainer

                fixedHeader
                header={{
                    title: character.characterName,
                    breadcrumb: {
                        items: [
                            {
                                title: '角色列表',
                            },
                            {
                                title: character.characterName,
                            },
                        ],
                    },
                    extra: [
                        <Button key='2' type='default' danger onClick={deleteCharacter}>删除</Button>
                    ]
                }}

                tabList={[
                    {
                        tab: '基本信息',
                        key: '1',
                        children: (characterBase)
                    },
                    {
                        tab: '权限信息',
                        key: '2',
                        children: (<AuthorityList characterId={parseInt(characterId)} />)
                    },
                    {
                        tab: '成员信息',
                        key: '3',
                        children: (<HumanList characterId={parseInt(characterId)} />)
                    },
                ]}
            >
            </PageContainer>
        </div>
    )
}

export default BaseCharacterConcrete