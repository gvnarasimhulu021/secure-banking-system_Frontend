# Secure Banking System - React Frontend ✅

## 🚀 Frontend Implementation Complete

This is a complete React frontend for the Secure Banking System with all features implemented and tested.

---

## 📋 Project Structure

```
src/
├── components/
│   ├── AppNavbar.jsx          # Navigation bar with user info & logout
│   ├── ErrorAlert.jsx         # Error message component
│   ├── LoadingSpinner.jsx     # Loading indicator
│   ├── ProtectedRoute.jsx     # Protected route wrapper for auth
│   └── Toast.jsx              # Toast notifications
├── pages/
│   ├── LoginPage.jsx          # Login with JWT token storage
│   ├── RegisterPage.jsx       # User registration
│   ├── UserDashboard.jsx      # Main dashboard with balance & transactions
│   ├── AccountDetails.jsx     # View account information
│   ├── DepositWithdraw.jsx    # Deposit & withdraw operations
│   ├── Transactions.jsx       # Transaction history
│   ├── AdminDashboard.jsx     # Admin panel for user management
│   └── NotFound.jsx           # 404 page
├── services/
│   ├── apiService.js          # Axios instance with interceptors
│   ├── authService.js         # Authentication & token management
│   ├── accountService.js      # Account operations API
│   └── config.js              # API base URL configuration
├── utils/
│   ├── jwt.js                 # JWT decoding utilities
│   └── storage.js             # LocalStorage helper functions
├── App.jsx                     # Main app with routing
├── main.jsx                    # React DOM render
└── index.css                   # Global styles & animations
```

---

## ✨ Features Implemented

### 1. **Authentication System**
- ✅ User Registration with validation
- ✅ User Login with JWT token storage
- ✅ Auto-redirect based on user role (USER → Dashboard, ADMIN → Admin Panel)
- ✅ Token expiration checking
- ✅ Logout functionality
- ✅ Protected routes with role-based access

### 2. **User Dashboard**
- ✅ Display user full name
- ✅ Display account balance in real-time
- ✅ Show account summary (status, joined date, account number)
- ✅ Profile information card

### 3. **Banking Operations**
- ✅ **Deposit Money** - POST `/api/account/deposit?amount=1000`
- ✅ **Withdraw Money** - POST `/api/account/withdraw?amount=500`
- ✅ **Transfer Money** - POST `/api/account/transfer?toEmail=test@gmail.com&amount=200`
- ✅ Real-time balance updates
- ✅ Form validation (amounts, email format)
- ✅ Insufficient balance detection

### 4. **Admin Dashboard**
- ✅ User management interface
- ✅ View all users with details
- ✅ User deletion with confirmation
- ✅ Role-based access control

### 5. **API Service**
- ✅ Axios instance with automatic JWT token attachment
- ✅ Authorization header: `Bearer <token>`
- ✅ Automatic 401 handling (logout & redirect to login)
- ✅ Error handling with user-friendly messages

### 6. **UI/UX**
- ✅ Modern gradient design (purple/blue)
- ✅ Card-based layout
- ✅ Responsive Bootstrap grid
- ✅ Smooth animations (float, slide-up, slide-down)
- ✅ Loading spinners during API calls
- ✅ Toast notifications for user feedback
- ✅ Hover effects on buttons
- ✅ Disabled states during loading

### 7. **Security**
- ✅ JWT token stored in localStorage
- ✅ Token validation before route access
- ✅ Automatic logout on 401 error
- ✅ Protected API calls with Bearer token
- ✅ Role-based route protection

---

## 🔧 All Endpoints Fixed and Updated

### Account Endpoints (User)
```javascript
GET    /api/account/details        // Get account & user details
GET    /api/account/balance        // Get current balance
POST   /api/account/deposit?amount=1000        // Deposit money
POST   /api/account/withdraw?amount=500        // Withdraw money
POST   /api/account/transfer?toEmail=user@mail.com&amount=200  // Transfer
GET    /api/transactions           // Get transaction history
```

### Admin Endpoints
```javascript
GET    /api/admin/users            // Get all users
DELETE /api/admin/delete?id=123    // Delete user by ID
```

### Auth Endpoints
```javascript
POST   /api/auth/register          // Register new user
POST   /api/auth/login             // Login & get JWT token
```

---

## 🔒 Token Management

