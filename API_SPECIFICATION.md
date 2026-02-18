# Provider Dashboard API Specification

**Document Version:** 1.0  
**Last Updated:** 2025-01-XX  
**Status:** Production-Ready Contracts

---

## Table of Contents

1. [Overview Dashboard](#1-overview-dashboard)
2. [Wallet & Payouts](#2-wallet--payouts)
3. [Transactions](#3-transactions)
4. [Customers](#4-customers)
5. [Subscriptions](#5-subscriptions)
6. [Notifications / Reminders](#6-notifications--reminders)
7. [Settings](#7-settings)
8. [Team Management](#8-team-management)
9. [Analytics](#9-analytics)
10. [Common Patterns](#10-common-patterns)

---

## 1. Overview Dashboard

### 1.1 Dashboard Statistics

**Endpoint:** `GET /api/providers/dashboard/stats`

**Description:** Retrieves aggregated statistics for the provider dashboard including wallet balance, payouts, active subscribers, and transaction summaries.

**Query Parameters:**
- `period` (optional, string): Time period filter - `daily`, `weekly`, `monthly`, `yearly`. Default: `monthly`
- `startDate` (optional, string): ISO 8601 date string for period start
- `endDate` (optional, string): ISO 8601 date string for period end

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "income": number,                    // Total wallet balance (NGN)
    "activeSubscribers": number,          // Count of active subscriptions
    "transactionsSummary": [
      {
        "_id": string,                    // Status identifier: "successful", "failed", "refunded", "pending"
        "count": number,                  // Number of transactions
        "totalAmount": number             // Total amount in NGN
      }
    ],
    "periodComparison": {
      "incomeChange": number,             // Percentage change from previous period
      "incomeChangeAmount": number,       // Absolute change amount
      "payoutsChange": number,            // Percentage change in payouts
      "payoutsChangeCount": number,       // Change in number of payouts
      "subscribersChange": number,        // Percentage change in subscribers
      "subscribersChangeCount": number     // Absolute change in subscriber count
    },
    "walletBalance": number,              // Current wallet balance
    "pendingPayouts": number,             // Amount pending payout
    "failedRefundedCount": number,         // Count of failed/refunded transactions
    "failedRefundedAmount": number        // Total amount of failed/refunded transactions
  },
  "timestamp": string                     // ISO 8601 timestamp
}
```

**Error Response:**
```typescript
{
  "success": false,
  "error": {
    "code": string,                       // Error code (e.g., "UNAUTHORIZED", "NOT_FOUND")
    "message": string,                    // Human-readable error message
    "details": object                     // Additional error details (optional)
  },
  "timestamp": string
}
```

**Status Codes:**
- `200 OK`: Success
- `401 Unauthorized`: Invalid or missing authentication token
- `500 Internal Server Error`: Server error

---

### 1.2 Income Chart Data

**Endpoint:** `GET /api/providers/dashboard/income-chart`

**Description:** Retrieves time-series data for income chart visualization comparing current and previous periods.

**Query Parameters:**
- `period` (required, string): `daily`, `weekly`, `monthly`, `yearly`
- `startDate` (optional, string): ISO 8601 date string
- `endDate` (optional, string): ISO 8601 date string
- `service` (optional, string): Filter by service type

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "period": string,                    // "daily" | "weekly" | "monthly" | "yearly"
    "startDate": string,                  // ISO 8601
    "endDate": string,                    // ISO 8601
    "dataPoints": [
      {
        "date": string,                   // ISO 8601 date
        "thisPeriod": number,              // Income for current period (NGN)
        "lastPeriod": number               // Income for previous period (NGN)
      }
    ],
    "summary": {
      "thisPeriodTotal": number,
      "lastPeriodTotal": number,
      "percentageChange": number
    }
  }
}
```

---

### 1.3 Recent Activities

**Endpoint:** `GET /api/providers/dashboard/recent-activities`

**Description:** Retrieves recent transaction activities for the dashboard.

**Query Parameters:**
- `limit` (optional, number): Number of activities to return. Default: 10, Max: 50
- `offset` (optional, number): Pagination offset. Default: 0

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": string,
        "payer": string,                  // Customer name
        "email": string,                  // Customer email
        "datetime": string,               // ISO 8601 timestamp
        "method": string,                 // Payment method
        "status": "Failed" | "Settled" | "Pending",
        "amount": string,                 // Formatted amount (e.g., "₦1,500")
        "reference": string               // Transaction reference
      }
    ],
    "total": number,
    "limit": number,
    "offset": number
  }
}
```

---

## 2. Wallet & Payouts

### 2.1 Get Wallet Balance

**Endpoint:** `GET /api/providers/wallet/balance`

**Description:** Retrieves current wallet balance and pending amounts.

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "availableBalance": number,           // Available balance (NGN)
    "pendingBalance": number,             // Pending payout amount (NGN)
    "currency": string,                   // "NGN"
    "lastUpdated": string                 // ISO 8601 timestamp
  }
}
```

---

### 2.2 Get Payout Settings

**Endpoint:** `GET /api/providers/payouts/settings`

**Description:** Retrieves current payout configuration.

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "payoutFrequency": string,            // "weekly" | "bi-weekly" | "monthly"
    "payoutDay": string,                  // Day of week/month (e.g., "friday", "15")
    "storeCurrency": string,               // "USD" | "NGN" | "EUR" | "GBP"
    "bankDetails": {
      "bankName": string,
      "accountNumber": string,
      "accountName": string,
      "routingNumber": string,            // Optional, for international
      "swiftCode": string                 // Optional, for international
    },
    "nextPayoutDate": string,             // ISO 8601 date
    "minimumPayoutAmount": number         // Minimum amount required for payout
  }
}
```

---

### 2.3 Update Payout Settings

**Endpoint:** `PUT /api/providers/payouts/settings`

**Description:** Updates payout configuration.

**Request Body:**
```typescript
{
  "payoutFrequency": string,              // "weekly" | "bi-weekly" | "monthly"
  "payoutDay"?: string,                  // Required if frequency is weekly/bi-weekly
  "storeCurrency": string,                // "USD" | "NGN" | "EUR" | "GBP"
  "bankDetails": {
    "bankName": string,
    "accountNumber": string,
    "accountName": string,
    "routingNumber"?: string,
    "swiftCode"?: string
  }
}
```

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "payoutFrequency": string,
    "payoutDay": string,
    "storeCurrency": string,
    "bankDetails": {
      "bankName": string,
      "accountNumber": string,            // Masked: "****2939"
      "accountName": string,
      "routingNumber"?: string,
      "swiftCode"?: string
    },
    "nextPayoutDate": string,
    "updatedAt": string
  },
  "message": "Payout settings updated successfully"
}
```

**Validation Errors:**
```typescript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "payoutFrequency": ["Invalid frequency. Must be weekly, bi-weekly, or monthly"],
      "bankDetails.accountNumber": ["Account number is required"]
    }
  }
}
```

---

### 2.4 Get Payout History

**Endpoint:** `GET /api/providers/payouts/history`

**Description:** Retrieves historical payout records.

**Query Parameters:**
- `page` (optional, number): Page number. Default: 1
- `limit` (optional, number): Items per page. Default: 10, Max: 100
- `startDate` (optional, string): ISO 8601 date filter
- `endDate` (optional, string): ISO 8601 date filter

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "payouts": [
      {
        "id": string,
        "invoice": string,                // Invoice number (e.g., "#890776")
        "date": string,                   // ISO 8601 date
        "amount": number,                 // Amount in store currency
        "currency": string,               // Currency code
        "status": "completed" | "pending" | "failed",
        "bankDetails": {
          "bankName": string,
          "accountNumber": string,        // Masked
          "accountName": string
        },
        "transactionReference": string,    // External transaction reference
        "createdAt": string,
        "completedAt"?: string
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "totalPages": number
    },
    "summary": {
      "totalPayouts": number,
      "totalAmount": number,
      "nextPayoutDate": string
    }
  }
}
```

---

### 2.5 Download Payout Invoice

**Endpoint:** `GET /api/providers/payouts/{payoutId}/invoice`

**Description:** Downloads invoice PDF for a specific payout.

**Path Parameters:**
- `payoutId` (required, string): Payout identifier

**Query Parameters:**
- `format` (optional, string): `pdf` (default) | `csv`

**Response:**
- Content-Type: `application/pdf` or `text/csv`
- Content-Disposition: `attachment; filename="invoice_890776.pdf"`

**Status Codes:**
- `200 OK`: Success
- `404 Not Found`: Payout not found
- `500 Internal Server Error`: Error generating invoice

---

### 2.6 Request Payout

**Endpoint:** `POST /api/providers/payouts/request`

**Description:** Initiates a manual payout request (if manual payouts are enabled).

**Request Body:**
```typescript
{
  "amount": number,                      // Amount to payout (must be >= minimum)
  "currency": string,                    // Currency code
  "description"?: string                 // Optional description
}
```

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "payoutId": string,
    "amount": number,
    "currency": string,
    "status": "pending",
    "estimatedCompletionDate": string,   // ISO 8601
    "invoice": string,                   // Invoice number
    "createdAt": string
  },
  "message": "Payout request submitted successfully"
}
```

---

## 3. Transactions

### 3.1 Get Transactions

**Endpoint:** `GET /api/providers/transactions`

**Description:** Retrieves paginated transaction list with filtering and sorting.

**Query Parameters:**
- `page` (optional, number): Page number. Default: 1
- `limit` (optional, number): Items per page. Default: 10, Max: 100
- `search` (optional, string): Search by payer name, email, or reference
- `status` (optional, string[]): Filter by status - `settled`, `pending`, `failed`
- `type` (optional, string[]): Filter by type - `credit`, `debit`
- `category` (optional, string[]): Filter by category
- `minAmount` (optional, number): Minimum amount filter
- `maxAmount` (optional, number): Maximum amount filter
- `dateFrom` (optional, string): ISO 8601 date filter
- `dateTo` (optional, string): ISO 8601 date filter
- `sortBy` (optional, string): `date`, `amount`, `payer`, `status`. Default: `date`
- `sortOrder` (optional, string): `asc`, `desc`. Default: `desc`

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "transactions": [
      {
        "_id": string,
        "walletId": string,
        "userId": string | {
          "_id": string,
          "name": string,
          "email": string,
          "phone": string
        },
        "type": "credit" | "debit",
        "category": string,               // "provider_payment", "payment_received", "wallet", etc.
        "amount": number,                 // Amount in NGN
        "currency": string,               // "NGN"
        "reference": string,              // Transaction reference
        "status": string,                 // Backend status
        "metadata": {
          "providerId": string,
          "providerName": string,
          "payerUserId": string,
          "description": string,
          "paymentMethod": string
        },
        "createdAt": string,              // ISO 8601
        "updatedAt": string
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "totalPages": number
    },
    "summary": {
      "totalAmount": number,
      "totalCount": number,
      "filteredCount": number
    }
  }
}
```

---

### 3.2 Get Transaction by ID

**Endpoint:** `GET /api/providers/transactions/{transactionId}`

**Description:** Retrieves detailed information for a specific transaction.

**Path Parameters:**
- `transactionId` (required, string): Transaction identifier

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "_id": string,
    "walletId": string,
    "userId": {
      "_id": string,
      "name": string,
      "email": string,
      "phone": string
    },
    "type": "credit" | "debit",
    "category": string,
    "amount": number,
    "currency": string,
    "reference": string,
    "status": string,
    "metadata": object,
    "createdAt": string,
    "updatedAt": string,
    "relatedTransactions": [             // Related transactions (refunds, reversals)
      {
        "_id": string,
        "type": string,
        "amount": number,
        "reference": string,
        "createdAt": string
      }
    ]
  }
}
```

