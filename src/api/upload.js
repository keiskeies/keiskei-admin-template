import request from '@/utils/request'

const UPLOAD_BASE_URL = '/file'

export function uploadWithProgress(data) {
  return request({
    url: UPLOAD_BASE_URL + '/uploadWithProgress',
    method: 'post',
    data
  })
}

export function uploadPart(data) {
  return request({
    url: UPLOAD_BASE_URL + '/uploadPart',
    method: 'post',
    data
  })
}

export function mergingChunks(data) {
  return request({
    url: UPLOAD_BASE_URL + '/mergingChunks',
    method: 'post',
    data
  })
}

export function progress(param) {
  return request({
    url: UPLOAD_BASE_URL + '/progress',
    method: 'get',
    param
  })
}

export function exist(val) {
  return request({
    url: UPLOAD_BASE_URL + '/exist/' + val,
    method: 'get'
  })
}

