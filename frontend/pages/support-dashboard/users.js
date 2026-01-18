import DashboardLayout from '../../components/DashboardLayout';

export default function UserSupportPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black">User Support</h1>
        <div className="bg-white rounded shadow p-6">
          <p className="text-gray-600">Search and assist users with their issues.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
