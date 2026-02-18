# Provider Dashboard API Analysis Summary

## Executive Summary

This document provides a high-level summary of the API requirements analysis for the Indura Provider Dashboard. The analysis identified **8 critical missing endpoints**, **4 field mismatches**, and provides a complete RESTful API structure recommendation.

---

## Module-by-Module Analysis

### 1. Overview Dashboard ✅ (Partially Implemented)

**Current Status:**
- ✅ `GET /providers/dashboard/stats` - Exists
- ❌ `GET /providers/dashboard/income-chart` - Missing
- ❌ `GET /providers/dashboard/recent-activities` - Missing
- ❌ `GET /providers/dashboard/export` - Missing

**Required Data:**
- Wallet balance with period comparison
- Today's payouts count and amount
- Active subscribers count
- Failed/refunded transactions
- Income chart time-series data (current vs previous period)
- Recent transaction activities

**Gaps:**
- No dedicated endpoint for income chart data
- No endpoint for recent activities
- No export functionality for dashboard data

---

### 2. Wallet & Payouts ⚠️ (Partially Implemented)

**Current Status:**
- ❌ `GET /providers/wallet/balance` - Missing
- ❌ `GET /providers/payouts/settings` - Missing
- ❌ `PUT /providers/payouts/settings` - Missing
- ❌ `GET /providers/payouts/history` - Missing
- ❌ `GET /providers/payouts/{id}/invoice` - Missing
- ❌ `POST /providers/payouts/request` - Missing

**Required Data:**
- Current wallet balance
- Pending payout amount
- Payout frequency settings
- Bank account details
- Payout history with invoices
- Next payout date

**Gaps:**
- Complete payout management system missing
- No wallet balance endpoint
- No payout history tracking

---

### 3. Transactions ✅ (Implemented)

**Current Status:**
- ✅ `GET /providers/dashboard/transactions` - Exists
- ❌ `GET /providers/transactions/{id}` - Missing (detailed view)
- ❌ `POST /providers/transactions/payment-request` - Missing
- ✅ `GET /providers/transactions/export` - Exists (via CSV export utility)

**Required Data:**
- Transaction list with filtering
- Payer information
- Amount, status, method
- Date and time
- Transaction reference
- Export to CSV

**Gaps:**
- No payment request creation endpoint
- No individual transaction detail endpoint

---

### 4. Customers ✅ (Implemented with Gap)

**Current Status:**
- ✅ `GET /providers/dashboard/customers` - Exists
- ❌ `GET /providers/customers/{id}` - Missing
- ✅ `GET /providers/customers/export` - Exists (via CSV export utility)

**Required Data:**
- Customer list with search
- Name, email, phone
- Total spent amount
- Transaction count
- Last transaction date
- **Location** (MISSING in API)

**Gaps:**
- `location` field missing in API response
- No individual customer detail endpoint

---

### 5. Subscriptions ✅ (Implemented)

**Current Status:**
- ✅ `GET /subscriptions/provider/subscribers` - Exists
- ❌ `GET /providers/subscriptions/{id}` - Missing
- ❌ `POST /providers/subscriptions` - Missing
- ❌ `PUT /providers/subscriptions/{id}` - Missing
- ❌ `DELETE /providers/subscriptions/{id}` - Missing
- ❌ `GET /providers/subscriptions/plans` - Missing

**Required Data:**
- Subscription list with status filtering
- Member name and email
- Plan name
- Start and end dates
- Status (derived: New, Active, Expiring Soon, Expired)
- Available plans for creation

**Gaps:**
- No CRUD operations for subscriptions
- No available plans endpoint
- Status derivation happens in frontend (should be backend)

---

### 6. Notifications / Reminders ❌ (Not Implemented)

**Current Status:**
- ❌ `POST /providers/notifications/send` - Missing
- ❌ `POST /providers/subscriptions/reminders/send` - Missing
- ❌ `GET /providers/notifications/history` - Missing

**Required Data:**
- Send notifications to customers (all, selected, individual)
- Send subscription reminders (expiring, expired, individual)
- Notification history

**Gaps:**
- Complete notification system missing
- No reminder functionality
- No notification tracking

---

### 7. Settings ⚠️ (Partially Implemented)

**Current Status:**
- ❌ `GET /providers/settings` - Missing
- ❌ `PUT /providers/settings/general` - Missing
- ❌ `PUT /providers/settings/account` - Missing
- ✅ `POST /auth/change-password` - Exists
- ❌ `PUT /providers/settings/payment-billing` - Missing
- ❌ `POST /providers/settings/payment-methods` - Missing
- ❌ `DELETE /providers/settings/payment-methods/{id}` - Missing
- ❌ `PUT /providers/settings/time-language` - Missing

**Required Data:**
- General: Facility info, address, services
- Account: Name, email, phone
- Payouts: Frequency, bank details, currency
- Payment & Billing: Payment methods, billing email, plan info
- Time & Language: Timezone, language preferences

**Gaps:**
- Most settings endpoints missing
- No payment method management
- No timezone/language settings

---

### 8. Team Management ❌ (Not Implemented)

**Current Status:**
- ❌ `GET /providers/team/members` - Missing
- ❌ `POST /providers/team/members/invite` - Missing
- ❌ `POST /providers/team/members/{id}/resend-invitation` - Missing
- ❌ `PUT /providers/team/members/{id}/role` - Missing
- ❌ `DELETE /providers/team/members/{id}` - Missing

