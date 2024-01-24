import { PageContainer, ProForm, ProFormDatePicker, ProFormText, ProFormTextArea, ProFormTreeSelect } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { ContentOut } from '../../const/out';
import { UpdateData, deleteData, getDataList, getDataOne } from '../../const/http.tsx';
import config from '../../const/config';
import { useParams } from 'react-router-dom';
import { Button, Tabs, message } from 'antd';
import url from '../../const/url.js';
import { AuthorityEdit } from '../../componet/AuthorityEdit.tsx';
import { getTree } from '../../utils/tree.tsx';
import BackContent from './back_content.tsx';
import PageWait from '../../componet/PageWait.tsx';

const BackContentConcrete = () => {


    const contentId = parseInt(useParams().contentId ?? "0")

    const [content, setContent] = useState<ContentOut>();
    useEffect(() => {
        if (content === undefined)
            getDataOne(config.backs.content + "/" + contentId).then((values) => {
                if (values.success) {
                    setContent(values.data);
                }
                console.log(content)
                if (content === null)
                    message.error("该目录不存在")
            })

    })
    useEffect(() => {
        document.title = '目录编辑-' + content?.contentName
    }, [content?.contentName])

    if (content === undefined || content === null)
        return (<PageWait />)
    const upDateContent = async () => {
        return await UpdateData(config.backs.content + "/" + contentId, content);
    }
    const deleteContent = async () => {
        return await deleteData(config.backs.content + "/" + contentId);
    }

    const contentBase = (
        <div style={{ height: "85vh", display: "flex", background: "#fdfdfd", paddingTop: "30px" }}>
            <ProForm<ContentOut>
                style={{
                    margin: "0 auto"
                }}
                submitter={{
                    render: false
                }}
                layout="horizontal"
                initialValues={content}
                onValuesChange={(changedValues, values) => {
                    console.log(changedValues)
                    Object.entries(changedValues).forEach((value, index, array) => {
                        content[value[0]] = value[1]
                    })
                    console.log(content)
                    // setTable(table)
                }}
                onFinish={upDateContent}
            >
                <ProFormText
                    width="md"
                    name="contentName"
                    label="目录名称"
                    tooltip="最长为33位"
                    placeholder="请输入目录名称"
                    required={true} />
                <ProFormTextArea
                    width="md"
                    name="contentRemark"
                    label="目录备注"
                    tooltip="最长333位"
                    placeholder="请输入目录备注"
                    required={false} />
                <ProFormTreeSelect
                    width="md"
                    name="leadContent"
                    label="上级目录"
                    tooltip="不选择代表处于根目录下"
                    placeholder="请选择上级目录,未选择代表处于根目录下"
                    request={async () => {
                        let contents: ContentOut[] = (await getDataList(config.backs.content, { toBrowser: true })).data
                        let treeBase = contents.map((content, index, array) => { return { title: content.contentName, parent: content.leadContent, value: content.dataId } })
                        return getTree(treeBase)
                    }}
                    required={false} />
                <ProFormDatePicker
                    readonly={true}
                    name="createTime"
                    label="创建时间"
                    width="md" />
                <ProFormText
                    readonly
                    label="创建人"
                    name="creatorName"
                    addonAfter={<Button onClick={() => { window.open(url.frontUrl.humanResource + content.creator) }}>查看</Button>}
                />
            </ProForm>
        </div>
    )

    return (
        <div
            style={{
                background: '#F5F7FA',
            }}
        >
            <PageContainer

                fixedHeader
                header={{
                    title: content.contentName,
                    breadcrumb: {
                        items: [
                            {
                                title: "目录模块",
                            },
                            {
                                title: content.contentName,
                            },
                        ],
                    },
                    extra: [
                        <Button key='1' type='primary' onClick={upDateContent}>保存</Button>,
                        <Button key='2' type='default' danger onClick={deleteContent}>删除</Button>
                    ]
                }}

                tabList={[
                    {
                        tab: '基本信息',
                        key: '1',
                        children: contentBase
                    },
                    {
                        tab: '下级目录',
                        key: '2',
                        children: (<BackContent leadContent={contentId} />)
                    },
                    {
                        tab: '权限信息',
                        key: '3',
                        children: (<div style={{ height: "80vh" }}>
                            <Tabs
                                style={{ background: "#fdfdfd" }}
                                tabBarStyle={{ borderBlockColor: "#f7f7f7", border: "3sp" }}
                                // tabBarGutter={3}
                                tabPosition='left'

                                items={[
                                    {
                                        key: "create",
                                        label: (<span style={{ writingMode: "vertical-lr" }}>创建权限</span>),
                                        children: (<AuthorityEdit entity={content} authorityName='defaultCreate' />)
                                    },
                                    {
                                        key: "share",
                                        label: (<span style={{ writingMode: "vertical-lr" }}>共享权限</span>),
                                        children: (<AuthorityEdit entity={content} authorityName='defaultShare' />)
                                    },
                                    {
                                        key: "edit",
                                        label: (<span style={{ writingMode: "vertical-lr" }}>编辑权限</span>),
                                        children: (<AuthorityEdit entity={content} authorityName='defaultEdit' />)
                                    }, {
                                        key: "delete",
                                        label: (<span style={{ writingMode: "vertical-lr" }}>删除权限</span>),
                                        children: (<AuthorityEdit entity={content} authorityName='defaultDelete' />)
                                    }
                                ]}
                            ></Tabs>

                        </div>)
                    },
                ]}
            >
            </PageContainer>
        </div>)
};

export default BackContentConcrete