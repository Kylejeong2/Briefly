'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { NewspaperIcon, InboxIcon, ClockIcon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useRouter } from 'next/navigation'
import { useSignIn } from '@clerk/nextjs'

export default function Home() {
  const { theme } = useTheme()
  const [email, setEmail] = useState('')
  const router = useRouter()
  const { signIn } = useSignIn()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      try {
        await signIn?.create({
          identifier: email,
        })
        router.push('/sign-in?email=' + encodeURIComponent(email))
      } catch (err) {
        console.error('Error during sign in:', err)
      }
    } else {
      router.push('/sign-in')
    }
  }

  return (
    <>
      <section className={`w-full py-12 md:py-24 lg:py-32 xl:py-48 ${
        theme === 'dark' ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-white to-gray-100'
      }`}>
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Stay Informed, Save Time
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Automated email summaries and newsletters from your favorite sources. Never miss important news again.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <form className="flex space-x-2" onSubmit={handleSubmit}>
                <Input
                  className="max-w-lg flex-1"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit">Get Started</Button>
              </form>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Start today! No credit card required.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <NewspaperIcon className="h-12 w-12 mb-4 text-primary" />
                <CardTitle>Custom News Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Choose your favorite news sources and get tailored summaries delivered to your inbox.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <InboxIcon className="h-12 w-12 mb-4 text-primary" />
                <CardTitle>Email Summaries</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Receive concise email summaries of the most important news, saving you time and keeping you informed.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <ClockIcon className="h-12 w-12 mb-4 text-primary" />
                <CardTitle>Time-Saving</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Stay on top of current events without spending hours reading full articles. Get the essence in minutes.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section id="pricing" className={`w-full py-12 md:py-24 lg:py-32 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Simple, Transparent Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <CardDescription>For casual readers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">$9/mo</p>
                <ul className="mt-4 space-y-2">
                  <li>3 news sources</li>
                  <li>Daily summaries</li>
                  <li>Email delivery</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Choose Basic</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For avid news consumers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">$19/mo</p>
                <ul className="mt-4 space-y-2">
                  <li>10 news sources</li>
                  <li>Twice-daily summaries</li>
                  <li>Email & app delivery</li>
                  <li>Custom categories</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Choose Pro</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For teams and organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">Custom</p>
                <ul className="mt-4 space-y-2">
                  <li>Unlimited news sources</li>
                  <li>Real-time summaries</li>
                  <li>Multi-platform delivery</li>
                  <li>Advanced analytics</li>
                  <li>Dedicated support</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Contact Sales</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Briefly has revolutionized how I stay informed. It's a game-changer!",
                author: "Jane Doe, Entrepreneur"
              },
              {
                quote: "I save hours each day thanks to these concise summaries. Highly recommended!",
                author: "John Smith, Journalist"
              },
              {
                quote: "The custom news sources feature is exactly what I needed. Great service!",
                author: "Emily Brown, Marketing Manager"
              }
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-4">
                  <blockquote className="border-l-4 pl-4 italic">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                  <p className="mt-4 font-semibold">{testimonial.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section id="faq" className={`w-full py-12 md:py-24 lg:py-32 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>How often will I receive summaries?</AccordionTrigger>
              <AccordionContent>
                Depending on your plan, you&apos;ll receive summaries daily or twice daily. Enterprise users can opt for real-time updates.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I change my news sources?</AccordionTrigger>
              <AccordionContent>
                Yes, you can easily add, remove, or change your news sources from your dashboard at any time.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is there a mobile app available?</AccordionTrigger>
              <AccordionContent>
                Yes, we offer mobile apps for both iOS and Android platforms for our Pro and Enterprise users.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>What if I want to cancel my subscription?</AccordionTrigger>
              <AccordionContent>
                You can cancel your subscription at any time from your account settings. There are no long-term commitments or cancellation fees.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      <section className={`w-full py-12 md:py-24 lg:py-32 ${
        theme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-primary text-primary-foreground'
      }`}>
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Stay Informed?</h2>
              <p className="mx-auto max-w-[600px] text-primary-foreground/90 md:text-xl">
                Join thousands of users who save time and stay updated with Briefly.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <form className="flex space-x-2" onSubmit={handleSubmit}>
                <Input
                  className="max-w-lg flex-1 bg-primary-foreground text-primary"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" variant="secondary">Get Started</Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}