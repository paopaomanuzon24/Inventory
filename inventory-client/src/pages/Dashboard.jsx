import useAuthStore from '../store/AuthStore'

export default function Dashboard() {
  const { user } = useAuthStore()

  return (
    <div>
      <h1 className="text-xl font-medium text-gray-900 mb-1">
        Dashboard
      </h1>

      <p className="text-sm text-gray-500 mb-6">
        Signed in as{' '}
        <span className="font-medium">{user?.email}</span>
        <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded capitalize">
          {user?.role}
        </span>
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          'Total products',
          'Low stock',
          'Stock in today',
          'Stock out today',
        ].map((label) => (
          <div
            key={label}
            className="bg-white border border-gray-100 rounded-xl p-4"
          >
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className="text-2xl font-medium text-gray-900">—</p>
          </div>
        ))}
      </div>
    </div>
  )
}