---

### 3.3 Create Payment Request

**Endpoint:** `POST /api/providers/transactions/payment-request`

**Description:** Creates a new payment request for a customer.

**Request Body:**
```typescript
{
  "customerId": string,                  // Customer/user ID
  "amount": number,                      // Amount in NGN
  "currency": string,                    // "NGN"
  "paymentMethod": string,                // "wallet", "credit_card", "bank_transfer", "paypal", "cash"
  "description": string,                 // Optional description
  "dueDate"?: string,                    // Optional ISO 8601 date
  "metadata"?: object                     // Additional metadata
}
```

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "_id": string,
    "customerId": string,
    "amount": number,
    "currency": string,
    "paymentMethod": string,
    "description": string,
    "status": "pending",
    "reference": string,                 // Generated payment reference
    "paymentLink"?: string,              // Payment link if applicable
    "createdAt": string,
    "dueDate"?: string
  },
  "message": "Payment request created successfully"
}
```

---

### 3.4 Export Transactions to CSV

**Endpoint:** `GET /api/providers/transactions/export`

**Description:** Exports filtered transactions to CSV format.

**Query Parameters:** (Same as Get Transactions, plus:)
- `format` (optional, string): `csv` (default) | `xlsx`

**Response:**
- Content-Type: `text/csv` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename="transactions_2025-01-15.csv"`

