'use client';

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const MOCK_CUSTOMERS = [
  "Ada Demo",
  "Tunde Demo",
  "Walk-in Patient",
  "PR Customer",
  "Clinic Owner",
];

interface ManualPaymentDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManualPaymentDrawer = ({
  open,
  onOpenChange,
}: ManualPaymentDrawerProps) => {
  const [customer, setCustomer] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"cash" | "transfer" | "pos" | "">("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (isSubmitting) return;
    onOpenChange(false);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const payload = {
      customer,
      amount,
      method,
      reference,
      notes,
    };
    console.log("Manual payment payload:", payload);
    setTimeout(() => {
      setIsSubmitting(false);
      onOpenChange(false);
      setCustomer("");
      setAmount("");
      setMethod("");
      setReference("");
      setNotes("");
    }, 800);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="max-w-xl w-full border-l border-gray-200/80 dark:border-gray-800/80 flex flex-col p-0"
      >
        <SheetHeader className="px-6 py-4">
          <div className="flex flex-col gap-1">
            <SheetTitle className="text-[#344054] dark:text-white">
              Log manual payment
            </SheetTitle>
            <SheetDescription className="text-sm text-[#475467] dark:text-gray-400">
              Record an offline payment and reconcile it later.
            </SheetDescription>
          </div>
        </SheetHeader>

        <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
          <div>
            <Label
              htmlFor="customer"
              className="text-sm font-medium text-[#344054] dark:text-gray-300 mb-1.5 block"
            >
              Customer
            </Label>
            <select
              id="customer"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-[#344054] dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            >
              <option value="">Select customer</option>
              {MOCK_CUSTOMERS.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label
              htmlFor="amount"
              className="text-sm font-medium text-[#344054] dark:text-gray-300 mb-1.5 block"
            >
              Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                ₦
              </span>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isSubmitting}
                className="w-full pl-8"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="method"
              className="text-sm font-medium text-[#344054] dark:text-gray-300 mb-1.5 block"
            >
              Payment method
            </Label>
            <select
              id="method"
              value={method}
              onChange={(e) =>
                setMethod(e.target.value as "cash" | "transfer" | "pos" | "")
              }
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-[#344054] dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            >
              <option value="">Select method</option>
              <option value="cash">Cash</option>
              <option value="transfer">Bank Transfer</option>
              <option value="pos">POS</option>
            </select>
          </div>

          <div>
            <Label
              htmlFor="reference"
              className="text-sm font-medium text-[#344054] dark:text-gray-300 mb-1.5 block"
            >
              Reference
            </Label>
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              disabled={isSubmitting}
              placeholder="Optional reference or receipt number"
            />
          </div>

          <div>
            <Label
              htmlFor="notes"
              className="text-sm font-medium text-[#344054] dark:text-gray-300 mb-1.5 block"
            >
              Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isSubmitting}
              className="w-full min-h-24"
              placeholder="Add any extra context about this manual payment"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-800">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#009688] hover:bg-[#008577] text-white cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Logging..." : "Log payment"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

