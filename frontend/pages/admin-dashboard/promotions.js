import DashboardLayout from '../../components/DashboardLayout';

export default function PromotionsManagementPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black">Promotions Management</h1>
        <div className="bg-white rounded shadow p-6">
          <p className="text-gray-600">Create and manage promotions and contests.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
