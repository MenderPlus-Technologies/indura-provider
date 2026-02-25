'use client';

import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CheckoutFormProps {
  name: string;
  email: string;
  phone: string;
  onChange: (field: "name" | "email" | "phone", value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  disabled: boolean;
}

export const CheckoutForm = ({
  name,
  email,
  phone,
  onChange,
  onSubmit,
  isSubmitting,
  disabled,
}: CheckoutFormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="mt-4 space-y-4"
      noValidate
    >
      <div className="space-y-1.5">
        <Label
          htmlFor="full-name"
          className="text-sm font-medium text-[#111827] dark:text-gray-100"
        >
          Full name
        </Label>
        <Input
          id="full-name"
          type="text"
          value={name}
          onChange={(e) => onChange("name", e.target.value)}
          disabled={disabled}
          placeholder="e.g. John Doe"
          className="text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="email"
          className="text-sm font-medium text-[#111827] dark:text-gray-100"
        >
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onChange("email", e.target.value)}
          disabled={disabled}
          placeholder="e.g. john@example.com"
          className="text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="phone"
          className="text-sm font-medium text-[#111827] dark:text-gray-100"
        >
          Phone number
        </Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => onChange("phone", e.target.value)}
          disabled={disabled}
          placeholder="e.g. 0801 234 5678"
          className="text-sm"
        />
      </div>

      <Button
        type="submit"
        disabled={disabled}
        className="w-full mt-2 bg-[#009688] hover:bg-[#008577] text-white text-sm font-semibold py-2.5 rounded-xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting && (
          <span className="inline-flex h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
        )}
        {isSubmitting ? "Redirecting…" : "Pay now"}
      </Button>
    </form>
  );
};

