import DashboardLayout from '../../components/DashboardLayout';

export default function PromotionsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black">Promotions</h1>
        <div className="bg-white rounded shadow p-6">
          <p className="text-gray-600">View active promotions and contests.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