### Login Flow
1. User enters email & password
2. Server returns JWT token
3. Token stored in localStorage with key `banking_app_token`
4. Token automatically attached to all API requests via axios interceptor
5. On 401 error → automatic logout & redirect to login

### Token Structure
JWT tokens are decoded to extract:
- `role` - User role (ADMIN or USER)
- `exp` - Expiration time
- Other user claims

---

## 📱 Pages & Routes

| Route | Component | Access | Purpose |
|-------|-----------|--------|---------|
| `/login` | LoginPage | Public | User login |
| `/register` | RegisterPage | Public | New user registration |
| `/dashboard` | UserDashboard | Protected (USER) | Main dashboard |
| `/account` | AccountDetails | Protected (USER) | Account info |
| `/deposit-withdraw` | DepositWithdraw | Protected (USER) | Deposit/Withdraw |
| `/transactions` | Transactions | Protected (USER) | Transaction history |
| `/admin` | AdminDashboard | Protected (ADMIN) | Admin panel |
| `*` | NotFound | Public | 404 page |

---

## 🎨 UI Components

### Toast Notifications
```javascript
import { toast } from 'react-toastify';

toast.success('Operation successful!');
toast.error('An error occurred');
toast.info('Information message');
toast.warning('Warning message');
```

### Loading Spinner
```javascript
<LoadingSpinner message="Loading your dashboard..." />
```

### Error Alert
```javascript
<ErrorAlert message="Unable to load data" />
```

### Protected Routes
```javascript
<ProtectedRoute requiredRole="ADMIN">
  <AdminDashboard />
</ProtectedRoute>
```

---

## 📦 Dependencies

```json
{
  "axios": "^1.5.0",              // HTTP client
  "bootstrap": "^5.3.2",          // CSS framework
  "react": "^18.3.1",             // UI library
  "react-dom": "^18.3.1",         // React DOM
  "react-router-dom": "^6.14.1",  // Routing
  "react-toastify": "^11.0.5"     // Toast notifications
}
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Backend URL
Edit `src/services/config.js`:
```javascript
export const API_BASE_URL = "http://localhost:8080";
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

---

## 📡 Backend Requirements

The backend should be running at `http://localhost:8080` with these endpoints:

### Required Auth Endpoints
```javascript
POST /api/auth/register
POST /api/auth/login
```

### Required Account Endpoints
```javascript
GET    /api/account/details
GET    /api/account/balance
POST   /api/account/deposit
POST   /api/account/withdraw
POST   /api/account/transfer
GET    /api/transactions
```

### Required Admin Endpoints
```javascript
GET    /api/admin/users
DELETE /api/admin/delete
```

**Important:** All banking operations use `@RequestParam` (query parameters), NOT JSON body.

---

## 🔐 Security Features

1. **JWT Authentication** - Secure token-based auth
2. **Local Storage** - Token stored securely in localStorage
3. **Bearer Token** - Auto-attached to all requests
4. **401 Interception** - Auto-logout on unauthorized
5. **Protected Routes** - Role-based access control
6. **Token Validation** - Checks expiration before access
7. **Input Validation** - Email, amount, and form validation

---

## 🐛 Error Handling

- Server errors (4xx, 5xx) show user-friendly messages
- 401 errors trigger automatic logout
- Network errors are caught and displayed
- Toast notifications for all operations
- Console logging for debugging

---

## ✅ Testing Checklist

- [x] Frontend builds without errors
- [x] Login/Register flows work
- [x] Protected routes redirect unauthorized users
- [x] JWT token stored in localStorage
- [x] API calls include Bearer token
- [x] 401 errors logout user
- [x] Dashboard loads account data
- [x] Deposit/Withdraw operations work
- [x] Transfer with email validation
- [x] Admin dashboard shows users
- [x] Responsive design on mobile/tablet/desktop
- [x] Toast notifications display correctly
- [x] Loading spinners appear during API calls
- [x] Role-based routing (ADMIN vs USER)

---

## 📝 Notes

- Frontend is production-ready
- All API endpoints are correctly configured with `/api` prefix
- Animations are smooth and performant
- Bootstrap responsive grid ensures mobile compatibility
- React Router v6 with modern hooks
- Error boundary ready for implementation if needed

---

## 🔗 Backend Repository
https://github.com/gvnarasimhulu021/secure-banking-system

---

**Status:** ✅ **COMPLETE AND READY TO RUN**

Start the dev server and test with your backend!
