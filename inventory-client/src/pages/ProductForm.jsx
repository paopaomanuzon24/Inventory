import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Upload } from 'lucide-react'
import { useCategories, useUnits, useSaveProduct } from '../hooks/useProducts'
import { getProduct } from '../api/products'

const schema = z.object({
  name:            z.string().min(1),
  sku:             z.string().min(1),
  barcode:         z.string().optional(),
  category_id:     z.string().min(1, 'Required'),
  unit_id:         z.string().min(1, 'Required'),
  cost_price:      z.coerce.number().min(0),
  sell_price:      z.coerce.number().min(0),
  alert_threshold: z.coerce.number().min(0),
  status:          z.enum(['active', 'inactive']),
  description:     z.string().optional(),
})

export default function ProductForm() {
  const { id } = useParams()   // undefined = create, "123" = edit
  const navigate = useNavigate()
  const isEdit   = Boolean(id)
  const [preview, setPreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)

  const { data: catData } = useCategories()
  const { data: unitData } = useUnits()
  const categories = catData?.data || []
  const units = unitData || []

  const { data: productData } = useQuery({
    queryKey: ['product', id],
    queryFn:  () => getProduct(id),
    enabled:  isEdit,
  })
  const product = productData?.data

  const save = useSaveProduct(id)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { status: 'active', cost_price: 0, sell_price: 0, alert_threshold: 5 }
  })

  // Prefill form when editing
  useEffect(() => {
    if (product) {
      reset({
        name:            product.name,
        sku:             product.sku,
        barcode:         product.barcode || '',
        category_id:     String(product.category?.id || ''),
        unit_id:         String(product.unit?.id || ''),
        cost_price:      product.cost_price,
        sell_price:      product.sell_price,
        alert_threshold: product.alert_threshold,
        status:          product.status,
        description:     product.description || '',
      })
      if (product.image_url) setPreview(product.image_url)
    }
  }, [product])

  const onSubmit = (values) => {
    const fd = new FormData()
    Object.entries(values).forEach(([k, v]) => {
      if (v !== undefined && v !== '') fd.append(k, v)
    })
    if (imageFile) fd.append('image', imageFile)
    save.mutate(fd, { onSuccess: () => navigate('/products') })
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const Field = ({ label, error, children }) => (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  )

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">{isEdit ? 'Edit product' : 'New product'}</h1>
        <button onClick={() => navigate('/products')} className="text-sm text-gray-500 hover:text-gray-700">
          Cancel
        </button>
      </div>

      {save.isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
          {save.error?.response?.data?.message || 'Save failed. Check the fields below.'}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Product name" error={errors.name}>
            <input {...register('name')} className={inputCls} />
          </Field>
          <Field label="SKU" error={errors.sku}>
            <input {...register('sku')} className={inputCls} placeholder="e.g. LAP-001" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Category" error={errors.category_id}>
            <select {...register('category_id')} className={inputCls}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Unit" error={errors.unit_id}>
            <select {...register('unit_id')} className={inputCls}>
              <option value="">Select unit</option>
              {units.map(u => <option key={u.id} value={u.id}>{u.name} ({u.abbreviation})</option>)}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Cost price" error={errors.cost_price}>
            <input type="number" step="0.01" {...register('cost_price')} className={inputCls} />
          </Field>
          <Field label="Sell price" error={errors.sell_price}>
            <input type="number" step="0.01" {...register('sell_price')} className={inputCls} />
          </Field>
          <Field label="Low stock alert" error={errors.alert_threshold}>
            <input type="number" {...register('alert_threshold')} className={inputCls} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Barcode" error={errors.barcode}>
            <input {...register('barcode')} className={inputCls} placeholder="Optional" />
          </Field>
          <Field label="Status" error={errors.status}>
            <select {...register('status')} className={inputCls}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>
        </div>

        <Field label="Description">
          <textarea {...register('description')} rows={3}
            className={inputCls + ' resize-none'} />
        </Field>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Product image</label>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-gray-300 transition-colors">
            {preview ? (
              <img src={preview} className="w-24 h-24 object-cover rounded-lg" />
            ) : (
              <><Upload size={20} className="text-gray-400 mb-2" />
               <span className="text-sm text-gray-400">Click to upload</span>
               <span className="text-xs text-gray-300 mt-1">JPG, PNG, WebP — max 2MB</span></>
            )}
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate('/products')}
            className="px-6 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={save.isPending}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50">
            {save.isPending ? 'Saving...' : isEdit ? 'Update product' : 'Create product'}
          </button>
        </div>
      </form>
    </div>
  )
}