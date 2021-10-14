import request from '@/utils/request'
const URL_SUFFIX = '/dashboard/charts'

export function list(params) {
  return request({
    url: URL_SUFFIX,
    method: 'GET',
    params
  })
}

export function create(data) {
  return request({
    url: URL_SUFFIX,
    method: 'POST',
    data
  })
}

export function detail(id) {
  return request({
    url: URL_SUFFIX + '/' + id,
    method: 'GET'
  })
}
export function refresh(id) {
  return request({
    url: URL_SUFFIX + '/' + id + '/refresh',
    method: 'GET'
  })
}

export function update(data) {
  return request({
    url: URL_SUFFIX,
    method: 'PUT',
    data
  })
}

export function deleteById(id) {
  return request({
    url: URL_SUFFIX + '/' + id,
    method: 'DELETE'
  })
}

export function tables() {
  return request({
    url: URL_SUFFIX + '/table',
    method: 'GET'
  })
}

export function tableFields(params) {
  return request({
    url: URL_SUFFIX + '/table/field',
    params,
    method: 'GET'
  })
}
