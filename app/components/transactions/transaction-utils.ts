export interface Transaction {
  payer: string;
  email: string;
  datetime: string;
  method: string;
  status: "Failed" | "Settled" | "Pending";
  amount: string;
  type?: "debit" | "credit";
  reference?: string;
  category?: string;
}

export const tableData: Transaction[] = [
  {
    payer: "Sharon Lehner",
    email: "Sharon.Lehner@yahoo.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Failed",
    amount: "₦1,100",
  },
  {
    payer: "Bob Denesik",
    email: "Bob_Denesik@hotmail.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Settled",
    amount: "₦1,100",
  },
  {
    payer: "Judy Bruen",
    email: "Judy45@yahoo.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Pending",
    amount: "₦1,100",
  },
  {
    payer: "Rafael Price",
    email: "Rafael95@yahoo.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Settled",
    amount: "₦1,100",
  },
  {
    payer: "Ana Kerluke",
    email: "Ana.Kerluke50@gmail.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Settled",
    amount: "₦1,100",
  },
  {
    payer: "Eddie Kohler",
    email: "Eddie_Kohler@gmail.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Pending",
    amount: "₦1,100",
  },
  {
    payer: "Henrietta Carter",
    email: "Henrietta4@gmail.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Failed",
    amount: "₦1,100",
  },
  {
    payer: "Walter Treutel",
    email: "Walter_Treutel36@gmail.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Failed",
    amount: "₦1,100",
  },
  {
    payer: "Rosa Mann",
    email: "Rosa.Mann19@yahoo.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Settled",
    amount: "₦1,100",
  },
  {
    payer: "Ramon Mayert",
    email: "Ramon43@yahoo.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Settled",
    amount: "₦1,100",
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

/**
 * Map API transaction status to UI status
 */
export const mapApiStatusToUIStatus = (apiStatus: string): "Failed" | "Settled" | "Pending" => {
  switch (apiStatus.toLowerCase()) {
    case "successful":
    case "settled":
    case "completed":
      return "Settled";
    case "failed":
    case "error":
    case "declined":
      return "Failed";
    case "pending":
    case "processing":
      return "Pending";
    default:
      return "Pending";
  }
};

/**
 * Format date from ISO string to readable format
 */
export const formatTransactionDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(',', '');
  } catch {
    return dateString;
  }
};

/**
 * Format amount with currency (Naira)
 */
export const formatTransactionAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Get payer name from transaction metadata or use fallback
 */
export const getPayerName = (transaction: {
  metadata?: {
    providerName?: string;
    payerUserId?: string;
    [key: string]: unknown;
  };
  type: string;
  category: string;
}): string => {
  // For credit transactions (payment received), we don't have payer name in metadata
  // For debit transactions (provider payment), providerName might be in metadata
  if (transaction.type === 'credit' && transaction.category === 'payment_received') {
    return 'Payment Received'; // Fallback since we don't have payer name
  }
  return transaction.metadata?.providerName || 'Unknown';
};

/**
 * Get payer email from transaction or use fallback
 */
export const getPayerEmail = (transaction: {
  metadata?: {
    [key: string]: unknown;
  };
  type: string;
  category: string;
}): string => {
  // Since API doesn't provide email, we'll use a placeholder
  if (transaction.type === 'credit' && transaction.category === 'payment_received') {
    return 'payment@indura.com';
  }
  return 'N/A';
};

/**
 * Export transactions to CSV
 */
export const exportToCSV = (transactions: Transaction[], filename: string = 'transactions') => {
  if (transactions.length === 0) {
    alert('No transactions to export');
    return;
  }

  // CSV Headers
  const headers = ['Payer', 'Email', 'Date & Time', 'Method', 'Type', 'Reference', 'Status', 'Amount'];
  
  // Convert transactions to CSV rows
  const rows = transactions.map(transaction => [
    transaction.payer,
    transaction.email,
    transaction.datetime,
    transaction.method,
    transaction.type || 'N/A',
    transaction.reference || 'N/A',
    transaction.status,
    transaction.amount.replace('₦', '').replace(/,/g, ''), // Remove currency symbol and commas for CSV
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
