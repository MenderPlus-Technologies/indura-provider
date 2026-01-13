import { Home, RefreshCw, User, Settings, Headphones } from "lucide-react";
import { MenuItem } from "../types";

export const mainMenuItems: MenuItem[] = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: RefreshCw, label: "Transactions", href: "/dashboard/transactions" },
  { icon: User, label: "Members", href: "/dashboard/members" },
];

export const bottomMenuItems: MenuItem[] = [
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: Headphones, label: "Help Center", href: "/dashboard/help" },
];