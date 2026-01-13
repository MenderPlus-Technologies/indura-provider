import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusBadgeStyles = (status: string) => {
  switch (status) {
    case "Failed":
      return "bg-red-50 border-red-200 text-red-700";
    case "Settled":
      return "bg-green-50 border-green-200 text-green-700";
    case "Pending":
      return "bg-yellow-50 border-yellow-200 text-yellow-700";
    default:
      return "";
  }
};

export const getStatusDotColor = (status: string) => {
  switch (status) {
    case "Failed":
      return "bg-red-500";
    case "Settled":
      return "bg-green-500";
    case "Pending":
      return "bg-yellow-500";
    default:
      return "";
  }
};