'use client';

import { useState, FormEvent } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { CheckoutForm } from "./components/CheckoutForm";
import { apiPost } from "@/app/utils/api";
import { useToast } from "@/components/ui/toast";

const INDURA_WEBSITE_URL = "https://www.indurahealth.com/";

interface PublicPaymentLink {
  _id: string;
  title: string;
  description?: string | null;
  amount: number;
  currency: string;
  status: string;
  expiresAt: string;
  [key: string]: unknown;
}

interface PublicCheckoutResponse {
  success: boolean;
  message?: string;
  data?: {
    paymentLink: PublicPaymentLink;
    payment: {
      reference: string;
      checkout_url: string;
      status: string;
      [key: string]: unknown;
    };
  };
}

export default function PublicPaymentPage() {
  const { code } = useParams<{ code: string }>();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (field: "name" | "email" | "phone", value: string) => {
    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "phone") setPhone(value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!code) return;

    if (!name.trim() || !email.trim() || !phone.trim()) {
      showToast("Please fill in your name, email and phone number.", "error");
      return;
    }

    if (typeof window === "undefined") return;

    const redirectUrl = `${window.location.origin}/pay/complete`;

    setIsSubmitting(true);
    const res = await apiPost<PublicCheckoutResponse>(
      `/providers/payment-links/public/${code}/checkout`,
      {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        redirectUrl,
      }
    );

    if (res.error) {
      showToast(
        res.error.message || "Failed to start checkout. Please try again.",
        "error"
      );
      setIsSubmitting(false);
      return;
    }

    const payload = res.data;
    const checkoutUrl = payload?.data?.payment?.checkout_url;

    if (!payload?.success || !checkoutUrl) {
      showToast(
        payload?.message || "Invalid checkout response. Please try again.",
        "error"
      );
      setIsSubmitting(false);
      return;
    }

    window.location.href = checkoutUrl;
  };

  if (!code) {
    return (
      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Invalid payment link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-[#111827] dark:text-white mb-1">
              Customer details
            </h2>
            <p className="text-xs text-[#6B7280] dark:text-gray-400 mb-3">
              Enter your details to continue to secure checkout.
            </p>

            <CheckoutForm
              name={name}
              email={email}
              phone={phone}
              onChange={handleFormChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              disabled={isSubmitting}
            />
          </div>

          <Link
            href={INDURA_WEBSITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            Visit our website
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
