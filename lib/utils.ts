import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusBadgeStyles = (status: string) => {
  switch (status) {
    case "Failed":
      return "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400";
    case "Settled":
      return "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400";
    case "Pending":
      return "bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400";
    default:
      return "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300";
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