**CSV Format:**
```csv
Payer,Email,Date & Time,Method,Type,Reference,Status,Amount
John Doe,john@example.com,"Dec 15, 2025 10:30 AM",Wallet,credit,REF123,Settled,1500
```

---

## 4. Customers

### 4.1 Get Customers

**Endpoint:** `GET /api/providers/customers`

**Description:** Retrieves paginated list of customers with their transaction statistics.

**Query Parameters:**
- `page` (optional, number): Page number. Default: 1
- `limit` (optional, number): Items per page. Default: 10, Max: 100
- `search` (optional, string): Search by name, email, or phone
- `sortBy` (optional, string): `name`, `email`, `totalSpent`, `transactionCount`, `lastTransactionDate`. Default: `name`
- `sortOrder` (optional, string): `asc`, `desc`. Default: `asc`

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "customers": [
      {
        "_id": string,
        "name": string,
        "email": string,
        "phone": string,
        "location"?: string,              // Currently not in API, needs to be added
        "totalSpent": number,             // Total amount spent (NGN)
        "transactionCount": number,       // Number of transactions
        "lastTransactionDate": string,    // ISO 8601
        "avatar"?: string,                // Avatar URL (optional)
        "createdAt": string,
        "metadata"?: object
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "totalPages": number
    },
    "summary": {
      "totalCustomers": number,
      "totalRevenue": number,
      "averageTransactionValue": number
    }
  }
}
```

**Missing Field:** `location` - Currently UI expects this but API doesn't provide it.

---

### 4.2 Get Customer by ID

**Endpoint:** `GET /api/providers/customers/{customerId}`

**Description:** Retrieves detailed customer information including transaction history.

**Path Parameters:**
- `customerId` (required, string): Customer identifier

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "_id": string,
    "name": string,
    "email": string,
    "phone": string,
    "location"?: string,
    "avatar"?: string,
    "totalSpent": number,
    "transactionCount": number,
    "lastTransactionDate": string,
    "subscriptions": [                    // Active subscriptions
      {
        "_id": string,
        "planName": string,
        "status": string,
        "startDate": string,
        "expiryDate": string
      }
    ],
    "recentTransactions": [               // Last 10 transactions
      {
        "_id": string,
        "amount": number,
        "type": string,
        "status": string,
        "createdAt": string,
        "reference": string
      }
    ],
    "createdAt": string,
    "metadata"?: object
  }
}
```

