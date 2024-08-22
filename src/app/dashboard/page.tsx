import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardContent from "@/components/DashboardContent";

export default function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Dashboard</h1>
        <DashboardContent />
      </div>
    </div>
  );
}