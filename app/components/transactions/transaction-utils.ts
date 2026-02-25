export interface Transaction {
  id?: string;
  payer: string;
  datetime: string;
  method: string;
  status: "Failed" | "Settled" | "Pending";
  amount: string;
  type?: "debit" | "credit";
  reference?: string;
  category?: string;
  description?: string;
}

export const getStatusBadgeStyles = (status: string) => {
  switch (status) {
    case "Failed":
      // Red / error
      return "bg-[#FEF3F2] border-[#FEE4E2] text-[#B42318]";
    case "Settled":
      // Green / success
      return "bg-[#ECFDF3] border-[#ABEFC6] text-[#027A48]";
    case "Pending":
      // Amber / pending
      return "bg-[#FFFAEB] border-[#FEDF89] text-[#B54708]";
    default:
      return "bg-[#F2F4F7] border-[#E4E7EC] text-[#344054]";
  }
};

export const getStatusDotColor = (status: string) => {
  switch (status) {
    case "Failed":
      return "bg-[#F04438]";
    case "Settled":
      return "bg-[#12B76A]";
    case "Pending":
      return "bg-[#F79009]";
    default:
      return "bg-[#98A2B3]";
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
 * Export transactions to CSV
 */
export const exportToCSV = (transactions: Transaction[], filename: string = 'transactions') => {
  if (transactions.length === 0) {
    alert('No transactions to export');
    return;
  }

  // CSV Headers (all from real API-backed fields)
  const headers = ['Payer', 'Date & Time', 'Method', 'Type', 'Reference', 'Description', 'Status', 'Amount'];
  
  // Convert transactions to CSV rows
  const rows = transactions.map(transaction => [
    transaction.payer,
    transaction.datetime,
    transaction.method,
    transaction.type || 'N/A',
    transaction.reference || 'N/A',
    transaction.description || '',
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
