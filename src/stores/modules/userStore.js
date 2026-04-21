import {defineStore} from 'pinia'
import {ref} from 'vue'
import {userInfoApi} from '@/api/user/index.js'
export const userStore = defineStore('userStore', () => {

        const userToken = ref("")

        const userInfo = ref({})

        const getToken = () => userToken.value

        const setToken = (tokenReq) => {
            userToken.value = tokenReq
        }
        const clearToken = () => {
            userToken.value = ""
        }
        const getUserInfo =async () => {
            const res = await userInfoApi()
            userInfo.value = res.data
            return userInfo.value
        }
        const setUserInfo = (userReq) => {
            userInfo.value = userReq
        }

        const clearUserInfo = () => {
            userInfo.value = {}
        }

        return {
            userToken,
            userInfo,
            getToken,
            setToken,
            clearToken,
            getUserInfo,
            setUserInfo,
            clearUserInfo
        }
    }, {
        persist: true
    }
)