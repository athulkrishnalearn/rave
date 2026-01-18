import DashboardLayout from '../../components/DashboardLayout';

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black">Analytics</h1>
        <div className="bg-white rounded shadow p-6">
          <p className="text-gray-600">View detailed analytics of your affiliate performance.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
