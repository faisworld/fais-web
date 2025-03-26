import DashboardLayout from "@/components/admin/DashboardLayout";

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <h2 className="text-xl font-bold mb-4">welcome to the admin panel</h2>
      <p className="text-gray-600">here you can manage site content and settings.</p>
    </DashboardLayout>
  );
}
