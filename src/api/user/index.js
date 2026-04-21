import {request} from '@/utils/request.js'


export const userLogin = (loginReq)=>{
    return request('/login','POST',loginReq)
}

export const userRegister = (registerReq)=>{
    return request('/register','POST',registerReq)
}

export const userInfoApi = ()=>{
    return request('/userInfo','GET')
}
