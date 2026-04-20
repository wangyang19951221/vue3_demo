import {defineStore} from 'pinia'


export const userStore = defineStore('userStore',()=>{

    const getToken =()=> localStorage.getItem("token")
    const setToken = (tokenReq)=>{
        localStorage.setItem("token",tokenReq)
    }
    return {
        getToken,
        setToken
    }
})