import DashboardLayout from '../../components/DashboardLayout';

export default function WeeklyTestPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black">Weekly Test</h1>
        <div className="bg-white rounded shadow p-6">
          <p className="text-gray-600">Take your weekly skills assessment test.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
