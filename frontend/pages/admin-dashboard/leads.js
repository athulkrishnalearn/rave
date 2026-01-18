import DashboardLayout from '../../components/DashboardLayout';

export default function LeadManagementPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black">Lead Management</h1>
        <div className="bg-white rounded shadow p-6">
          <p className="text-gray-600">View and manage all leads in the system.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
