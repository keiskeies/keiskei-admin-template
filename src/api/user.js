import request from '@/utils/request'
import qs from 'qs'

// 用户登录
export function login(data) {
  return request({
    url: '/system/login',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(data)
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: '/system/self',
    method: 'get'
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/system/logout',
    method: 'get'
  })
}
// 修改用户密码
export function update(data) {
  return request({
    url: '/system/self',
    method: 'put',
    data
  })
}

// 修改用户密码
export function updatePassword(data) {
  return request({
    url: '/system/self',
    method: 'PATCH',
    data
  })
}

