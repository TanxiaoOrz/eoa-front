import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { FileOut, HumanOut, RequestDtoOut, WorkflowNodeOut } from "../../const/out.tsx";
import { RequestAction, deleteData, getDataList, getDataOne } from "../../const/http.tsx";
import config from "../../const/config.js";
import PageWait from "../../componet/PageWait.tsx";
import { Avatar, Button, Divider, Flex, Layout, Select, Tooltip, Typography, notification } from "antd";
import FrontFormConcrete from "../TableModule/front_form_concrete.tsx";
import url from "../../const/url.js";
import { ProCard } from "@ant-design/pro-components";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { UserOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

const { Title } = Typography

type Commit = {
    nodeId: number
    workflowNodeName: string
    humanId: number
    time: number
    operation: number
    comment: string
}

type FormIn = {
    tableId: number
    mains: any
    detailValueMapLists: any[][]
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

const translateTime = (stamp: number) => {
    let date = new Date(stamp);  // 参数需要毫秒数，所以这里将秒数乘于 1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = date.getMinutes() + ':';
    let s = date.getSeconds();
    return (Y + M + D + h + m + s);
}

const HistroyCommit = (prop: { commit: Commit }) => {
    const [human, setHuman] = useState<HumanOut>()
    const [avater, setAvater] = useState<string>()
    console.log("commit", prop.commit)
    useEffect(() => {
        if (human === undefined)
            getDataOne(config.fronts.human + "/" + prop.commit.humanId).then((value) => {
                if (value.success) {
                    setHuman(value.data)
                    if ((value.data as HumanOut).phone !== null)
                        getDataOne(config.fronts.file + "/" + (value.data as HumanOut).phone).then((valueF) => {
                            if (valueF.success)
                                setAvater((valueF.data as FileOut).fileRoute)
                        })
                }
            })
    })
    let avaters: React.JSX.Element[] = []
    if (avater)
        avaters.push(<Avatar style={{ width: "100%", marginTop: "15px" }} shape="square" size={64} src={config.backUrl + avater} />)
    else
        avaters.push(<Avatar style={{ width: "100%", marginTop: "15px" }} shape="square" size={64} icon={<UserOutlined />} />)

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
            extra={translateTime(prop.commit.time)}
            headerBordered>
            <Layout>
                <Sider width={"20%"} style={{ backgroundColor: "#ffffff" }}>
                    {avaters}
                </Sider>
                <Content style={{ backgroundColor: "#ffffff", marginLeft: "5px", paddingLeft: "20px" }}>
                    <Title level={5}>{"节点: " + prop.commit.workflowNodeName}</Title>
                    <blockquote>{prop.commit.comment}</blockquote>
                </Content>
            </Layout>
        </ProCard>

    )
}

const BackRequestConcrete = () => {
    const query = new URLSearchParams(useLocation().search);
    const params = useParams()
    const [requestDto, setRequestDto] = useState<RequestDtoOut>()
    const requestId = params.requestId
    const workflowId = query.get("workflowId")
    const [nodes, setNodes] = useState<WorkflowNodeOut[]>()
    const [humans, setHumans] = useState<HumanOut[]>()
    const flow: {
        nodeId: number | null
        comment: string | null
        receivers: number | null
    } = {
        nodeId: null,
        comment: null,
        receivers: null
    }
    useEffect(() => {
        if (requestDto === undefined) {
            getDataOne(config.backs.request + "/" + requestId + "?workflowId=" + workflowId).then((value) => {
                if (value.success)
                    setRequestDto(value.data)
            })
        }
    })
    useEffect(() => {
        if (nodes === undefined) {
            getDataList(config.backs.workflowNode, { workflowId, ...config.toBrowser }).then((value) => {
                if (value.success)
                    setNodes(value.data)
            })
        }
    })
    useEffect(() => {
        if (humans === undefined) {
            getDataList(config.backs.human, { ...config.toBrowser }).then((value) => {
                if (value.success)
                    setHumans(value.data)
            })
        }
    })

    const getFormIn: { get: () => FormIn | null } = { get: () => null }

    const getRequestIn = (request: RequestDtoOut, requestId: string) => {

        let requestIn = {
            requestId: requestId,
            workflowId: request.currentNode.workflowId,
            form: getFormIn.get(),
            ...flow
        }
        console.log("requestIn", requestIn)
        return requestIn
    }


    if (requestDto === undefined || requestId === undefined)
        return <PageWait />

    let actionButtons: React.JSX.Element[] = [
        <Button
            key={'flow'}
            type='primary'
            onClick={() => {
                let requestIn = getRequestIn(requestDto, requestId)
                RequestAction(config.backs.request, requestIn).then((value) => {
                    if (value !== false)
                        notification.success({
                            message: '强制流转成功',
                            duration: 0,
                            btn: <Button type='primary' onClick={window.close}>确认并关闭</Button>
                        });
                })
            }} >
            流转
        </Button>,
        <Button
            key='delete'
            danger
            onClick={() => {
                deleteData(config.backs.request + "/" + requestId)
            }} >
            删除
        </Button>

    ]

    let commentGroup: React.JSX.Element
    if (requestDto.currentNode.nodeType != 3)
        commentGroup = (
            <div style={{ background: "#ffffff", padding: "5px", margin: "5px" }}>
                <Title level={5}>  强制流转:</Title>
                <p>签字意见</p>
                <TextArea
                    showCount
                    maxLength={100}
                    onChange={(e) => {
                        flow.comment = e.target.value
                    }}
                    placeholder="请输入签字意见"
                    style={{ height: 120, resize: 'none' }}
                /> <br />
                <p>目标节点</p> <br />
                <Select
                    showSearch
                    filterOption={(input: string, option?: { label: string; value: string }) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={nodes?.map(value => { return { value: value.dataId.toString(), label: value.workflowNodeName } }) ?? []}
                    onChange={(e) => { flow.nodeId = e }}
                    placeholder='请选择目标节点' />
                <Tooltip placement="right" title='默认未节点定义操作者'>
                    <p>节点操作者</p>
                </Tooltip><br />
                <Select
                    showSearch
                    filterOption={(input: string, option?: { label: string; value: string }) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    mode="multiple"
                    options={humans?.map(value => { return { value: value.dataId.toString(), label: value.name } }) ?? []}
                    onChange={(e) => { flow.nodeId = e }}
                    placeholder='请选择操作者'
                />
            </div>
        )
    else
        commentGroup = <div></div>

    const baseStyle: React.CSSProperties = {
        width: '25%',
    };

    const editObject = JSON.parse(requestDto.currentNode.tableModifyAuthority)
    const defaultEdit = requestDto.currentNode.nodeType === 0 || requestDto.currentNode.nodeType === 1

    console.log(editObject)
    const editableFun = (str: string) => {
        let strEditFromObject = editObject[str]
        if (strEditFromObject !== undefined)
            return strEditFromObject as boolean
        else
            return defaultEdit
    }

    const commitHistorys: React.JSX.Element[] = []
    if (requestDto.requestOut?.doneHistory) {
        let doneHistory: Commit[] = JSON.parse(requestDto.requestOut.doneHistory)
        doneHistory.forEach((commit) => commitHistorys.unshift(<HistroyCommit commit={commit} />))
    }


    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px", }}>
                <div style={{ display: 'flex' }}>
                    <Title level={2} style={{ color: 'GrayText', marginLeft: '10px', marginBottom: '15px' }}>{requestDto.requestOut?.requestTitle ?? requestDto.workflow.workflowBaseTitle + " - " + requestDto.currentNode.workflowNodeName}</Title>
                </div>
            </Header>
            <Flex vertical={false} style={{ background: "#ffffff", padding: "10px" }}>{Array.from({ length: 4 }).map((_, i) => (
                <div key={i + "empty"} style={{ ...baseStyle }} />
            ))}{actionButtons}<div style={{ width: "2.5%" }}></div></Flex>
            <Content style={{ padding: '15px 50px', minHeight: '100%', overflowY: 'auto' }}>
                <FrontFormConcrete formOut={requestDto.formOut} getEdit={editableFun} getDetailAuthority={() => defaultEdit} setGetFunction={(fun) => { getFormIn.get = fun }} />
                {commentGroup}
                <div style={{ height: "10px" }} />
                {commitHistorys}
            </Content>
        </Layout>
    )

}

export default BackRequestConcrete