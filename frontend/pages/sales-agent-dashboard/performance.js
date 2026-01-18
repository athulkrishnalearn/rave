import DashboardLayout from '../../components/DashboardLayout';

export default function PerformancePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black">Performance</h1>
        <div className="bg-white rounded shadow p-6">
          <p className="text-gray-600">View your sales performance and earnings.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
