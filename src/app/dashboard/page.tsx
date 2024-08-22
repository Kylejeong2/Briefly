'use client'
import DashboardContent from "@/components/DashboardContent";
import { useTheme } from "@/contexts/ThemeContext";

export default function Dashboard() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">Dashboard</h1>
        <DashboardContent />
      </div>
    </div>
  );
}