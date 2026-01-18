import DashboardLayout from '../../components/DashboardLayout';

export default function CompanyManagementPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black">Company Management</h1>
        <div className="bg-white rounded shadow p-6">
          <p className="text-gray-600">Manage registered companies.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
