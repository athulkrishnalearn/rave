import DashboardLayout from '../../components/DashboardLayout';

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black">Profile</h1>
        <div className="bg-white rounded shadow p-6">
          <p className="text-gray-600">Manage your profile and account settings.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
