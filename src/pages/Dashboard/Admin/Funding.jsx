import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/axiosSecure";

// Assume CheckoutForm component for Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Funding = () => {
  const [amount, setAmount] = useState(0);

  const { data: funds = [] } = useQuery({
    queryKey: ["fundings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/fundings");
      return res.data;
    },
  });

  return (
    <div>
      <h1>Funding</h1>
      <Elements stripe={stripePromise}>
        {/* <CheckoutForm amount={amount} /> Add a form for payment */}
      </Elements>
      <ul>
        {funds.map(fund => (
          <li key={fund._id}>Amount: {fund.amount}</li>
        ))}
      </ul>
    </div>
  );
};

export default Funding;