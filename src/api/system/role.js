import request from '@/utils/request'
const URL_SUFFIX = "/system/role"

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
    method: 'put',
    data
  })
}

export function updateSate(id, state) {
  return request({
    url: URL_SUFFIX + '/' + state,
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

