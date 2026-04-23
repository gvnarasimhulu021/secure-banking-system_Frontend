# Secure Banking System - Local Setup Guide

## ✅ Frontend Status
The React frontend has been fixed and is now running at **http://localhost:5173/**

### What was fixed:
- Added missing `isTokenValid()` function in authService
- Implemented proper JWT token handling and validation
- Fixed localStorage integration with utility functions
- Updated login/registration to work with backend API

### Frontend is running:
```
npm run dev
# Server running at http://localhost:5173/
```

---

## 🔴 Backend Setup Required

### Prerequisites:
- **Java 11+** (recommended Java 17 or later)
- **Maven 3.8+** or **Gradle** (based on your backend config)
- **Git** (to clone the backend repository)

### Step 1: Clone Backend Repository
```bash
cd /path/to/parent/directory
git clone https://github.com/gvnarasimhulu021/secure-banking-system.git
cd secure-banking-system
```

### Step 2: Check Backend Technology Stack
Based on the latest commits, the backend includes:
- **Spring Boot** (Java framework)
- **H2 Database** (in-memory database for development)
- **Docker Support** (multi-stage build)
- **JWT Authentication**

### Step 3: Build and Run Backend
```bash
# Using Maven
mvn clean install
mvn spring-boot:run

# OR using Gradle
./gradlew clean build
./gradlew bootRun
```

The backend should start on **http://localhost:8080/**

### Step 4: Expected API Endpoints
Your frontend expects these endpoints:
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `GET /user/profile` - Get logged-in user profile
- `GET /api/accounts` - Get user accounts
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions/deposit` - Deposit money
- `POST /api/transactions/withdraw` - Withdraw money
- `GET /api/admin/users` - Admin: Get all users

---

## 🔗 Frontend-Backend Integration

### API Base URL Configuration
Frontend is configured to use: `http://localhost:8080`

**File:** `src/services/config.js`
```javascript
export const API_BASE_URL = "http://localhost:8080";
```

### Token Handling
- Tokens are stored in localStorage with key: `banking_app_token`
- User profile stored with key: `banking_app_profile`
- All API requests include: `Authorization: Bearer {token}`

### CORS (Important!)
Your backend must enable CORS for `http://localhost:5173`

Add to backend Spring Boot config:
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:5173")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

---

## 🚀 Running Both Frontend & Backend

### Terminal 1: Frontend
```bash
cd c:\Users\venka\Desktop\ReactJs
npm run dev
# http://localhost:5173/
```

### Terminal 2: Backend
```bash
cd c:\path\to\secure-banking-system
mvn spring-boot:run
# http://localhost:8080/
```

### Test the Connection
1. Open http://localhost:5173/ in browser
2. You should see the **Login Page**
3. Register a new account or login with test credentials
4. If successful, you'll be redirected to the dashboard

---

## 🔧 Troubleshooting

### Frontend shows blank page?
- Check browser console (F12) for errors
- Clear localStorage and refresh: `localStorage.clear()`
- Restart Vite dev server: `npm run dev`

### API requests fail with 404?
- Ensure backend is running on port 8080
- Check API endpoint URLs in backend
- Verify CORS configuration

### CORS errors?
- Add CORS configuration to your backend Spring Boot app
- Ensure Origin header allows `http://localhost:5173`

### 401 Unauthorized?
- Token expired - logout and login again
- Backend JWT secret might not match frontend expectations
- Check JWT encoding/decoding

---

## 📝 Notes for Backend Changes

If you need to change the backend API endpoints or authentication flow:
1. **Tell me the changes** (don't modify backend yourself yet)
2. I'll update the frontend to match your backend API
3. Then you can implement those changes in the backend

Current Frontend API Expectations:
- Login response includes: `{ token: "jwt_token", ... }`
- Profile endpoint returns user info with `fullName`, `name`, `email`, `role`
- All protected endpoints require `Authorization: Bearer {token}` header
