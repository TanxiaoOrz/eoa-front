﻿import axios from 'axios'
import config from './config.js';
import { message } from 'antd';

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
    console.log(response.headers);
    console.log(response.headers.tokens);
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
        message.error(data.description)
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
        message.error(data.description)
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
        message.info(data.entity)
        return true
    } else {
        message.error(data.description)
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
        message.info(data.entity)
        return true
    } else {
        message.error(data.description)
        return false;
    }
}


export const newData =async (url:string,params:any):Promise<number> => {
    let response = await service.post(url,params);
    let data:Data = response.data;
    if (data.code == 0) {
        message.info(data.description)
        return data.entity
    } else {
        message.error(data.description)
        return -1;
    }
}

export const RequestAction =async (url:string,params:any):Promise<number[]> => {
    let response = await service.put(url,params);
    let data:Data = response.data;
    if (data.code == 0) {
        return data.entity
    } else {
        return [];
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
        return {
            data:data.description,
            success:false,
        }
    }
}