---

### 4.3 Export Customers to CSV

**Endpoint:** `GET /api/providers/customers/export`

**Description:** Exports customer list to CSV format.

**Query Parameters:** (Same as Get Customers)

**Response:**
- Content-Type: `text/csv`
- Content-Disposition: `attachment; filename="customers_2025-01-15.csv"`

**CSV Format:**
```csv
Name,Email,Phone,Location,Total Orders,Total Spent
John Doe,john@example.com,+1234567890,Lagos,15,150000
```

---

## 5. Subscriptions

### 5.1 Get Subscriptions

**Endpoint:** `GET /api/providers/subscriptions`

**Description:** Retrieves paginated list of subscriptions with filtering.

**Query Parameters:**
- `page` (optional, number): Page number. Default: 1
- `limit` (optional, number): Items per page. Default: 10, Max: 100
- `search` (optional, string): Search by member name or email
- `status` (optional, string[]): Filter by status - `new`, `active`, `expiring_soon`, `expired`
- `plan` (optional, string): Filter by plan name
- `startDate` (optional, string): ISO 8601 date filter
- `endDate` (optional, string): ISO 8601 date filter
- `sortBy` (optional, string): `memberName`, `plan`, `startDate`, `endDate`, `status`. Default: `endDate`
- `sortOrder` (optional, string): `asc`, `desc`. Default: `desc`

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "subscribers": [
      {
        "_id": string,
        "userId": string | {
          "_id": string,
          "email": string,
          "name": string,
          "phone": string
        },
        "providerId": string,
        "planName": string,
        "planType": string,
        "amount": number,                 // Subscription amount
        "currency": string,               // "NGN"
        "startDate": string,              // ISO 8601
        "expiryDate": string,             // ISO 8601
        "status": string,                 // Backend status
        "autoRenew": boolean,
        "renewalReminderSent": boolean,
        "transactionReference"?: string,
        "createdAt": string,
        "updatedAt": string
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "totalPages": number
    },
    "summary": {
      "totalSubscriptions": number,
      "activeCount": number,
      "expiringSoonCount": number,
      "expiredCount": number,
      "availablePlans": string[]          // Unique plan names
    }
  }
}
```

**Note:** UI derives status from dates (`New`, `Active`, `Expiring Soon`, `Expired`), but API returns raw status. Backend should compute derived status or UI should continue deriving it.

---

### 5.2 Get Subscription by ID

**Endpoint:** `GET /api/providers/subscriptions/{subscriptionId}`

**Description:** Retrieves detailed subscription information.

**Path Parameters:**
- `subscriptionId` (required, string): Subscription identifier

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "_id": string,
    "userId": {
      "_id": string,
      "email": string,
      "name": string,
      "phone": string
    },
    "providerId": string,
    "planName": string,
    "planType": string,
    "amount": number,
    "currency": string,
    "startDate": string,
    "expiryDate": string,
    "status": string,
    "autoRenew": boolean,
    "renewalReminderSent": boolean,
    "transactionReference"?: string,
    "paymentHistory": [                  // Payment transactions for this subscription
      {
        "_id": string,
        "amount": number,
        "date": string,
        "status": string,
        "reference": string
      }
    ],
    "createdAt": string,
    "updatedAt": string
  }
}
```

---

### 5.3 Create Subscription

**Endpoint:** `POST /api/providers/subscriptions`

**Description:** Creates a new subscription for a customer.

