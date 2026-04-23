# Quick Start - Secure Banking System

## Current Status ✅

### Frontend (Running)
- **URL:** http://localhost:5173/
- **Status:** ✅ Fixed and running
- **Dev Server:** `npm run dev` (already running)

The frontend was showing blank because `isTokenValid()` function was missing from authService.js. This has been fixed.

---

## Next: Set Up Backend 🔴

Your backend repository: https://github.com/gvnarasimhulu021/secure-banking-system

### IMPORTANT: Backend Setup Steps

1. **Open a new PowerShell/Command Prompt window**

2. **Clone the backend repository:**
   ```powershell
   cd C:\Users\venka\Desktop
   git clone https://github.com/gvnarasimhulu021/secure-banking-system.git backend
   cd backend
   ```

3. **Check what build system it uses:**
   - Look for `pom.xml` (Maven) or `build.gradle` (Gradle)
   - The backend is likely Spring Boot based on the Docker and database configs

4. **Build the backend:**
   ```powershell
   # If it has pom.xml (Maven):
   mvn clean install
   
   # If it has build.gradle (Gradle):
   ./gradlew clean build
   ```

5. **Run the backend:**
   ```powershell
   # Maven:
   mvn spring-boot:run
   
   # Gradle:
   ./gradlew bootRun
   ```

6. **Verify it's running:**
   - Open http://localhost:8080/ in browser
   - You should see the backend API (may return JSON or page)

---

## Now Test Both Together

### Terminal 1 (Frontend) - Already Running
```
http://localhost:5173/
```

### Terminal 2 (Backend)
```
http://localhost:8080/
```

### What You Should See:
1. Frontend loads at http://localhost:5173/
2. You see the **Login Page** with email/password fields
3. Register a new account OR use test credentials
4. Click Login - it should work if backend is running
5. You'll see the **User Dashboard** with account details

---

## If Backend Doesn't Start

**Common Issues:**

1. **Port 8080 already in use:**
   ```powershell
   # Find process using port 8080
   netstat -ano | findstr :8080
   # Kill it or change backend port
   ```

2. **Java not installed:**
   ```powershell
   java -version
   # Install Java 17+ if not found
   ```

3. **Maven/Gradle issues:**
   ```powershell
   mvn -version
   # Install Maven if needed or use Gradle
   ```

4. **Database connection error:**
   - Check application.properties in backend
   - Should use H2 database (in-memory)
   - May need to change datasource URL

---

## Frontend API Configuration

**File:** `c:\Users\venka\Desktop\ReactJs\src\services\config.js`

Current: `http://localhost:8080`

If you need to change backend port, update this file.

---

## Need Help with Backend?

If the backend doesn't start or needs configuration changes:
1. **Read the error message** in the terminal
2. **Check backend's README** (if it exists in the repo)
3. **Tell me the error** - I can guide you on fixes

---

## Summary

✅ Frontend is fixed and ready  
❌ Backend needs to be cloned and started  
⏳ Once both are running, the app should work fully  

**Next Action:** Clone and run the backend repository!
