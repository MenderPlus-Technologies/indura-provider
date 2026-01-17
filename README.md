# Indura Provider Dashboard

## Overview

Indura Provider Dashboard is the administrative interface for providers on the Indura platform, enabling gyms, wellness centers, and other service providers to manage their operations. This includes managing subscriptions, users, customers, communications, and transactions. The dashboard is built with React (Next.js), TypeScript, TailwindCSS, and Redux Toolkit.

The dashboard provides features such as:

- Subscription management for gyms, wellness, and fitness providers
- Customer and member management
- Communication via push notifications (bulk or individual)
- Team and role management for providers
- Transaction history and wallet management
- Analytics and reporting
- Settings management (plans, billing, team, security, notifications)

## Features

### 1. Subscriptions (Gym / Wellness Providers)

- View subscriptions by status: New, Active, Expiring Soon, Expired
- Filter subscriptions by plan, status, or date range
- Create new subscriptions via modal/drawer forms
- Send reminder notifications to users with expiring or expired subscriptions
- Auto-calculate subscription statuses based on start and end dates

### 2. Customer / Member Management

- View and manage all customers/members
- Filter by status, plan, or custom fields
- Access customer profiles and transaction history
- Send individual or bulk notifications

### 3. Communications

- Send bulk notifications to selected or all members
- Send individual notifications from customer profiles
- Reuse existing modals/drawers with consistent UI
- Loading, success, and error states are simulated (UI-first)

### 4. Team & Role Management

- Invite users and assign roles to team members
- Manage pending invitations, resend invites, and remove users
- Role assignment and editing inline or via modal
- Search and filter team members by role or status

### 5. Transactions & Wallet

- View provider wallet balance and transaction history
- Filter transactions by type (inflow, outflow), date, or status
- Export transaction data as CSV

### 6. Provider Settings

- Manage facility information, plans & billing
- Configure notifications, security, and team roles
- Multi-language and time zone settings

## Technology Stack

- **Frontend:** React (Next.js), TypeScript
- **UI / Styling:** TailwindCSS, shadcn/ui components, Lucide icons
- **State Management:** Redux Toolkit / RTK Query
- **Routing:** Next.js App Router
- **Form Handling:** React Hook Form (where applicable)
- **Charts & Analytics:** Recharts, custom components
- **Mocked Data:** Local state or mocked APIs for features not yet integrated

## Folder Structure

```
/indura-provider
├─ /app                # Next.js app folder (pages & layouts)
├─ /components         # Reusable UI components
├─ /store              # Redux Toolkit store, slices, and queries
├─ /constants          # Constants like page info, status values, etc.
├─ /utils              # Utility functions
├─ /types              # TypeScript types and interfaces
├─ /styles             # Global and component-level styles
├─ /public             # Static assets
├─ /mocks              # Mock data and placeholder APIs
```

## Setup Instructions

1. **Clone the repository**

```bash
git clone <repo-url>
cd indura-provider
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Run development server**

```bash
npm run dev
# or
yarn dev
```

The app runs on `http://localhost:3000` by default.



## Usage

- Navigate the dashboard using the sidebar or top navigation.
- Access modules based on provider capabilities:
  - **Subscriptions:** Only visible for providers who support subscriptions (e.g., gyms).
  - **Team Management:** Only visible for multi-user providers.
- Forms and tables use consistent styling, modals, and feedback patterns.
- Mocked notifications simulate push notifications for testing.

## Contribution Guidelines

- Follow existing component and state management patterns.
- Reuse existing components whenever possible.
- Keep all styling consistent with TailwindCSS + shadcn/ui design tokens.
- Use mocked data for features not yet integrated with real APIs.
- For new modules, always include:
  - UI first
  - Local state / mock handling
  - Clear path for future API integration

## Future Improvements

- Integrate backend APIs for subscriptions, notifications, and transactions
- Add automated notifications for expiring subscriptions
- Implement role-based access control (RBAC) fully
- Real-time updates and analytics dashboards
- Multi-language support fully wired

## License

This codebase is proprietary and maintained by MenderPlus / Indura.