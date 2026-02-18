export interface Customer {
  name: string;
  email: string;
  phone: string;
  location: string;
  totalOrders: number;
  totalSpent: string;
  avatar?: string;
}

// Keep Member as alias for backward compatibility
export type Member = Customer;

/**
 * Format amount with currency (Naira)
 */
export const formatCustomerAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Export customers to CSV
 */
export const exportCustomersToCSV = (customers: Customer[], filename: string = 'customers') => {
  if (customers.length === 0) {
    alert('No customers to export');
    return;
  }

  // CSV Headers
  const headers = ['Name', 'Email', 'Phone', 'Location', 'Total Orders', 'Total Spent'];
  
  // Convert customers to CSV rows
  const rows = customers.map(customer => [
    customer.name,
    customer.email,
    customer.phone,
    customer.location,
    customer.totalOrders.toString(),
    customer.totalSpent.replace('₦', '').replace(/,/g, ''), // Remove currency symbol and commas for CSV
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

// Legacy mock data removed – customers now come exclusively from the backend
