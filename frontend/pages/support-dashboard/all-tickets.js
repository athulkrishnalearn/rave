import DashboardLayout from '../../components/DashboardLayout';

export default function AllTicketsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black">All Tickets</h1>
        <div className="bg-white rounded shadow p-6">
          <p className="text-gray-600">View all support tickets in the system.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
