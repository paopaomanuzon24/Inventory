import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import * as api from '../api/categories'

const schema = z.object({
  name:        z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  parent_id:   z.string().optional(),
})

export default function Categories() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState(null)    // null=closed, {}=new, {...}=edit
  const [deleting, setDeleting] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn:  api.getCategories
  })
  const categories = data?.data || []

  const save = useMutation({
    mutationFn: (values) => editing?.id
      ? api.updateCategory(editing.id, values)
      : api.createCategory(values),
    onSuccess: () => { qc.invalidateQueries(['categories']); setEditing(null) }
  })

  const remove = useMutation({
    mutationFn: api.deleteCategory,
    onSuccess: () => { qc.invalidateQueries(['categories']); setDeleting(null) }
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    values: editing ? {
      name:        editing.name        || '',
      description: editing.description || '',
      parent_id:   editing.parent_id   ? String(editing.parent_id) : '',
    } : undefined
  })

  const parents = categories.filter(c => !c.parent_id)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium">Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} total</p>
        </div>
        <button onClick={() => { reset(); setEditing({}) }}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800">
          <Plus size={15} /> Add category
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Parent</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Products</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {cat.parent ? (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{cat.parent.name}</span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{cat.products_count ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => setEditing(cat)}
                        className="text-gray-400 hover:text-gray-700 p-1">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleting(cat)}
                        className="text-gray-400 hover:text-red-500 p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing !== null && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-medium">{editing.id ? 'Edit category' : 'New category'}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-700"><X size={16}/></button>
            </div>
            <form onSubmit={handleSubmit((v) => save.mutate(v))} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input {...register('name')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Parent category <span className="text-gray-400">(optional)</span></label>
                <select {...register('parent_id')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300">
                  <option value="">None (top-level)</option>
                  {parents.filter(p => p.id !== editing.id).map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <textarea {...register('description')} rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditing(null)}
                  className="flex-1 border border-gray-200 rounded-lg py-2 text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={save.isPending}
                  className="flex-1 bg-gray-900 text-white rounded-lg py-2 text-sm hover:bg-gray-800 disabled:opacity-50">
                  {save.isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
              {save.isError && (
                <p className="text-red-500 text-xs">{save.error?.response?.data?.message || 'Save failed.'}</p>
              )}
            </form>
          </div>
        </div>
      )}

      {deleting && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-sm p-6">
            <h2 className="font-medium mb-2">Delete category?</h2>
            <p className="text-sm text-gray-500 mb-5">
              "{deleting.name}" will be permanently deleted. This cannot be undone.
            </p>
            {remove.isError && (
              <p className="text-red-500 text-xs mb-3">{remove.error?.response?.data?.message || 'Delete Failed'}</p>
            )}
            <div className="flex gap-3">
              <button onClick={() => setDeleting(null)}
                className="flex-1 border border-gray-200 rounded-lg py-2 text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={() => remove.mutate(deleting.id)} disabled={remove.isPending}
                className="flex-1 bg-red-600 text-white rounded-lg py-2 text-sm hover:bg-red-700 disabled:opacity-50">
                {remove.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}