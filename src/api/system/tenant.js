import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-system/tenant/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/blade-system/tenant/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-system/tenant/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-system/tenant/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-system/tenant/submit',
    method: 'post',
    data: row
  })
}

export const setting = (ids, form) => {
  return request({
    url: '/api/blade-system/tenant/setting',
    method: 'post',
    params: {
      ...form,
      ids
    }
  })
}

export const info = (domain) => {
  return request({
    url: '/api/blade-system/tenant/info',
    method: 'get',
    params: {
      domain
    }
  })
}
