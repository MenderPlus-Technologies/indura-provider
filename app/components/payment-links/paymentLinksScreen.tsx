'use client';

import { Link2, Send, WalletCards } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentLinksTab } from "@/app/components/transactions/components/PaymentLinksTab";

export const PaymentLinksScreen = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-2 px-4 sm:px-6 py-4 border-b border-solid border-gray-200 dark:border-gray-800 w-full">
        <div className="inline-flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#009688]/10">
            <Link2 className="h-5 w-5 text-[#009688]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[#344054] dark:text-white">
              Payment Links
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create a link, share it with a customer, and track every payment in one place.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-none border border-[#DFE1E6] dark:border-gray-700 rounded-2xl">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#009688]/10">
                <Link2 className="h-5 w-5 text-[#009688]" />
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-foreground">
                  Create a link
                </h2>
                <p className="text-xs text-muted-foreground">
                  Add the amount, title, description, and expiry date.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none border border-[#DFE1E6] dark:border-gray-700 rounded-2xl">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#009688]/10">
                <Send className="h-5 w-5 text-[#009688]" />
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-foreground">
                  Share with a customer
                </h2>
                <p className="text-xs text-muted-foreground">
                  Copy the public URL and send it by chat, email, or SMS.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none border border-[#DFE1E6] dark:border-gray-700 rounded-2xl">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#009688]/10">
                <WalletCards className="h-5 w-5 text-[#009688]" />
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-foreground">
                  Track payments
                </h2>
                <p className="text-xs text-muted-foreground">
                  View status, total payments, and amount received per link.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="flex flex-col shadow-none gap-4 p-4 w-full">
          <PaymentLinksTab />
        </Card>
      </div>
    </div>
  );
};
