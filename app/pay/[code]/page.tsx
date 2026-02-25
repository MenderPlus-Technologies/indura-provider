'use client';

import { useEffect, useMemo, useState, FormEvent } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PaymentSummary } from "./components/PaymentSummary";
import { CheckoutForm } from "./components/CheckoutForm";
import { apiGet, apiPost } from "@/app/utils/api";
import { useToast } from "@/components/ui/toast";

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

interface PublicPaymentLinkResponse {
  success?: boolean;
  message?: string;
  data?: PublicPaymentLink;
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

  const [isLoading, setIsLoading] = useState(true);
  const [link, setLink] = useState<PublicPaymentLink | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchLink = async () => {
      if (!code) return;
      setIsLoading(true);
      setError(null);

      const res = await apiGet<PublicPaymentLinkResponse | PublicPaymentLink>(
        `/providers/payment-links/public/${code}`
      );

      if (res.error) {
        setError(res.error.message || "Failed to load payment link.");
        setIsLoading(false);
        return;
      }

      const raw = res.data;
      let payload: any = raw;
      if (raw && typeof raw === "object" && "data" in raw) {
        payload = (raw as PublicPaymentLinkResponse).data;
      }

      if (!payload || typeof payload !== "object") {
        setError("Payment link not found.");
        setIsLoading(false);
        return;
      }

      setLink(payload as PublicPaymentLink);
      setIsLoading(false);
    };

    fetchLink();
  }, [code]);

  const isExpiredOrInactive = useMemo(() => {
    if (!link) return false;
    const now = new Date();
    const expiry = new Date(link.expiresAt);
    const expired = expiry.getTime() < now.getTime();
    const inactive = link.status.toLowerCase() !== "active";
    return expired || inactive;
  }, [link]);

  const handleFormChange = (field: "name" | "email" | "phone", value: string) => {
    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "phone") setPhone(value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!link || !code) return;

    if (!name.trim() || !email.trim() || !phone.trim()) {
      showToast("Please fill in your name, email and phone number.", "error");
      return;
    }

    if (isExpiredOrInactive) {
      showToast("This payment link is no longer active.", "error");
      return;
    }

    if (typeof window === "undefined") return;

    const redirectUrl = `${window.location.origin}/payment/complete`;

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

    // Success – redirect to gateway
    window.location.href = checkoutUrl;
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#009688]" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Loading payment details…
            </p>
          </div>
        ) : error || !link ? (
          <div className="bg-white dark:bg-gray-900 border border-red-100 dark:border-red-800 rounded-2xl shadow-sm p-6 flex flex-col items-center text-center gap-3">
            <p className="text-base font-semibold text-red-700 dark:text-red-200">
              Payment link not available
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {error || "This payment link is invalid or no longer exists."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <PaymentSummary
              title={link.title}
              description={link.description}
              amount={link.amount}
              currency={link.currency}
              expiresAt={link.expiresAt}
              status={link.status}
              isExpiredOrInactive={isExpiredOrInactive}
            />

            <div className="mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-5 sm:p-6">
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
                disabled={isSubmitting || isExpiredOrInactive}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

