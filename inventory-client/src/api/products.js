import api from './axios'

export const getProducts = (params) =>
  api.get('/products', { params }).then(r => r.data)

export const getProduct  = (id) =>
  api.get(`/products/${id}`).then(r => r.data)

export const getUnits    = () =>
  api.get('/units').then(r => r.data)

export const createProduct = (formData) =>
  api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data)

export const updateProduct = (id, formData) => {
  // Laravel doesn't parse PUT multipart — spoof with _method
  formData.append('_method', 'PUT')
  return api.post(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data)
}

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`).then(r => r.data)
