import request from '@/utils/request'

// 获取所有的学习批次
export function getGrades() {
  return request({
    url: 'api/crm/grades/',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/crm/grades/',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/crm/grades/' + id + '/',
    method: 'delete'
  })
}

export function edit(id, data) {
  return request({
    url: 'api/crm/grades/' + id + '/',
    method: 'put',
    data
  })
}

export function retrieve(id) {
  return request({
    url: 'api/crm/grades/' + id + '/',
    method: 'get'
  })
}

export function save(id, data) {
  return request({
    url: 'api/crm/grades/' + id + '/',
    method: 'patch',
    data
  })
}
