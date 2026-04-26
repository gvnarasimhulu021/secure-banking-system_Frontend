# Narsi Frnd of Joy Bank - Frontend

A complete React.js frontend application for the Narsi Frnd of Joy Bank system, built with modern web technologies and connecting to a Spring Boot backend.

## 🚀 Tech Stack

- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios (with JWT interceptor)
- **State Management**: Context API
- **Backend**: Spring Boot (http://localhost:8080)

## 🎨 Features

### User Features
- **Secure Authentication**: JWT-based login/register system
- **Dashboard**: Real-time account overview with quick actions
- **Banking Operations**: Deposit, Withdraw, Transfer money
- **Transaction History**: Complete transaction logs with filtering
- **Profile Management**: Update personal information
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **Admin Dashboard**: System overview with metrics
- **User Management**: View, edit roles, and delete users
- **Account Management**: Monitor all bank accounts
- **Transaction Oversight**: View all system transactions
- **Role Control**: Assign and modify user roles

## 🏗️ Project Structure

```
src/
├── services/
│   ├── api.js              # Axios base instance with interceptors
│   ├── authService.js      # Authentication services
│   ├── userService.js      # User banking operations
│   └── adminService.js     # Admin operations
├── context/
│   └── AuthContext.jsx     # Global authentication state
├── components/
│   ├── UserSidebar.jsx     # User navigation sidebar
│   ├── AdminSidebar.jsx    # Admin navigation sidebar
│   ├── Topbar.jsx          # Page header with notifications
│   ├── PrivateRoute.jsx    # Route protection for authenticated users
│   └── AdminRoute.jsx      # Route protection for admin users
├── pages/
│   ├── auth/
│   │   ├── Login.jsx       # User/Admin login page
│   │   └── Register.jsx    # User registration page
│   ├── user/
│   │   ├── Dashboard.jsx   # User dashboard
│   │   ├── Deposit.jsx     # Money deposit
│   │   ├── Withdraw.jsx    # Money withdrawal
│   │   ├── Transfer.jsx    # Money transfer
│   │   ├── Transactions.jsx # Transaction history
│   │   └── Profile.jsx     # User profile management
│   └── admin/
│       ├── AdminDashboard.jsx # Admin dashboard
│       ├── Users.jsx       # User management
│       ├── Accounts.jsx    # Account management
│       ├── AdminTransactions.jsx # Transaction management
│       └── RoleControl.jsx # Role assignment
├── App.jsx                 # Main routing component
├── main.jsx               # Application entry point
└── index.css              # Global styles
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Spring Boot backend running on http://localhost:8080

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Narsi_FrontEnd
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

## 🔐 Authentication Flow

1. **Registration**: Users can register with name, email, and password
2. **Login**: Users/Admins login with email and password
3. **Role-based Access**: 
   - Users access banking features
   - Admins access administrative features
4. **JWT Tokens**: Stored in localStorage for session management

## 🎨 Design System

### Color Palette
- Primary: #085041 (Dark Green)
- Medium Green: #0F6E56
- Light Green BG: #E1F5EE
- Accent: #9FE1CB
- Danger: #A32D2D
- Light Red BG: #FCEBEB
- Info Blue: #185FA5
- Light Blue BG: #E6F1FB

### Design Principles
- Flat design with no gradients or shadows
- Border radius: 8px (small), 12px (cards)
- Font weights: 400 and 500 only
- Responsive and mobile-first approach

## 📱 API Integration

The frontend connects to the Spring Boot backend using the following API endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Operations
- `GET /api/user/account` - Get account details
- `POST /api/user/deposit` - Deposit money
- `POST /api/user/withdraw` - Withdraw money
- `POST /api/user/transfer` - Transfer money
- `GET /api/user/transactions` - Get transaction history
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Admin Operations
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/{id}` - Delete user
- `GET /api/admin/accounts` - Get all accounts
- `GET /api/admin/transactions` - Get all transactions
- `PUT /api/admin/update-role` - Update user role

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## 🌐 Deployment

### Production Build
1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your web server
3. Configure the backend URL in production environment
4. Ensure HTTPS is enabled for production

### Environment Variables
Create a `.env` file for production:
```env
VITE_API_BASE_URL=https://your-backend-api.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend allows requests from http://localhost:3000
2. **Authentication Issues**: Check JWT token in localStorage
3. **API Connection**: Verify backend is running on http://localhost:8080
4. **Build Errors**: Clear node_modules and reinstall dependencies

### Support
For issues and questions, please contact the development team.

---

**Narsi Frnd of Joy Bank** - Your trusted digital banking partner 🏦
