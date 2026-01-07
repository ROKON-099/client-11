import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { Toaster } from 'react-hot-toast'
import AuthProvider from './Provider/AuthProvider.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import router from './Routes/Routes.jsx'

const queryClient = new QueryClient()

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </QueryClientProvider>
      </AuthProvider>
    </Elements>
  </React.StrictMode>,
)