**Request Body:**
```typescript
{
  "customerId": string,                  // Customer/user ID
  "planName": string,                    // Plan name (must exist)
  "startDate": string,                   // ISO 8601 date
  "endDate": string,                     // ISO 8601 date
  "amount"?: number,                     // Optional, defaults to plan amount
  "currency"?: string,                   // Optional, defaults to "NGN"
  "autoRenew"?: boolean,                 // Default: false
  "notes"?: string                        // Optional notes
}
```

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "_id": string,
    "userId": string,
    "providerId": string,
    "planName": string,
    "planType": string,
    "amount": number,
    "currency": string,
    "startDate": string,
    "expiryDate": string,
    "status": string,
    "autoRenew": boolean,
    "renewalReminderSent": false,
    "createdAt": string,
    "updatedAt": string
  },
  "message": "Subscription created successfully"
}
```

**Validation Errors:**
```typescript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "customerId": ["Customer not found"],
      "planName": ["Invalid plan name"],
      "endDate": ["End date must be after start date"]
    }
  }
}
```

---

### 5.4 Update Subscription

**Endpoint:** `PUT /api/providers/subscriptions/{subscriptionId}`

**Description:** Updates an existing subscription.

**Path Parameters:**
- `subscriptionId` (required, string): Subscription identifier

**Request Body:**
```typescript
{
  "planName"?: string,
  "startDate"?: string,
  "endDate"?: string,
  "amount"?: number,
  "autoRenew"?: boolean,
  "notes"?: string
}
```

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "_id": string,
    // ... updated subscription object
    "updatedAt": string
  },
  "message": "Subscription updated successfully"
}
```

---

### 5.5 Cancel Subscription

**Endpoint:** `DELETE /api/providers/subscriptions/{subscriptionId}`

**Description:** Cancels an active subscription.

**Path Parameters:**
- `subscriptionId` (required, string): Subscription identifier

**Query Parameters:**
- `refund" (optional, boolean): Whether to issue refund. Default: false

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "_id": string,
    "status": "cancelled",
    "cancelledAt": string,
    "refundAmount"?: number              // If refund was issued
  },
  "message": "Subscription cancelled successfully"
}
```

---

### 5.6 Get Available Plans

**Endpoint:** `GET /api/providers/subscriptions/plans`

**Description:** Retrieves available subscription plans for the provider.

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "plans": [
      {
        "name": string,                   // Plan name
        "type": string,                   // Plan type
        "amount": number,                 // Price
        "currency": string,               // Currency code
        "duration": number,               // Duration in days
        "features": string[],             // Plan features
        "isActive": boolean
      }
    ]
  }
}
```

---

## 6. Notifications / Reminders

### 6.1 Send Notification

**Endpoint:** `POST /api/providers/notifications/send`

**Description:** Sends push notification to one or more customers.

**Request Body:**
```typescript
{
  "recipients": string[] | "all",         // Array of customer IDs or "all"
  "title": string,                        // Notification title
  "message": string,                      // Notification message
  "link"?: string,                        // Optional action link
  "type"?: string,                        // "general" | "reminder" | "promotion"
  "metadata"?: object                     // Additional metadata
}
```

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "notificationId": string,
    "recipientCount": number,
    "sentCount": number,
    "failedCount": number,
    "status": "sent" | "partial" | "failed",
    "createdAt": string
  },
  "message": "Notification sent successfully"
}
```

---

### 6.2 Send Subscription Reminder

**Endpoint:** `POST /api/providers/subscriptions/reminders/send`

**Description:** Sends reminder notifications for expiring or expired subscriptions.

**Request Body:**
```typescript
{
  "subscriptionIds": string[],            // Array of subscription IDs
  "reminderType": "expiring" | "expired" | "individual",
  "title": string,                        // Optional, will be auto-generated if not provided
  "message": string,                      // Optional, will be auto-generated if not provided
  "customMessage"?: string                // Optional custom message override
}
```

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "reminderId": string,
    "subscriptionCount": number,
    "sentCount": number,
    "failedCount": number,
    "reminderType": string,
    "createdAt": string
  },
  "message": "Reminder notifications sent successfully"
}
```

---

### 6.3 Get Notification History

**Endpoint:** `GET /api/providers/notifications/history`

**Description:** Retrieves sent notification history.

**Query Parameters:**
- `page` (optional, number): Page number. Default: 1
- `limit` (optional, number): Items per page. Default: 10, Max: 100
- `type` (optional, string): Filter by notification type
- `startDate` (optional, string): ISO 8601 date filter
- `endDate` (optional, string): ISO 8601 date filter

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": string,
        "title": string,
        "message": string,
        "type": string,
        "recipientCount": number,
        "sentCount": number,
        "failedCount": number,
        "status": string,
        "createdAt": string
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "totalPages": number
    }
  }
}
```

---

## 7. Settings

### 7.1 Get Provider Settings

**Endpoint:** `GET /api/providers/settings`

