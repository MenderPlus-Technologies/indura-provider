import { Home, RefreshCw, User, Settings, Headphones } from "lucide-react";
import { MenuItem } from "../types";

export const mainMenuItems: MenuItem[] = [
  { icon: Home, label: "Dashboard", screen: "dashboard" },
  { icon: RefreshCw, label: "Transactions", screen: "transactions" },
  { icon: User, label: "Members", screen: "members" },
];

export const bottomMenuItems: MenuItem[] = [
  { icon: Settings, label: "Settings", screen: "settings" },
  { icon: Headphones, label: "Help Center", screen: "help" },
];