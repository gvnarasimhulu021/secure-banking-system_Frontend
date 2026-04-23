# Backend Configuration Summary - What You Need to Know

## ✅ Current Backend Status

Your backend is **already properly configured** with:

1. **CORS enabled** ✓
   - Location: `src/main/java/com/bankapp/config/CorsConfig.java`
   - Currently allows: `http://localhost:5173` (your frontend)
   - No changes needed

2. **JWT Authentication** ✓
   - Handles token generation on login/register
   - JwtFilter validates tokens on protected endpoints

3. **API Endpoints** ✓
   - `POST /api/auth/register` - Register user
   - `POST /api/auth/login` - Login user  
   - `GET /api/user/profile` - Get logged-in user profile
   - Other endpoints for accounts, transactions, etc.

4. **Database** ✓
   - Using H2 in-memory database (no setup needed)
   - Auto-creates schema on startup

---

## 🔴 Why You're Getting 403 Error

The **403 error means the backend is NOT running or not responding properly**.

When you try to register/login, the frontend sends a request to `http://localhost:8080/api/auth/register` or `/api/auth/login`, but the backend isn't there to respond.

---

## 📋 Backend Build & Run Instructions

### Step 1: Clone the Backend
```powershell
cd C:\Users\venka\Desktop
git clone https://github.com/gvnarasimhulu021/secure-banking-system.git backend
cd backend
```

### Step 2: Build the Backend (Maven)
```powershell
mvn clean install
```

**Expected Output:**
```
[INFO] BUILD SUCCESS
[INFO] Total time:  XX.XXs
```

### Step 3: Run the Backend
```powershell
mvn spring-boot:run
```

**Expected Output:**
```
Started SecureBankingSystemApplication in X.XXX seconds
```

The backend should now be running on: **http://localhost:8080/**

---

## ✅ Verify Backend is Running

Open terminal and test:
```powershell
curl http://localhost:8080/api/auth/login -X POST -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"123456\"}"
```

Or just open http://localhost:8080/ in browser - should show some response (not blank).

---

## 🔄 Backend-Frontend Integration Flow

### User Registration:
1. User enters: Full Name, Email, Password
2. Frontend sends: `POST http://localhost:8080/api/auth/register`
3. Backend creates user and returns JWT token
4. Frontend saves token to localStorage
5. Frontend fetches user profile: `GET http://localhost:8080/api/user/profile`
6. Frontend stores profile and redirects to dashboard

### User Login:
1. User enters: Email, Password
2. Frontend sends: `POST http://localhost:8080/api/auth/login`
3. Backend validates and returns JWT token
4. Frontend saves token and fetches profile
5. Dashboard loads

---

## 🛠️ Backend Code Structure

```
src/main/java/com/bankapp/
├── config/
│   └── CorsConfig.java          ← CORS configuration (ready)
├── controller/
│   ├── AuthController.java      ← /api/auth endpoints
│   ├── UserController.java      ← /api/user endpoints
│   └── ...
├── entity/
│   └── User.java                ← User database model
├── security/
│   ├── JwtUtil.java             ← JWT token generator
│   ├── JwtFilter.java           ← JWT validator filter
│   └── SecurityConfig.java      ← Spring Security config
├── service/
│   └── UserServiceImpl.java      ← User business logic
└── ...
```

---

## 📝 Important Notes

### ✅ What's Already Configured (No Changes Needed):

1. **CORS Configuration**
   ```java
   config.setAllowedOrigins(List.of("http://localhost:5173", ...))
   config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"))
   config.setAllowCredentials(true)
   ```
   This already allows your frontend!

2. **Security Configuration**
   ```java
   .requestMatchers("/api/auth/**").permitAll()  // Public endpoints
   .requestMatchers("/api/admin/**").hasAuthority("ADMIN")
   .requestMatchers("/api/account/**").hasAnyAuthority("USER", "ADMIN")
   ```
   This correctly allows public auth endpoints and protects admin/account endpoints.

3. **API Response Format**
   - Login/Register returns: `{ "token": "jwt_token_here" }`
   - Profile returns: `{ "id": 1, "fullName": "...", "email": "...", "role": "USER", "balance": ... }`

---

## ⚠️ Common Issues & Solutions

### Issue 1: Port 8080 Already In Use
```powershell
netstat -ano | findstr :8080
# Kill the process or change backend port in application.properties
server.port=9090
```

### Issue 2: Java Version Issue
```powershell
java -version
# Should be Java 11+ (project uses Java 17)
# Download Java 17 if needed
```

### Issue 3: Maven Not Found
```powershell
mvn -version
# Install Maven if needed
# Download from: https://maven.apache.org/download.cgi
```

### Issue 4: H2 Console (Database)
```
http://localhost:8080/h2-console
# Access H2 database console for debugging
# JDBC URL: jdbc:h2:mem:testdb
# Username: sa
# Password: (leave blank)
```

---

## 🚀 Next Steps

1. ✅ Clone backend repo to `C:\Users\venka\Desktop\backend`
2. ✅ Run: `mvn clean install`
3. ✅ Run: `mvn spring-boot:run`
4. ✅ Keep it running (don't close terminal)
5. ✅ Go back to frontend at http://localhost:5173/
6. ✅ Try registering - should work!

---

## 📊 What Should Happen

**Before Backend Runs:**
```
Frontend: http://localhost:5173/ ✅ (showing login/register form)
Backend: http://localhost:8080/ ❌ (not responding)
Result: 403 error when trying to register
```

**After Backend Runs:**
```
Frontend: http://localhost:5173/ ✅ (showing login/register form)
Backend: http://localhost:8080/ ✅ (responding to API requests)
Result: Registration works, redirects to dashboard ✅
```

---

## ❓ Questions?

If backend doesn't start:
1. **Check the error message in terminal** - tells you what's wrong
2. **Check Java is installed** - `java -version`
3. **Check Maven is installed** - `mvn -version`
4. **Check port 8080 is free** - `netstat -ano | findstr :8080`

**Tell me the error and I'll help you fix it!**