**Description:** Retrieves all provider settings.

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "general": {
      "facilityName": string,
      "facilityType": string,             // "Facility" | "Clinic" | "Hospital"
      "providerDescription": string,
      "country": string,
      "city": string,
      "address": string,
      "postalCode": string,
      "services": string[]                // Array of service names
    },
    "account": {
      "fullName": string,
      "email": string,
      "phone": string,
      "avatar"?: string
    },
    "payouts": {
      // Same as Get Payout Settings
    },
    "paymentBilling": {
      "paymentMethods": [
        {
          "id": string,
          "type": string,                  // "visa", "mastercard", etc.
          "last4": string,
          "expiry": string,               // "MM/YY"
          "isDefault": boolean
        }
      ],
      "billingEmail": string,
      "billingPeriod": string,            // "monthly" | "yearly"
      "currentPlan": {
        "name": string,
        "amount": number,
        "currency": string,
        "billingDate": string,            // Next billing date
        "daysRemaining": number
      },
      "billingHistory": [
        {
          "invoice": string,
          "date": string,
          "plan": string,
          "amount": number,
          "currency": string
        }
      ]
    },
    "timeLanguage": {
      "timezone": string,                 // IANA timezone (e.g., "America/Los_Angeles")
      "language": string,                 // ISO 639-1 code (e.g., "en-US")
      "dateFormat": string,               // "MM/DD/YYYY" | "DD/MM/YYYY"
      "timeFormat": string                // "12h" | "24h"
    }
  }
}
```

---

### 7.2 Update General Settings

**Endpoint:** `PUT /api/providers/settings/general`

**Description:** Updates general provider information.

**Request Body:**
```typescript
{
  "facilityName": string,
  "facilityType": string,
  "providerDescription": string,
  "country": string,
  "city": string,
  "address": string,
  "postalCode": string,
  "services": string[]
}
```

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "general": {
      // Updated general settings
      "updatedAt": string
    }
  },
  "message": "General settings updated successfully"
}
```

---

### 7.3 Update Account Settings

**Endpoint:** `PUT /api/providers/settings/account`

**Description:** Updates account information.

**Request Body:**
```typescript
{
  "fullName": string,
  "email": string,
  "phone"?: string
}
```

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "account": {
      // Updated account settings
      "updatedAt": string
    }
  },
  "message": "Account settings updated successfully"
}
```

**Note:** Email change may require verification.

---

### 7.4 Update Password

**Endpoint:** `PUT /api/providers/settings/password`

**Description:** Updates user password.

**Request Body:**
```typescript
{
  "currentPassword": string,
  "newPassword": string
}
```

**Response Structure:**
```typescript
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Error Response (Invalid Current Password):**
```typescript
{
  "success": false,
  "error": {
    "code": "INVALID_PASSWORD",
    "message": "Current password is incorrect"
  }
}
```

---

### 7.5 Update Payment & Billing Settings

**Endpoint:** `PUT /api/providers/settings/payment-billing`

**Description:** Updates payment methods and billing information.

**Request Body:**
```typescript
{
  "paymentMethods"?: [
    {
      "type": string,
      "last4": string,
      "expiry": string,
      "isDefault": boolean
    }
  ],
  "billingEmail"?: string,
  "billingPeriod"?: string
}
```

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "paymentBilling": {
      // Updated payment billing settings
      "updatedAt": string
    }
  },
  "message": "Payment and billing settings updated successfully"
}
```

---

### 7.6 Add Payment Method

**Endpoint:** `POST /api/providers/settings/payment-methods`

**Description:** Adds a new payment method.

**Request Body:**
```typescript
{
  "type": string,                         // "visa", "mastercard", etc.
  "cardNumber": string,                   // Full card number (will be encrypted)
  "expiryMonth": number,                  // 1-12
  "expiryYear": number,                  // YYYY
  "cvv": string,                          // Card security code
  "cardholderName": string,
  "isDefault": boolean
}
```

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "paymentMethod": {
      "id": string,
      "type": string,
      "last4": string,
      "expiry": string,
      "isDefault": boolean,
      "createdAt": string
    }
  },
  "message": "Payment method added successfully"
}
```

---

### 7.7 Remove Payment Method

**Endpoint:** `DELETE /api/providers/settings/payment-methods/{methodId}`

**Description:** Removes a payment method.

**Path Parameters:**
- `methodId` (required, string): Payment method identifier

**Response Structure:**
```typescript
{
  "success": true,
  "message": "Payment method removed successfully"
}
```

---

### 7.8 Update Time & Language Settings

**Endpoint:** `PUT /api/providers/settings/time-language`

**Description:** Updates timezone and language preferences.

