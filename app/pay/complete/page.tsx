'use client';

import Link from "next/link";
import { CheckCircle2, ExternalLink, Mail, FileCheck } from "lucide-react";

const INDURA_WEBSITE_URL = "https://www.indurahealth.com/";

export default function PaymentCompletePage() {
  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Status header */}
        <div className="bg-[#009688]/5 dark:bg-[#009688]/10 px-6 py-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#009688]/10 dark:bg-[#009688]/20 mb-3">
            <CheckCircle2 className="h-8 w-8 text-[#009688]" aria-hidden />
          </div>
          <h1 className="text-lg sm:text-xl font-semibold text-[#111827] dark:text-white">
            Payment processing
          </h1>
          <p className="text-sm text-[#4B5563] dark:text-gray-400 mt-1">
            We’re confirming your payment. This usually takes a few moments.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* What to expect */}
          <div className="text-left space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280] dark:text-gray-400">
              What happens next
            </p>
            <ul className="space-y-2.5 text-sm text-[#4B5563] dark:text-gray-300">
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-[#009688] shrink-0 mt-0.5" aria-hidden />
                <span>You’ll receive a confirmation by email once the payment is verified.</span>
              </li>
              <li className="flex items-start gap-3">
                <FileCheck className="h-4 w-4 text-[#009688] shrink-0 mt-0.5" aria-hidden />
                <span>Keep your receipt or transaction reference for your records.</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <Link
              href={INDURA_WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#009688] hover:bg-[#008577] text-white text-sm font-medium transition-colors"
            >
              Visit our website
              <ExternalLink className="h-4 w-4" aria-hidden />
            </Link>
            <p className="text-xs text-center text-[#6B7280] dark:text-gray-400">
              Learn about Indura — health payments and savings, powered by AI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
