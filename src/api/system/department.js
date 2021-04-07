import request from '@/utils/request'
const URL_SUFFIX = '/system/department'

export function getOptions(params) {
  return request({
    url: URL_SUFFIX + '/options',
    method: 'get',
    params
  })
}

export function create(data) {
  return request({
    url: URL_SUFFIX,
    method: 'post',
    data
  })
}

export function detail(id) {
  return request({
    url: URL_SUFFIX + '/' + id,
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: URL_SUFFIX,
    method: 'PUT',
    data
  })
}

export function updateSate(id, state) {
  return request({
    url: '/security/sysUser/' + state,
    method: 'patch',
    data: {
      id: id
    }
  })
}

export function deleteById(id) {
  return request({
    url: URL_SUFFIX + '/' + id,
    method: 'delete'
  })
}

// 修改用户密码
export function updatePassword(data) {
  return request({
    url: '/security/sysUser/updatePassword',
    method: 'patch',
    data
  })
}

// 重置用户密码
export function resetPassword(data) {
  return request({
    url: '/security/sysUser/resetPassword',
    method: 'patch',
    data
  })
}

