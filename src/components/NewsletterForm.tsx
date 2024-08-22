"use client";

import { useState, useEffect } from 'react'
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from '@/contexts/ThemeContext'
import { PlusIcon, MinusIcon } from 'lucide-react'

interface NewsletterFormProps {
  isSubscribed: boolean;
}

export default function NewsletterForm({ isSubscribed }: NewsletterFormProps) {
  const { theme } = useTheme()
  const [email, setEmail] = useState("")
  const [urls, setUrls] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const { userId } = useAuth()

  useEffect(() => {
    if (isSubscribed && userId) {
      fetchUserData()
    }
  }, [isSubscribed, userId])

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/getUserData?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setEmail(data.email)
        setUrls(data.websites)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    const endpoint = isSubscribed ? '/api/update-subscription' : '/api/subscribe'
    const method = isSubscribed ? 'PUT' : 'POST'

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, email, websites: urls.filter(Boolean) }),
      })

      if (response.ok) {
        setMessage(isSubscribed ? "Subscription updated successfully!" : "Subscription successful!")
        if (isSubscribed) {
          window.location.reload()
        }
      } else {
        const data = await response.json()
        setMessage(data.error || "An error occurred. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setMessage("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const addUrlField = () => {
    if (urls.length < 3) {
      setUrls([...urls, ''])
    }
  }

  const removeUrlField = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index)
    setUrls(newUrls)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isSubscribed ? "Update Subscription" : "Subscribe to Newsletter"}</CardTitle>
        <CardDescription>{isSubscribed ? "Update your email and URLs for news sources" : "Enter your email and at least one URL for news sources"}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="your@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {urls.map((url, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor={`url${index + 1}`}>URL {index + 1}{index === 0 && " (Required)"}</Label>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeUrlField(index)}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Input
                id={`url${index + 1}`}
                placeholder={`https://news-source-${index + 1}.com`}
                type="url"
                value={url}
                onChange={(e) => {
                  const newUrls = [...urls]
                  newUrls[index] = e.target.value
                  setUrls(newUrls)
                }}
                required={index === 0}
              />
            </div>
          ))}
          {urls.length < 3 && (
            <Button
              type="button"
              variant="outline"
              onClick={addUrlField}
              className="w-full"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Another URL
            </Button>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : (isSubscribed ? "Update Subscription" : "Subscribe")}
          </Button>
        </form>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      </CardContent>
    </Card>
  )
}