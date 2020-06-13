import request from '@/utils/request'

// 获取所有的报名学生
export function getStudents() {
  return request({
    url: 'api/crm/students/',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/crm/students/',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/crm/students/' + id + '/',
    method: 'delete'
  })
}

export function edit(id, data) {
  return request({
    url: 'api/crm/students/' + id + '/',
    method: 'put',
    data
  })
}

export function retrieve(id) {
  return request({
    url: 'api/crm/students/' + id + '/',
    method: 'get'
  })
}

export function save(id, data) {
  return request({
    url: 'api/crm/students/' + id + '/',
    method: 'patch',
    data
  })
}
