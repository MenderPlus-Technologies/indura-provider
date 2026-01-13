export interface Transaction {
  payer: string;
  email: string;
  datetime: string;
  method: string;
  status: "Failed" | "Settled" | "Pending";
  amount: string;
}

export const tableData: Transaction[] = [
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
  {
    payer: "Ana Kerluke",
    email: "Ana.Kerluke50@gmail.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Settled",
    amount: "$1,100",
  },
  {
    payer: "Eddie Kohler",
    email: "Eddie_Kohler@gmail.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Pending",
    amount: "$1,100",
  },
  {
    payer: "Henrietta Carter",
    email: "Henrietta4@gmail.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Failed",
    amount: "$1,100",
  },
  {
    payer: "Walter Treutel",
    email: "Walter_Treutel36@gmail.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Failed",
    amount: "$1,100",
  },
  {
    payer: "Rosa Mann",
    email: "Rosa.Mann19@yahoo.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Settled",
    amount: "$1,100",
  },
  {
    payer: "Ramon Mayert",
    email: "Ramon43@yahoo.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Settled",
    amount: "$1,100",
  },
];

export const getStatusBadgeStyles = (status: string) => {
  switch (status) {
    case "Failed":
      return "bg-additionalsky-0 border-[#fce4dd] text-additionalorange-100";
    case "Settled":
      return "bg-alertssuccess-0 border-[#c6ede5] text-alertssuccess-100";
    case "Pending":
      return "bg-alertswarning-0 border-[#fff1db] text-alertswarning-100";
    default:
      return "";
  }
};

export const getStatusDotColor = (status: string) => {
  switch (status) {
    case "Failed":
      return "bg-additionalorange-100";
    case "Settled":
      return "bg-alertssuccess-100";
    case "Pending":
      return "bg-alertswarning-100";
    default:
      return "";
  }
};
