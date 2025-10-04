# Demo Mode Guide

The frontend is now running in **DEMO MODE** - you can preview all UI elements without a backend connection!

## Quick Login

On the login page, click any of these chips for instant access:

- **Admin** - Full user management dashboard
- **Manager** - Expense approval queue with currency conversion
- **Employee** - Submit expenses and view history

Or manually type:
- Username: `admin`, `manager`, or `employee`
- Password: anything (ignored in demo mode)

## Features You Can Test

### As Admin
- View all users in the system
- Create new users (Employee, Manager, Admin)
- Assign managers to employees
- See company structure

### As Manager
- View pending expense requests from team
- See currency conversion (EUR → USD)
- Approve expenses (turns green)
- Reject expenses with comments
- View approved/rejected history

### As Employee
- Submit new expenses manually
- Upload receipt images (simulates OCR extraction)
- View expense history
- See approval status (Pending/Approved/Rejected)
- View rejection comments

## Demo Data Included

- 6 sample users (1 admin, 2 managers, 3 employees)
- 5 sample expenses with different statuses
- Multi-currency examples (USD, EUR)
- Realistic approval workflow

## Switching Roles

Just logout and login as a different user to see their dashboard!

## Turning Off Demo Mode

In `frontend/src/context/AuthContext.js`, change:
```javascript
const DEMO_MODE = true;
```
to:
```javascript
const DEMO_MODE = false;
```

Then connect to your backend API.