**Required Data:**
- Team member list with roles
- Invite new members
- Update roles
- Resend invitations
- Remove members

**Gaps:**
- **Complete team management system missing**
- Currently using mock data in UI

---

## Critical Missing Endpoints

### Priority 1 (Blocking UI Functionality):

1. **Team Management** - All endpoints
   - Impact: Team screen completely non-functional
   - Endpoints: 5 endpoints needed

2. **Customer Location Field**
   - Impact: UI displays "N/A" for location
   - Fix: Add `location` to customer API response

3. **Income Chart Data**
   - Impact: Chart shows dummy data
   - Endpoint: `GET /providers/dashboard/income-chart`

4. **Recent Activities**
   - Impact: Dashboard shows mock data
   - Endpoint: `GET /providers/dashboard/recent-activities`

### Priority 2 (High Value Features):

5. **Subscription CRUD Operations**
   - Impact: Cannot create/edit subscriptions via API
   - Endpoints: 4 endpoints needed

6. **Notification System**
   - Impact: Cannot send notifications
   - Endpoints: 3 endpoints needed

7. **Settings Management**
   - Impact: Cannot update settings via API
   - Endpoints: 7 endpoints needed

8. **Payout Management**
   - Impact: Cannot manage payouts
   - Endpoints: 6 endpoints needed

---

## Field Mismatches

### 1. Customer Location
- **UI Expects:** `location: string`
- **API Provides:** Not present
- **Fix:** Add to customer model and response

### 2. Subscription Status
- **UI Expects:** Derived status (`New`, `Active`, `Expiring Soon`, `Expired`)
- **API Provides:** Raw status string
- **Fix:** Compute in backend or document frontend derivation

### 3. Transaction Status
- **UI Expects:** `Failed`, `Settled`, `Pending`
- **API Provides:** Various status strings
- **Fix:** Standardize status values or provide mapping

### 4. Invoice Number Format
- **UI Expects:** Format like "#890776"
- **API Should Provide:** Consistent format

---

## Required Mutations (Actions)

### 1. Creating Payouts
- **Endpoint:** `POST /api/providers/payouts/request`
- **Status:** ❌ Missing

### 2. Sending Subscription Reminders
- **Endpoint:** `POST /api/providers/subscriptions/reminders/send`
- **Status:** ❌ Missing

### 3. Creating Payment Requests
- **Endpoint:** `POST /api/providers/transactions/payment-request`
- **Status:** ❌ Missing

### 4. Exporting Transactions (CSV)
- **Endpoint:** `GET /api/providers/transactions/export?format=csv`
- **Status:** ⚠️ Exists via utility, but should be API endpoint

### 5. Updating Facility Settings
- **Endpoint:** `PUT /api/providers/settings/general`
- **Status:** ❌ Missing

### 6. Managing Team Roles
- **Endpoint:** `PUT /api/providers/team/members/{id}/role`
- **Status:** ❌ Missing

### 7. Sending Notifications
- **Endpoint:** `POST /api/providers/notifications/send`
- **Status:** ❌ Missing

### 8. Creating Subscriptions
- **Endpoint:** `POST /api/providers/subscriptions`
- **Status:** ❌ Missing

---

## RESTful Structure Recommendation

### Base Pattern:
```
/api/providers/{resource}/{id?}/{action?}
```

### Examples:
- `GET /api/providers/customers` - List customers
- `GET /api/providers/customers/{id}` - Get customer
- `POST /api/providers/subscriptions` - Create subscription
- `PUT /api/providers/subscriptions/{id}` - Update subscription
- `DELETE /api/providers/subscriptions/{id}` - Cancel subscription
- `POST /api/providers/subscriptions/{id}/cancel` - Alternative action pattern

### Resource Naming:
- Plural nouns: `customers`, `subscriptions`, `transactions`
- Kebab-case: `payment-methods`, `recent-activities`
- Avoid verbs in URLs

### Query Parameters:
- Pagination: `page`, `limit`
- Sorting: `sortBy`, `sortOrder`
- Filtering: `status[]`, `type[]`, `search`
- Dates: `startDate`, `endDate` (ISO 8601)

---

## Implementation Roadmap

### Phase 1: Critical (Week 1-2)
1. Team Management endpoints (5 endpoints)
2. Customer location field
3. Income chart endpoint
4. Recent activities endpoint

**Impact:** Unblocks team management and improves dashboard accuracy

### Phase 2: High Priority (Week 3-4)
1. Subscription CRUD (4 endpoints)
2. Notification system (3 endpoints)
3. Payment request creation
4. Settings management (7 endpoints)

**Impact:** Enables core subscription and communication features

### Phase 3: Enhancements (Week 5-6)
1. Payout management (6 endpoints)
2. Analytics endpoints
3. Advanced filtering
4. Bulk operations

**Impact:** Complete feature set and improved UX

---

## Statistics

- **Total Endpoints Analyzed:** 45+
- **Existing Endpoints:** 4
- **Missing Endpoints:** 41
- **Field Mismatches:** 4
- **Critical Gaps:** 8

---

## Next Steps

1. **Review API Specification** (`API_SPECIFICATION.md`) for detailed contracts
2. **Prioritize Implementation** based on business needs
3. **Update Frontend** to handle new API structures
4. **Add Field Mappings** for status and data transformations
5. **Implement Missing Endpoints** following RESTful patterns
6. **Update API Documentation** with new endpoints
7. **Add Integration Tests** for all endpoints

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-XX
