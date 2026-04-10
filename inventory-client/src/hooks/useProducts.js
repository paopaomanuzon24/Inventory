import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as productsApi from '../api/products'
import * as categoriesApi from '../api/categories'

export const useProducts = (params) =>
  useQuery({
    queryKey: ['products', params],
    queryFn:  () => productsApi.getProducts(params),
    keepPreviousData: true, // no flicker on filter/page change
  })

export const useCategories = () =>
  useQuery({ queryKey: ['categories'], queryFn: categoriesApi.getCategories })

export const useUnits = () =>
  useQuery({ queryKey: ['units'], queryFn: productsApi.getUnits })

export const useDeleteProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: productsApi.deleteProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
}

export const useSaveProduct = (id) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (fd) => id
      ? productsApi.updateProduct(id, fd)
      : productsApi.createProduct(fd),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
}