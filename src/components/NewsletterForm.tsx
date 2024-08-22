"use client";

import { useState, useEffect } from 'react'
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from '@/contexts/ThemeContext'
import { PlusIcon, MinusIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FREE_TIER_OPTIONS } from '@/lib/constants';

interface NewsletterFormProps {
  isSubscribed: boolean;
}

export default function NewsletterForm({ isSubscribed }: NewsletterFormProps) {
  const { theme } = useTheme()
  const [email, setEmail] = useState("")
  const [urls, setUrls] = useState<string[]>([''])
  const [isCustomUrl, setIsCustomUrl] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const { userId } = useAuth()
  const [isPaidTier, setIsPaidTier] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

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
        setIsCustomUrl(!FREE_TIER_OPTIONS.includes(data.websites[0]))
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls]
    newUrls[index] = value
    setUrls(newUrls)

    // Check for duplicates
    const isDuplicate = newUrls.indexOf(value) !== newUrls.lastIndexOf(value)
    if (isDuplicate) {
      setMessage("Duplicate sources are not allowed.")
    } else {
      setMessage("")
    }
  }

  const toggleCustomUrl = () => {
    setIsCustomUrl(!isCustomUrl)
    
    // Reset the first URL value when toggling
    const newUrls = [...urls]
    newUrls[0] = ''
    setUrls(newUrls)
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    // Validate URLs
    const invalidUrls = urls.filter(url => url && !isValidUrl(url))
    if (invalidUrls.length > 0) {
      setMessage("Please enter valid URLs for all sources.")
      setIsLoading(false)
      return
    }

    // Check for duplicates
    if (new Set(urls.filter(Boolean)).size !== urls.filter(Boolean).length) {
      setMessage("Duplicate sources are not allowed.")
      setIsLoading(false)
      return
    }

    if (!isPaidTier && urls.some((url, index) => index === 0 ? !isValidUrl(url) : !FREE_TIER_OPTIONS.includes(url))) {
      setShowPaymentModal(true)
      setIsLoading(false)
      return
    }

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
        <CardDescription>{isSubscribed ? "Update your email and news sources" : "Enter your email and choose your news sources"}</CardDescription>
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
                <Label htmlFor={`url${index + 1}`}>News Source {index + 1}{index === 0 && " (Required)"}</Label>
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
                {index === 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={toggleCustomUrl}
                  >
                    {isCustomUrl ? "Select from list" : "Enter custom URL"}
                  </Button>
                )}
              </div>
              {index === 0 && isCustomUrl ? (
                <Input
                  id={`url${index + 1}`}
                  placeholder="https://news-source.com"
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  required
                />
              ) : (
                <Select
                  value={url}
                  onValueChange={(value: string) => handleUrlChange(index, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a news source" />
                  </SelectTrigger>
                  <SelectContent>
                    {FREE_TIER_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {new URL(option).hostname.replace('www.', '')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
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
              Add Another News Source
            </Button>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : (isSubscribed ? "Update Subscription" : "Subscribe")}
          </Button>
        </form>
        {message && <p className="mt-2 text-sm text-red-600">{message}</p>}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Upgrade to Premium</h2>
              <p>Custom news sources are available in our premium tier.</p>
              <p className="mt-2">Stripe integration coming soon!</p>
              <Button onClick={() => setShowPaymentModal(false)} className="mt-4">Close</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}