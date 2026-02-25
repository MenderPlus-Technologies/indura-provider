'use client';

export default function PaymentCompletePage() {
  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 sm:p-8 text-center space-y-4">
        <h1 className="text-lg sm:text-xl font-semibold text-[#111827] dark:text-white">
          Payment processing
        </h1>
        <p className="text-sm text-[#4B5563] dark:text-gray-300">
          Your payment is being confirmed. If you completed payment, you will
          receive confirmation shortly.
        </p>
      </div>
    </div>
  );
}

