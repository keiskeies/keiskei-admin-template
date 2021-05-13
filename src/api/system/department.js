import request from '@/utils/request'
const URL_SUFFIX = '/system/department'

export function getOptions(params) {
  return request({
    url: URL_SUFFIX + '/options',
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


