"use client";

import { useState, useEffect } from 'react'
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CurrentNewsSources() {
  const [email, setEmail] = useState("")
  const [urls, setUrls] = useState<string[]>([])
  const { userId } = useAuth()

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
        setEmail(data.email)
        setUrls(data.websites)
      } else {
        console.error("Error fetching user data:", response.statusText)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current News Sources</CardTitle>
        <CardDescription>Your current email and news source URLs</CardDescription>
      </CardHeader>
      <CardContent>
        <p><strong>Email:</strong> {email}</p>
        <ul>
          {urls.map((url, index) => (
            <li key={index}>{url}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}