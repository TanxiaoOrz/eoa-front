import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { FileOut, HumanOut, RequestDtoOut, WorkflowNodeOut } from "../../const/out";
import { RequestAction, UpdateData, getDataList, getDataOne } from "../../const/http";
import config from "../../const/config";
import PageWait from "../../componet/PageWait";
import React from "react";
import { Avatar, Button, Divider, Flex, Layout, message, notification, Typography } from "antd";
import FrontFormConcrete, { getFormIn } from "../TableModule/front_form_concrete";
import url from "../../const/url";
import { ProCard } from "@ant-design/pro-components";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { UserOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

const { Title } = Typography

type Commit = {
    nodeId: number
    nodeName: string
    humamId: number
    time: string
    operation: number
    comment: string
}

const getRequestIn = (request: RequestDtoOut, comment: string, action: number = -1) => {
    if (comment === "")
        comment = translateAction(action)
    return {
        requestId: request.requestOut.requestId,
        nodeId: request.currentNode.dataId,
        workflowId: request.currentNode.workflowId,
        form: getFormIn(request.formOut),
        comment
    }
}

const translateAction = (action: number) => {
    switch (action) {
        case 0:
            return "创建"
        case 1:
            return "提交"
        case 2:
            return "批准"
        case 3:
            return "退回"
        case 4:
            return "流转"
        default:
            return "保存"
    }
}

const HistroyCommit = (prop: { commit: Commit }) => {
    const [human, setHuman] = useState<HumanOut>()
    const [avater, setAvater] = useState<string>()
    useEffect(() => {
        if (human === undefined)
            getDataOne(config.fronts.human + "/" + prop.commit.humamId).then((value) => {
                if (value.success) {
                    setHuman(value.data)
                    if ((value.data as HumanOut).phone)
                        getDataOne(config.fronts.file + "/" + (value.data as HumanOut).phone).then((valueF) => {
                            if (valueF.success)
                                setAvater((valueF.data as FileOut).fileRoute)
                        })
                }
            })
    })
    let avaters: React.JSX.Element[] = []
    if (avater)
        avaters.push(<Avatar style={{ width: "100%" }} shape="square" size={64} src={config.backUrl + avater} />)
    else
        avaters.push(<Avatar style={{ width: "100%" }} shape="square" size={64} icon={<UserOutlined />} />)

    avaters.push(
        <Divider>
            <Button
                type="link"
                onClick={() => {
                    window.open(url.frontUrl.humanResource + human?.dataId)
                }}>
                {human?.name}
            </Button>
        </Divider>
    )

    avaters.push(
        <Button
            type="link"
            onClick={() => {
                window.open(url.frontUrl.depart_concrete + human?.depart)
            }}>
            {human?.departName}
        </Button>
    )

    return (
        <ProCard
            title={human?.name + " :  " + translateAction(prop.commit.operation)}
            extra={prop.commit.time}
            headerBordered>
            <Layout>
                <Sider width={"20%"}>
                    {avaters}
                </Sider>
                <Content>
                    <Title level={5}>{"节点: " + prop.commit.nodeName}</Title>
                    <blockquote>{prop.commit.comment}</blockquote>
                </Content>
            </Layout>
        </ProCard>

    )
}

const RequestConcrete = () => {
    const query = new URLSearchParams(useLocation().search);
    const params = useParams()
    const [requestDto, setRequestDto] = useState<RequestDtoOut>()
    const [api, contextHolder] = notification.useNotification();
    const workflowId = query.get("workflowId")
    let comment: string = ''
    useEffect(() => {
        if (requestDto === undefined) {
            let requestId = params.requestId
            getDataOne(config.fronts.request + "/" + requestId + "?workflowId=" + workflowId).then((value) => {
                if (value.success)
                    setRequestDto(value.data)
            })
        }
    })


    if (requestDto === undefined)
        return <PageWait />

    let actionButtons: React.JSX.Element[]
    switch (requestDto.currentNode.nodeType) {
        case 0: {
            actionButtons = [
                <Button
                    key='create'
                    type='primary'
                    style={{ margin: "3px" }}
                    onClick={() => {
                        RequestAction(config.backs.request + "?onlySave=false&action=0", getRequestIn(requestDto, comment, 0)).then((value) => {
                            if (value)
                                api.open({
                                    message: '流程创建成功',
                                    duration: 0,
                                    btn: <Button type='primary' onClick={window.close}>确认并关闭</Button>
                                });
                        })
                    }}
                >创建</Button>,
                <Button
                    key='create'
                    type='primary'
                    style={{ margin: "3px" }}
                    onClick={() => {
                        RequestAction(config.backs.request + "?onlySave=true&action=0", getRequestIn(requestDto, comment)).then((value) => {
                            if (value)
                                api.open({
                                    message: '保存成功',
                                    duration: 0,
                                    btn: <Button type='primary' onClick={() => { window.location.assign(url.frontUrl.request_concrete + value[0] + "?workflowId=" + query.get("workflowId")) }}>确认</Button>
                                });

                        })
                    }} >保存</Button>,
            ]
            break
        }
        case 1: {
            actionButtons = [
                <Button
                    key='admit'
                    type='primary'
                    style={{ margin: "3px" }}
                    onClick={() => {
                        RequestAction(config.backs.request + "?onlySave=false&action=2", getRequestIn(requestDto, comment, 2)).then((value) => {
                            if (value)
                                api.open({
                                    message: '流程批准成功',
                                    duration: 0,
                                    btn: <Button type='primary' onClick={window.close}>确认并关闭</Button>
                                });
                        })
                    }}
                >批准</Button>,
                <Button
                    key='create'
                    type='primary'
                    danger
                    style={{ margin: "3px" }}
                    onClick={() => {
                        RequestAction(config.backs.request + "?onlySave=false&action=3", getRequestIn(requestDto, comment, 3)).then((value) => {
                            if (value)
                                api.open({
                                    message: '流程退回成功',
                                    duration: 0,
                                    btn: <Button type='primary' onClick={window.close}>确认并关闭</Button>
                                });
                        })
                    }}
                >退回</Button>,
                <Button
                    key='create'
                    type='primary'
                    style={{ margin: "3px" }}
                    onClick={() => {
                        RequestAction(config.backs.request + "?onlySave=true&action=2", getRequestIn(requestDto, comment)).then((value) => {
                            if (value)
                                api.open({
                                    message: '保存成功',
                                    duration: 0,
                                    btn: <Button type='primary' onClick={() => { window.location.assign(url.frontUrl.request_concrete + value[0] + "?workflowId=" + query.get("workflowId")) }}>确认</Button>
                                });

                        })
                    }} >保存</Button>,
            ]
            break
        }
        case 2: {
            actionButtons = [
                <Button
                    key='create'
                    type='primary'
                    style={{ margin: "3px" }}
                    onClick={() => {
                        RequestAction(config.backs.request + "?onlySave=false&action=1", getRequestIn(requestDto, comment, 1)).then((value) => {
                            if (value)
                                api.open({
                                    message: '流程提交成功',
                                    duration: 0,
                                    btn: <Button type='primary' onClick={window.close}>确认并关闭</Button>
                                });
                        })
                    }}
                >提交</Button>,
                <Button
                    key='create'
                    type='primary'
                    style={{ margin: "3px" }}
                    onClick={() => {
                        RequestAction(config.backs.request + "?onlySave=true&action=1", getRequestIn(requestDto, comment)).then((value) => {
                            if (value)
                                api.open({
                                    message: '保存成功',
                                    duration: 0,
                                    btn: <Button type='primary' onClick={() => { window.location.assign(url.frontUrl.request_concrete + value[0] + "?workflowId=" + query.get("workflowId")) }}>确认</Button>
                                });

                        })
                    }} >保存</Button>,
            ]
            break
        }
        default: actionButtons = [<div></div>]
    }

    let commentGroup: React.JSX.Element
    if (requestDto.currentNode.nodeType != 3)
        commentGroup = (
            <div style={{ background: "#ffffff", padding: "5px", margin: "5px" }}>
                <Title level={4}>  签字意见:</Title>
                <TextArea
                    showCount
                    maxLength={100}
                    onChange={(e) => {
                        comment = e.target.value
                    }}
                    placeholder="请输入签字意见"
                    style={{ height: 120, resize: 'none' }}
                />
            </div>
        )

    const baseStyle: React.CSSProperties = {
        width: '25%',
    };

    const editObject = JSON.parse(requestDto.currentNode.tableModifyAuthority)
    const defaultEdit = requestDto.currentNode.nodeType === 0 ||requestDto.currentNode.nodeType === 1

    const editableFun = (str:string) => {
        let strEditFromObject = editObject[str]
        if (defaultEdit !== undefined)
            return strEditFromObject as boolean
        else
            return defaultEdit
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px", }}>
                <div style={{ display: 'flex' }}>
                    <Title level={2} style={{ color: 'GrayText', marginLeft: '10px', marginBottom: '15px' }}>{requestDto.requestOut.requestTitle + " - " + requestDto.currentNode.workflowName}</Title>
                </div>
            </Header>
            <Flex vertical={false} style={{ background: "#ffffff", padding: "10px" }}>{Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ ...baseStyle }} />
            ))}{actionButtons}<div style={{ width: "2.5%" }}></div></Flex>
            <Content style={{ padding: '15px 50px', minHeight: '100%', overflowY: 'auto' }}>
                <FrontFormConcrete formOut={requestDto.formOut} getEdit={editableFun} />
            </Content>
        </Layout>
    )

}