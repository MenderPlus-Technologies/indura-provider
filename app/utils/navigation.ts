import { MenuItem } from "../types";
import { Home, RefreshCw, User, Settings, Headphones, CreditCard, Users, Wallet, Link2 } from "lucide-react";

export const getAllMenuItems = (): MenuItem[] => [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: RefreshCw, label: "Transactions", href: "/dashboard/transactions" },
  { icon: Link2, label: "Payment Links", href: "/dashboard/payment-links" },

  { icon: User, label: "Customers", href: "/dashboard/members" },
  { icon: CreditCard, label: "Subscriptions", href: "/dashboard/subscriptions", requiresCapability: 'supportsSubscriptions' },
  { icon: Users, label: "Team Management", href: "/dashboard/team", requiresCapability: 'supportsTeamManagement' },
  { icon: Wallet, label: "Payouts", href: "/dashboard/payouts" },
];

export const getMainMenuItems = (supportsSubscriptions: boolean, supportsTeamManagement: boolean): MenuItem[] => {
  return getAllMenuItems().filter(item => {
    if (item.requiresCapability === 'supportsSubscriptions') {
      return supportsSubscriptions;
    }
    if (item.requiresCapability === 'supportsTeamManagement') {
      return supportsTeamManagement;
    }
    return true;
  });
};

export const bottomMenuItems: MenuItem[] = [
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: Headphones, label: "Help Center", href: "/dashboard/help" },
];