**Request Body:**
```typescript
{
  "timezone": string,                     // IANA timezone
  "language": string,                     // ISO 639-1 code
  "dateFormat"?: string,
  "timeFormat"?: string
}
```

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "timeLanguage": {
      // Updated time language settings
      "updatedAt": string
    }
  },
  "message": "Time and language settings updated successfully"
}
```

---

## 8. Team Management

### 8.1 Get Team Members

**Endpoint:** `GET /api/providers/team/members`

**Description:** Retrieves list of team members.

**Query Parameters:**
- `page` (optional, number): Page number. Default: 1
- `limit` (optional, number): Items per page. Default: 10, Max: 100
- `search` (optional, string): Search by name or email
- `role` (optional, string): Filter by role
- `status` (optional, string): Filter by status - `active`, `pending`, `inactive`
- `sortBy` (optional, string): `name`, `email`, `role`, `status`, `invitedAt`. Default: `name`
- `sortOrder` (optional, string): `asc`, `desc`. Default: `asc`

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "members": [
      {
        "id": string,
        "name": string,
        "email": string,
        "role": string,                   // "Owner" | "Admin" | "Manager" | "Staff"
        "status": string,                 // "active" | "pending" | "inactive"
        "invitedAt": string,              // ISO 8601
        "joinedAt"?: string,              // ISO 8601 (if status is active)
        "lastActive"?: string,            // ISO 8601
        "permissions": string[]           // Array of permission strings
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "totalPages": number
    },
    "summary": {
      "totalMembers": number,
      "activeCount": number,
      "pendingCount": number
    }
  }
}
```

**Missing Endpoint:** Currently UI uses mock data. This endpoint needs to be implemented.

---

### 8.2 Invite Team Member

**Endpoint:** `POST /api/providers/team/members/invite`

**Description:** Sends invitation to a new team member.

**Request Body:**
```typescript
{
  "name": string,
  "email": string,
  "role": string                         // "Admin" | "Manager" | "Staff"
}
```

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "invitationId": string,
    "member": {
      "id": string,
      "name": string,
      "email": string,
      "role": string,
      "status": "pending",
      "invitedAt": string
    }
  },
  "message": "Invitation sent successfully"
}
```

**Error Response (Duplicate Email):**
```typescript
{
  "success": false,
  "error": {
    "code": "DUPLICATE_EMAIL",
    "message": "User with this email already exists"
  }
}
```

---

### 8.3 Resend Invitation

**Endpoint:** `POST /api/providers/team/members/{memberId}/resend-invitation`

**Description:** Resends invitation to a pending team member.

**Path Parameters:**
- `memberId` (required, string): Team member identifier

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "invitationId": string,
    "resentAt": string
  },
  "message": "Invitation resent successfully"
}
```

---

### 8.4 Update Team Member Role

**Endpoint:** `PUT /api/providers/team/members/{memberId}/role`

**Description:** Updates role of a team member.

**Path Parameters:**
- `memberId` (required, string): Team member identifier

**Request Body:**
```typescript
{
  "role": string                         // "Admin" | "Manager" | "Staff"
}
```

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "member": {
      "id": string,
      "role": string,
      "updatedAt": string
    }
  },
  "message": "Role updated successfully"
}
```

---

### 8.5 Remove Team Member

**Endpoint:** `DELETE /api/providers/team/members/{memberId}`

**Description:** Removes a team member from the provider.

**Path Parameters:**
- `memberId` (required, string): Team member identifier

**Query Parameters:**
- `force" (optional, boolean): Force remove even if member has active sessions. Default: false

**Response Structure:**
```typescript
{
  "success": true,
  "message": "Team member removed successfully"
}
```

**Error Response (Cannot Remove Owner):**
```typescript
{
  "success": false,
  "error": {
    "code": "CANNOT_REMOVE_OWNER",
    "message": "Cannot remove the provider owner"
  }
}
```

---

## 9. Analytics

### 9.1 Get Analytics Overview

**Endpoint:** `GET /api/providers/analytics/overview`

**Description:** Retrieves comprehensive analytics overview.

**Query Parameters:**
- `period` (optional, string): `daily`, `weekly`, `monthly`, `yearly`. Default: `monthly`
- `startDate` (optional, string): ISO 8601 date
- `endDate` (optional, string): ISO 8601 date

**Response Structure:**
```typescript
{
  "success": true,
  "data": {
    "revenue": {
      "total": number,
      "change": number,                   // Percentage change
      "trend": "up" | "down" | "stable"
    },
    "transactions": {
      "total": number,
      "successful": number,
      "failed": number,
      "change": number
    },
    "customers": {
      "total": number,
      "new": number,
      "active": number,
      "change": number
    },
    "subscriptions": {
      "total": number,
      "active": number,
      "expiring": number,
      "change": number
    },
    "period": {
      "start": string,
      "end": string,
      "type": string
    }
  }
}
```

---

### 9.2 Export Dashboard Data

**Endpoint:** `GET /api/providers/dashboard/export`

**Description:** Exports dashboard data in various formats.

