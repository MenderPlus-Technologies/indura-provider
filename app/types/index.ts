export interface MenuItem {
  icon: any;
  label: string;
  screen: string;
}

export interface MetricCard {
  title: string;
  value: string;
  change: string;
  changeType: "success" | "error";
  icon: any;
  footer: string;
  footerText: string;
}

export interface TableRow {
  payer: string;
  email: string;
  datetime: string;
  method: string;
  status: "Failed" | "Settled" | "Pending";
  amount: string;
}

export interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
}

export interface HeaderProps {
  title?: string;
}
