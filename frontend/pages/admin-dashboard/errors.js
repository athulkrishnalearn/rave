import DashboardLayout from '../../components/DashboardLayout';

export default function ErrorLogsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black">Error Logs</h1>
        <div className="bg-white rounded shadow p-6">
          <p className="text-gray-600">View system errors and notifications.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
