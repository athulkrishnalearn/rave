import DashboardLayout from '../../components/DashboardLayout';

export default function SupportTicketsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black">Support Tickets</h1>
        <div className="bg-white rounded shadow p-6">
          <p className="text-gray-600">View and manage support tickets.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
