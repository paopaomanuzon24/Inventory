import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import { useProducts, useCategories, useDeleteProduct } from '../hooks/useProducts'

export default function Products() {
  const [filters, setFilters] = useState({
    search: '', category_id: '', status: '', page: 1
  })
  const [deleting, setDeleting] = useState(null)

  const { data, isLoading }  = useProducts(filters)
  const { data: catData }    = useCategories()
  const deleteMutation       = useDeleteProduct()

  const products    = data?.data || []
  const meta        = data?.meta || {}
  const categories  = catData?.data || []

  const setFilter = (key, val) =>
    setFilters(f => ({ ...f, [key]: val, page: 1 }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{meta.total ?? 0} total</p>
        </div>
        <Link to="/products/new"
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800">
          <Plus size={15} /> Add product
        </Link>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={filters.search}
            onChange={e => setFilter('search', e.target.value)}
            placeholder="Search name, SKU, barcode..."
            className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
        </div>
        <select value={filters.category_id} onChange={e => setFilter('category_id', e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300">
          <option value="">All categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filters.status} onChange={e => setFilter('status', e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Product', 'SKU', 'Category', 'Stock', 'Sell price', 'Status', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-sm">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-sm">No products found</td></tr>
            ) : products.map(p => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.image_url
                      ? <img src={p.image_url} className="w-8 h-8 rounded-lg object-cover" />
                      : <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">?</div>
                    }
                    <span className="font-medium text-gray-900">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{p.sku}</td>
                <td className="px-4 py-3 text-gray-500">{p.category?.name}</td>
                <td className="px-4 py-3">
                  <span className={p.is_low_stock ? 'text-red-600 font-medium flex items-center gap-1' : 'text-gray-700'}>
                    {p.is_low_stock && <AlertTriangle size={12} />}
                    {p.stock_qty} {p.unit?.abbreviation}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">₱{p.sell_price.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link to={`/products/${p.id}/edit`} className="text-gray-400 hover:text-gray-700 p-1">
                      <Pencil size={14} />
                    </Link>
                    <button onClick={() => setDeleting(p)} className="text-gray-400 hover:text-red-500 p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {meta.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Page {meta.current_page} of {meta.last_page}
            </span>
            <div className="flex gap-1">
              <button onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                disabled={meta.current_page === 1}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40">Prev</button>
              <button onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                disabled={meta.current_page === meta.last_page}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>

      {deleting && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-sm p-6">
            <h2 className="font-medium mb-2">Delete product?</h2>
            <p className="text-sm text-gray-500 mb-5">"{deleting.name}" will be soft-deleted. Stock history is preserved.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleting(null)}
                className="flex-1 border border-gray-200 rounded-lg py-2 text-sm">Cancel</button>
              <button onClick={() => deleteMutation.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
                disabled={deleteMutation.isPending}
                className="flex-1 bg-red-600 text-white rounded-lg py-2 text-sm disabled:opacity-50">
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
