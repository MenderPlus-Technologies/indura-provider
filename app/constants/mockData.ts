import { Coins, BarChart3, ShoppingBag } from "lucide-react";
import { MetricCard, TableRow } from "../types";

export const metricCards: MetricCard[] = [
  {
    title: "Wallet Balance",
    value: "$53,765",
    change: "+10.5%",
    changeType: "success",
    icon: Coins,
    footer: "+$2,156",
    footerText: "from last month",
  },
  {
    title: "Todays Payouts",
    value: "$12,680",
    change: "+3.4%",
    changeType: "success",
    icon: BarChart3,
    footer: "+$2,156",
    footerText: "from last month",
  },
  {
    title: "Pending Requests",
    value: "11,294",
    change: "-0.5%",
    changeType: "error",
    icon: ShoppingBag,
    footer: "+1,450",
    footerText: "from last month",
  },
  {
    title: "Failed/Refunded",
    value: "456K",
    change: "-15.2%",
    changeType: "error",
    icon: ShoppingBag,
    footer: "-89.4K",
    footerText: "from last month",
  },
];

export const tableData: TableRow[] = [
  {
    payer: "Sharon Lehner",
    email: "Sharon.Lehner@yahoo.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Failed",
    amount: "$1,100",
  },
  {
    payer: "Bob Denesik",
    email: "Bob_Denesik@hotmail.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Settled",
    amount: "$1,100",
  },
  {
    payer: "Judy Bruen",
    email: "Judy45@yahoo.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Pending",
    amount: "$1,100",
  },
  {
    payer: "Rafael Price",
    email: "Rafael95@yahoo.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Settled",
    amount: "$1,100",
  },
];
