import request from '@/utils/request'

// 获取所有的学校
export function getSchools() {
  return request({
    url: 'api/crm/schools/',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/crm/schools/',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/crm/schools/' + id + '/',
    method: 'delete'
  })
}

export function edit(id, data) {
  return request({
    url: 'api/crm/schools/' + id + '/',
    method: 'put',
    data
  })
}

export function retrieve(id) {
  return request({
    url: 'api/crm/schools/' + id + '/',
    method: 'get'
  })
}

export function save(id, data) {
  return request({
    url: 'api/crm/schools/' + id + '/',
    method: 'patch',
    data
  })
}
