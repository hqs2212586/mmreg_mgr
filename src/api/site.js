import request from '@/utils/request'

// 获取所有的站点
export function getSites() {
  return request({
    url: 'api/crm/sites/',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/crm/sites/',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/crm/sites/' + id + '/',
    method: 'delete'
  })
}

export function edit(id, data) {
  return request({
    url: 'api/crm/sites/' + id + '/',
    method: 'put',
    data
  })
}

export function retrieve(id) {
  return request({
    url: 'api/crm/sites/' + id + '/',
    method: 'get'
  })
}

export function save(id, data) {
  return request({
    url: 'api/crm/sites/' + id + '/',
    method: 'patch',
    data
  })
}
