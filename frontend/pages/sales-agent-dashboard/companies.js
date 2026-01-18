import DashboardLayout from '../../components/DashboardLayout';

export default function CompaniesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black">Companies</h1>
        <div className="bg-white rounded shadow p-6">
          <p className="text-gray-600">Browse and join companies to work with.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