**Query Parameters:**
- `format` (required, string): `csv` | `xlsx` | `pdf`
- `period` (optional, string): Time period
- `startDate` (optional, string): ISO 8601 date
- `endDate` (optional, string): ISO 8601 date
- `includeCharts" (optional, boolean): Include chart images in PDF. Default: false

**Response:**
- Content-Type: Based on format
- Content-Disposition: `attachment; filename="dashboard_export_2025-01-15.csv"`

---

## 10. Common Patterns

### 10.1 Authentication

All endpoints require authentication via Bearer token:

```
Authorization: Bearer <token>
```

Tokens are obtained via `/auth/signin` endpoint.

---

### 10.2 Pagination

Standard pagination response structure:

```typescript
{
  "pagination": {
    "page": number,                      // Current page (1-indexed)
    "limit": number,                     // Items per page
    "total": number,                     // Total items
    "totalPages": number                 // Total pages
  }
}
```

---

### 10.3 Error Response Format

All errors follow this structure:

```typescript
{
  "success": false,
  "error": {
    "code": string,                      // Error code (e.g., "VALIDATION_ERROR", "NOT_FOUND")
    "message": string,                    // Human-readable message
    "details"?: object | string[]         // Additional error details
  },
  "timestamp": string                     // ISO 8601 timestamp
}
```

**Common Error Codes:**
- `UNAUTHORIZED` (401): Invalid or missing authentication
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Request validation failed
- `CONFLICT` (409): Resource conflict (e.g., duplicate email)
- `INTERNAL_SERVER_ERROR` (500): Server error

---

### 10.4 Date Formats

- All dates in API responses use ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`
- Date-only fields use: `YYYY-MM-DD`
- Query parameters accept ISO 8601 or Unix timestamp

---

### 10.5 Currency

- All amounts are in the smallest currency unit (e.g., kobo for NGN, cents for USD)
- Currency codes follow ISO 4217 standard
- Default currency: NGN (Nigerian Naira)

---

## Missing Endpoints Summary

### Critical Missing Endpoints:

1. **Team Management** - All endpoints (`/api/providers/team/*`)
   - Currently UI uses mock data
   - Need full CRUD operations

2. **Customer Location Field** - `/api/providers/customers`
   - UI expects `location` field but API doesn't provide it

3. **Income Chart Data** - `/api/providers/dashboard/income-chart`
   - UI has chart but no dedicated endpoint for time-series data

4. **Recent Activities** - `/api/providers/dashboard/recent-activities`
   - UI displays recent activities but no dedicated endpoint

5. **Analytics Endpoints** - `/api/providers/analytics/*`
   - Dashboard download functionality needs analytics export

6. **Payment Method Management** - `/api/providers/settings/payment-methods/*`
   - Add/remove payment methods endpoints

7. **Subscription Plans** - `/api/providers/subscriptions/plans`
   - Get available plans endpoint

8. **Notification History** - `/api/providers/notifications/history`
   - Track sent notifications

---

## Field Mismatches

### 1. Customer Location
- **UI Expects:** `location` field in customer object
- **API Provides:** Not present
- **Resolution:** Add `location` field to customer model and API response

### 2. Subscription Status
- **UI Expects:** Derived status (`New`, `Active`, `Expiring Soon`, `Expired`)
- **API Provides:** Raw status string
- **Resolution:** Either compute derived status in backend or continue deriving in frontend

### 3. Transaction Status Mapping
- **UI Expects:** `Failed`, `Settled`, `Pending`
- **API Provides:** Various status strings
- **Resolution:** Standardize status values or provide mapping in API

### 4. Payout Invoice Format
- **UI Expects:** Invoice number format like "#890776"
- **API Should Provide:** Consistent invoice number format

---

## RESTful Structure Recommendations

### Base URL Structure:
```
/api/providers/{resource}/{id?}/{action?}
```

### Resource Naming:
- Use plural nouns: `customers`, `subscriptions`, `transactions`
- Use kebab-case for multi-word resources: `payment-methods`, `recent-activities`

### Action Endpoints:
- Use sub-resources for actions: `/subscriptions/{id}/cancel`
- Avoid verbs in URLs: Use `POST /subscriptions/{id}/cancel` instead of `POST /cancel-subscription`

### Query Parameters:
- Use standard names: `page`, `limit`, `sortBy`, `sortOrder`
- Use consistent filtering: `status[]`, `type[]` for arrays

### HTTP Methods:
- `GET`: Retrieve resources
- `POST`: Create resources or perform actions
- `PUT`: Full update
- `PATCH`: Partial update (if needed)
- `DELETE`: Remove resources

---

## Implementation Priority

### Phase 1 (Critical - Blocking UI):
1. Team Management endpoints
2. Customer location field
3. Income chart data endpoint
4. Recent activities endpoint

### Phase 2 (High Priority):
1. Analytics endpoints
2. Payment method management
3. Subscription plans endpoint
4. Notification history

### Phase 3 (Enhancements):
1. Advanced filtering options
2. Bulk operations
3. Webhook support
4. Real-time updates (WebSocket)

---

**End of Specification**
