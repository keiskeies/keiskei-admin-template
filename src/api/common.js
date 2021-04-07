import request from '@/utils/request'

export function getBaseList(url, params) {
  return request({
    url: url,
    method: 'GET',
    params
  })
}

export function getBaseDetail(url, id) {
  return request({
    url: url + '/' + id,
    method: 'GET'
  })
}

export function getBaseOptions(url, params) {
  return request({
    url: url + '/options',
    method: 'GET',
    params
  })
}

export function addBase(url, data) {
  return request({
    url: url,
    method: 'POST',
    data
  })
}

export function editBase(url, data) {
  return request({
    url: url,
    method: 'PUT',
    data
  })
}

export function changeBaseSort(url, data) {
  return request({
    url: url + '/sort',
    method: 'PUT',
    data
  })
}

export function deleteBase(url, id) {
  return request({
    url: url + '/' + id,
    method: 'DELETE'
  })
}

export function getDataDict() {
  return request({
    url: '/common/dictionary/options',
    method: 'GET'
  })
}

