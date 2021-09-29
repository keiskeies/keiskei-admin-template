import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 3600000 // request timeout
})
service.defaults.withCredentials = true
// request interceptor
service.interceptors.request.use(
  config => {
    if (config.method.toLowerCase() === 'get') {
      const params = config.params || {}
      params._ = new Date().getTime()
      config.params = params
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.type && res.type === 'application/glob') {
      return response
    }
    if (res.code) {
      if (res.code === 400201) {
        store.dispatch('user/logout')
        MessageBox.confirm(res.msg, '会话超时', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/logout').then(res => {
            location.reload()
          })
        })
      } else if (res.code === 400207) {
        MessageBox.confirm(res.msg, '第一次登陆或长时间未修改密码', {
          confirmButtonText: '前往修改',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          window.location.href = '#/person/center'
        })
      } else {
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    // store.dispatch('user/logout')
    Message({
      message: error.msg || 'Error',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
