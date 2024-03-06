import axios from 'axios'
import config from './config.js';
import { Button, message, notification } from 'antd';
import React from 'react';
import url from './url.js';

type Data = {
    code:number
    description:string
    entity:any
    newToken:string[]
}

const service = axios.create({   // 添加自定义配置新的axios
    baseURL: config.backUrl,  // 请求接口路径
    timeout: 20000 // 设置接口超时20s
})

const login = axios.create({
    baseURL: config.backUrl,  // 请求接口路径
    timeout: 20000 // 设置接口超时20s
})

const errorMessage = (code:number,messageString:string) => {
    switch (code) {
        case 2:
        case 3:     
            message.error(messageString+",请联系管理员")
            break
        case -1:
            message.warning(messageString)
            message.warning("请联系管理员添加权限")
        default:
            message.info(messageString)
    }
       
    
        
}

service.interceptors.request.use(config =>{
    config.headers['tokens'] = localStorage.getItem('tokens')
    console.log("up")
    return config
})

service.interceptors.response.use((response) =>{
    if (response.data.code != -1)
        localStorage.setItem("tokens",response.headers['tokens'])
    else
        window.location.replace("/login")
    return response
})


export const getDataList = async (url:string,params:any = {current:1,pageSize:100}) => {
    let s:string = new URLSearchParams(params).toString();
    let urlSend = (url+"?"+s);
    console.log(urlSend);
    console.trace()
    let response = await service.get(urlSend);
    let data:Data=response.data;
    console.log(data);
    if (data.code == 0) {
        let returns = {
            data:data.entity,
            success:true,
            total:parseInt(data.description)
        }
        //console.log(returns)
        return returns
    }else {
        errorMessage(data.code,data.description)
        console.log("httpFailure",url,params)
        return {
            data:[],
            success:true,
            total:0
        }
    }
}

export const getDataOne =async (url:string) => {
    let response = await service.get(url);
    let data:Data=response.data;
    if (data.code == 0) {
        return {
            data:data.entity,
            success:true,
        }
    }else {
        errorMessage(data.code,data.description)
        console.log("httpFailure",url)
        return {
            data:null,
            success:false,
        }
    }
}

export const UpdateData =async (url:string,params:any):Promise<boolean> => {
    let response = await service.put(url,params);
    let data:Data = response.data;
    if (data.code == 0) {
        message.success(data.entity)
        return true
    } else {
        errorMessage(data.code,data.description)
        console.log("httpFailure",url,params)
        return false;
    }
}

export const deleteData =async (url:string,params:any = null):Promise<boolean> => {
    let urlSend = url
    if (params !=null){
        let s:string = new URLSearchParams(params).toString();
        urlSend += ("?"+s)
    }
    console.log(urlSend)
    let response = await service.delete(urlSend);
    let data:Data = response.data;
    if (data.code == 0) {
        message.success(data.entity)
        return true
    } else {
        errorMessage(data.code,data.description)
        console.log("httpFailure",url,params)
        return false;
    }
}


export const newData =async (url:string,params:any):Promise<number> => {
    let response = await service.post(url,params);
    let data:Data = response.data;
    if (data.code == 0) {
        message.success(data.description)
        return data.entity
    } else {
        errorMessage(data.code,data.description)
        console.log("httpFailure",url,params)
        return -1;
    }
}

export const RequestAction =async (urlask:string,params:any):Promise<number|false> => {
    let response = await service.put(urlask,params);
    let data:Data = response.data;
    console.log(data)
    if (data.code == 0) {
        return data.entity
    } else {
        notification.warning({
            message: '操作失败',
            duration: 0,
            description: data.description,
            btn: <Button type='primary' href={url.frontUrl.request_concrete+data.entity}>确认</Button>
        });
        console.log("httpFailure",urlask,params)
        return false;
    }
}

export const loginPost = async (url,params) => {
    let response = await login.post(url,params);
    let data:Data = response.data;
    console.log(data.description)
    if (data.code == 0) {
        return {
            data:data.entity,
            success:true,
        }
    }else {
        errorMessage(data.code,data.description)
        console.log("httpFailure",url,params)
        return {
            data:data.description,
            success:false,
        }
    }
}