import { MenuItem } from "../types";
import { Home, RefreshCw, User, Settings, Headphones, CreditCard } from "lucide-react";

export const getAllMenuItems = (): MenuItem[] => [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: RefreshCw, label: "Transactions", href: "/dashboard/transactions" },
  { icon: User, label: "Members", href: "/dashboard/members" },
  { icon: CreditCard, label: "Subscriptions", href: "/dashboard/subscriptions", requiresCapability: 'supportsSubscriptions' },
];

export const getMainMenuItems = (supportsSubscriptions: boolean): MenuItem[] => {
  return getAllMenuItems().filter(item => {
    if (item.requiresCapability === 'supportsSubscriptions') {
      return supportsSubscriptions;
    }
    return true;
  });
};

export const bottomMenuItems: MenuItem[] = [
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: Headphones, label: "Help Center", href: "/dashboard/help" },
];
