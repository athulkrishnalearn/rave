import DashboardLayout from '../../components/DashboardLayout';

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black">Reports</h1>
        <div className="bg-white rounded shadow p-6">
          <p className="text-gray-600">Generate and view system reports.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
