import axios from 'axios'
import { userStore } from '@/stores'
import { ElMessage } from 'element-plus'
const BASE_URL = 'http://localhost:3000'

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000
})

instance.interceptors.request.use((config) => {
  const { getToken } = userStore()
  config.headers.authorization = getToken() || ''
  return config
})

instance.interceptors.response.use(
  (response) => {
    if(response.data.code === 200){
      return response.data
    }else {
      ElMessage.error(response.data.msg)
      return Promise.reject(response.data.msg)
    }
    response.data},
  (error) => Promise.reject(error.message)
)

export const request = (uri, method, data = {}) => {
  const normalizedMethod = method.toLowerCase()

  return instance({
    url: uri,
    method: normalizedMethod,
    params: normalizedMethod === 'get' ? data : undefined,
    data: normalizedMethod !== 'get' ? data : undefined
  })
}
