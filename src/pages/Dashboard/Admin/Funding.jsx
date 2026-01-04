import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/axiosSecure";
// import CheckoutForm from "./CheckoutForm"; // add when ready

// ✅ CORRECT Stripe key
const stripePromise = import.meta.env.VITE_STRIPE_PK
  ? loadStripe(import.meta.env.VITE_STRIPE_PK)
  : null;

const Funding = () => {
  const [showPayment, setShowPayment] = useState(false);

  const { data: funds = [], isLoading } = useQuery({
    queryKey: ["fundings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/fundings");
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center mt-10">Loading funds...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Funding</h1>

        <button
          onClick={() => setShowPayment(true)}
          className="bg-red-600 text-white px-5 py-2 rounded-lg"
        >
          Give Fund
        </button>
      </div>

      {/* ✅ Stripe Payment Section (Only when button clicked) */}
      {showPayment && stripePromise && (
        <div className="mb-8 border rounded-lg p-6 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Give Funding</h2>

          <Elements stripe={stripePromise}>
            {/* <CheckoutForm onClose={() => setShowPayment(false)} /> */}
            <p className="text-gray-600">
              Checkout form goes here (Stripe integrated correctly)
            </p>
          </Elements>

          <button
            onClick={() => setShowPayment(false)}
            className="mt-4 text-sm text-red-600"
          >
            Cancel
          </button>
        </div>
      )}

      {/* ✅ Funding Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Donor Name</th>
              <th className="border px-4 py-2 text-left">Amount</th>
              <th className="border px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {funds.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-6">
                  No funds found
                </td>
              </tr>
            ) : (
              funds.map((fund) => (
                <tr key={fund._id}>
                  <td className="border px-4 py-2">
                    {fund.userName || "Anonymous"}
                  </td>
                  <td className="border px-4 py-2">${fund.amount}</td>
                  <td className="border px-4 py-2">
                    {fund.date
                      ? new Date(fund.date).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Funding;
