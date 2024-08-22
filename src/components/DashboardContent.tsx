"use client";

import { useState, useEffect } from 'react'
import { useAuth } from "@clerk/nextjs";
import CurrentNewsSources from "@/components/CurrentNewsSources";
import NewsletterForm from "@/components/NewsletterForm";
import { FaNewspaper, FaEnvelope, FaFileAlt } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";

export default function DashboardContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { userId } = useAuth()

  useEffect(() => {
    if (userId) {
      checkSubscriptionStatus()
    }
  }, [userId])

  const checkSubscriptionStatus = async () => {
    try {
      const response = await fetch(`/api/getUserData?userId=${userId}`)
      if (response.ok) {
        setIsSubscribed(true)
      } else if (response.status === 404) {
        setIsSubscribed(false)
      } else {
        console.error("Error checking subscription status:", response.statusText)
      }
    } catch (error) {
      console.error("Error checking subscription status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <ImSpinner8 className="inline-block animate-spin text-4xl text-blue-500" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {isSubscribed && (
        <DashboardCard title="News Sources" icon={<FaNewspaper />}>
          <CurrentNewsSources />
        </DashboardCard>
      )}
      <DashboardCard title={isSubscribed ? "Update Subscription" : "Subscribe to Newsletter"} icon={<FaEnvelope />}>
        <NewsletterForm isSubscribed={isSubscribed} />
      </DashboardCard>
      {isSubscribed && (
        <DashboardCard title="Your Summaries" icon={<FaFileAlt />}>
          <p className="text-gray-600">No summaries yet. They will appear here once generated.</p>
        </DashboardCard>
      )}
    </div>
  )
}

function DashboardCard({ title, children, icon }: { title: string; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
        <span className="mr-2 text-blue-500">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}