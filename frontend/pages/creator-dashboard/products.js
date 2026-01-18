import DashboardLayout from '../../components/DashboardLayout';

export default function ProductsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black">Products</h1>
        <div className="bg-white rounded shadow p-6">
          <p className="text-gray-600">Browse and select products to promote with your affiliate links.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
