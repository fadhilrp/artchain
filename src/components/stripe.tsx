"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

interface StripeProps {
  children: React.ReactNode
  options: {
    mode: "payment" | "subscription"
    amount: number
    currency: string
  }
  className?: string
}

export function Stripe({ children, options, className }: StripeProps) {
  const [stripePromise, setStripePromise] = useState(null)
  const [clientSecret, setClientSecret] = useState("")

  useEffect(() => {
    // This would normally fetch from your API to create a payment intent
    // For demo purposes, we're just simulating this
    setClientSecret("demo_secret_key")

    // In a real implementation, you would use your actual publishable key
    setStripePromise(loadStripe("pk_test_demo"))
  }, [])

  return (
    <div className={className}>
      {clientSecret && stripePromise && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
            },
          }}
        >
          {children}
        </Elements>
      )}
    </div>
  )
}
