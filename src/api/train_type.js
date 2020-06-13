import request from '@/utils/request'

// 获取所有的培养类型
export function getTrainType() {
  return request({
    url: 'api/crm/train_types/',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/crm/train_types/',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/crm/train_types/' + id + '/',
    method: 'delete'
  })
}

export function edit(id, data) {
  return request({
    url: 'api/crm/train_types/' + id + '/',
    method: 'put',
    data
  })
}

export function retrieve(id) {
  return request({
    url: 'api/crm/train_types/' + id + '/',
    method: 'get'
  })
}

export function save(id, data) {
  return request({
    url: 'api/crm/train_types/' + id + '/',
    method: 'patch',
    data
  })
}
