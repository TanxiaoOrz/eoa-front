import axios from 'axios'
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
    return config
})

service.interceptors.response.use((response) =>{
    localStorage.setItem("tokens",response.headers['tokens'])
    return response
})


export const getDataList = async (url:string) => {
    let response = await service.get(url);
    let data:Data=response.data;
    if (data.code == 0) {
        return {
            data:data.entity,
            success:true,
            total:data.entity.length
        }
    }else {
        message.error(data.description)
        return {
            data:null,
            success:false,
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

export const deleteData =async (url:string):Promise<boolean> => {
    let response = await service.delete(url);
    let data:Data = response.data;
    if (data.code == 0) {
        message.info(data.entity)
        return true
    } else {
        message.error(data.description)
        return false;
    }
}


export const newData =async (url:string,params:any):Promise<boolean> => {
    let response = await service.post(url,params);
    let data:Data = response.data;
    if (data.code == 0) {
        message.info(data.entity)
        return true
    } else {
        message.error(data.description)
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
        return {
            data:data.description,
            success:false,
        }
    }
}