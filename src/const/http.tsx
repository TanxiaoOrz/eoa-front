import axios from 'axios'
import config from './config.js';

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
})

service.interceptors.response.use((response) =>{
    localStorage.setItem("tokens",response.headers['tokens'])
})


export const getShowData = async (url,params) => {
    let response = await service.get(url,params);
    let data:Data=response.data;
    if (data.code == 0) {
        return {
            data:data.entity,
            success:true,
            total:data.entity.length
        }
    }else {
        return {
            data:null,
            success:false,
            total:0
        }
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