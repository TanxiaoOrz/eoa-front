import axios from 'axios'
import config from './config.js';

const service = axios.create({   // 添加自定义配置新的axios
    baseURL: config.backUrl,  // 请求接口路径
    timeout: 20000 // 设置接口超时20s
})

// service.interceptors.request.use(config =>{
//     config.headers['tokenShort'] = localStorage.getItem()
// })

var tokenShort = "";
var tokenLong = "";

function getStorageToken() {

}

function updateToken() {

}

export const getShowData = async (url,params) => {
    let response = await service.get(url,params);
    response=response.data;
    if (response.code == 0) {
        return {
            data:response.entity,
            success:true,
            total:response.entity.length
        }
    }else {
        return {
            data:null,
            success:false,
            total:0
        }
    }
}