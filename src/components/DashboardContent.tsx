"use client";

import { useState, useEffect } from 'react'
import { useAuth } from "@clerk/nextjs";
import CurrentNewsSources from "@/components/CurrentNewsSources";
import NewsletterForm from "@/components/NewsletterForm";
import { FaNewspaper, FaEnvelope, FaFileAlt } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { useTheme } from '@/contexts/ThemeContext'
// import TestNewsletterButton from "@/components/TestNewsletterButton";
import { NOT_WORKING_YET } from "@/lib/constants";

export default function DashboardContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [userData, setUserData] = useState<{ email: string; websites: string[] } | null>(null)
  const { userId } = useAuth()
  const { theme } = useTheme()

  useEffect(() => {
    if (userId) {
      fetchUserData()
    }
  }, [userId])

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/getUserData?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
        setIsSubscribed(data.websites?.length > 0 || false)
      } else if (response.status === 404) {
        setIsSubscribed(false)
      } else {
        console.error("Error fetching user data:", response.statusText)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <ImSpinner8 className="inline-block animate-spin text-4xl text-blue-500 dark:text-blue-400" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <DashboardCard title="News Sources" icon={<FaNewspaper />}>
          {userData && <CurrentNewsSources userData={userData} />}
        </DashboardCard>
      <DashboardCard title={isSubscribed ? "Update Subscription" : "Subscribe to Newsletter"} icon={<FaEnvelope />}>
        {userData && <NewsletterForm userData={userData} onUpdate={fetchUserData} />}
      </DashboardCard>
        <DashboardCard title="List of Websites Currently Not Working (Will be ready soon)" icon={<FaFileAlt />}>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
            {NOT_WORKING_YET.map((website, index) => (
              <li key={index}>{getHostname(website)}</li>
            ))}
          </ul>
        </DashboardCard>
        {/* <DashboardCard title="Test Newsletter" icon={<FaFileAlt />}>
          <TestNewsletterButton />
        </DashboardCard> */}
    </div>
  )
}

function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]
  }
}

function DashboardCard({ title, children, icon }: { title: string; children: React.ReactNode; icon: React.ReactNode }) {
  const { theme } = useTheme()
  
  return (
    <div className={`rounded-lg shadow-md p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <span className={`mr-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`}>{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}