import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { RequestDtoOut } from "../../const/out";
import { RequestAction, UpdateData, getDataOne } from "../../const/http";
import config from "../../const/config";
import PageWait from "../../componet/PageWait";
import React from "react";
import { Button, message, notification } from "antd";
import { getFormIn } from "../TableModule/front_form_concrete";
import url from "../../const/url";


const getRequestIn = (request: RequestDtoOut, comment: string | null) => {
    return {
        requestId: request.requestOut.requestId,
        nodeId: request.currentNode.dataId,
        workflowId: request.currentNode.workflowId,
        form: getFormIn(request.formOut),
        comment
    }
}

const getDoneHistory = () => {
    
}

const RequestConcrete = () => {
    const query = new URLSearchParams(useLocation().search);
    const params = useParams()
    const [requestDto, setRequestDto] = useState<RequestDtoOut>()
    const [api, contextHolder] = notification.useNotification();
    useEffect(() => {
        if (requestDto === undefined) {
            let requestId = params.requestId
            let workflowId = query.get("workflowId")
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
                        RequestAction(config.backs.request + "?onlySave=false&action=0", getRequestIn).then((value) => {
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
                        RequestAction(config.backs.request + "?onlySave=true&action=0", getRequestIn).then((value) => {
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
                        RequestAction(config.backs.request + "?onlySave=false&action=2", getRequestIn).then((value) => {
                            if (value)
                                api.open({
                                    message: '流程批准成功',
                                    duration: 0,
                                    btn: <Button type='primary' onClick={window.close}>确认并关闭</Button>
                                });
                        })
                    }}
                >创建</Button>,
                <Button
                    key='create'
                    type='danger'
                    style={{ margin: "3px" }}
                    onClick={() => {
                        RequestAction(config.backs.request + "?onlySave=false&action=3", getRequestIn).then((value) => {
                            if (value)
                                api.open({
                                    message: '流程退回成功',
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
                        RequestAction(config.backs.request + "?onlySave=true&action=2", getRequestIn).then((value) => {
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
                        RequestAction(config.backs.request + "?onlySave=false&action=1", getRequestIn).then((value) => {
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
                        RequestAction(config.backs.request + "?onlySave=true&action=0", getRequestIn).then((value) => {
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
        default : actionButtons = [<div></div>]
    }

    

}