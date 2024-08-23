"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CurrentNewsSourcesProps {
  userData: { email: string; websites: string[] } | null;
}

export default function CurrentNewsSources({ userData }: CurrentNewsSourcesProps) {
  if (!userData) {
    return <p>No subscription data available.</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current News Sources</CardTitle>
        <CardDescription>Your current email and news source URLs</CardDescription>
      </CardHeader>
      <CardContent>
        <p><strong>Email:</strong> {userData.email}</p>
        <ul>
          {userData.websites.map((url, index) => (
            <li key={index}>{url}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}