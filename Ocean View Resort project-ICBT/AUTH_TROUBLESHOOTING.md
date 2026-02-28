# Authentication Troubleshooting Guide

## Current Issues & Solutions

### Issue 1: MongoDB Connection Timeout ❌

**Error:** `MongoSocketReadTimeoutException: Timeout while receiving message`

**Solution:**

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **"Network Access"** in left sidebar
3. Click **"Add IP Address"**
4. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
5. Click **Confirm**
6. Wait 1-2 minutes for changes to take effect
7. Restart backend

### Issue 2: Backend Not Updated ⚠️

**Problem:** Role handling changes need backend restart

**Solution:**

```powershell
# Stop current backend (Ctrl+C)
cd server
mvn clean install
mvn spring-boot:run
```

Watch for these messages:

- ✅ "MongoDB connection successful"
- ✅ "Admin user created: admin@oceanview.com"
- ✅ "Ocean View Resort Backend is running on port 8080"

### Issue 3: User Doesn't Exist 👤

**Problem:** You're trying to login with a user that doesn't exist

**Solution:**

#### For Admin Login:

- Email: `admin@oceanview.com`
- Password: `admin123`
- **Must click "Admin Login" button first**

#### For User Login:

1. You need to **create a new user account first**
2. On login page, click **"Sign Up"** or **"Create Account"**
3. Fill in:
   - Full Name: Your Name
   - Email: your.email@example.com
   - Phone: +94 77 123 4567
   - Password: your_password
   - Confirm Password: your_password
4. Click "Sign Up"
5. You'll be logged in automatically

---

## Step-by-Step Testing

### Test 1: Admin Login ✅

1. **Start backend** (if not running):

   ```powershell
   cd server
   mvn spring-boot:run
   ```

2. **Wait for** "Admin user created" message

3. **Start frontend** (if not running):

   ```powershell
   cd client
   npm run dev
   ```

4. **Open browser:** `http://localhost:5173/login`

5. **Click "Admin Login" button** (has shield icon)

6. **Enter credentials:**
   - Email: admin@oceanview.com
   - Password: admin123

7. **Click "Login"**

8. **Expected:** Redirects to `/admin/dashboard`

9. **Check console** (F12) for any errors

### Test 2: User Registration ✅

1. **Go to login page:** `http://localhost:5173/login`

2. **Make sure "Admin Login" is NOT selected** (use User Login)

3. **Click "Sign Up" tab** or "Create Account" button

4. **Fill in form:**
   - Full Name: Test User
   - Email: test@example.com
   - Phone: +94 77 123 4567
   - Password: test123
   - Confirm Password: test123

5. **Click "Sign Up"**

6. **Expected:**
   - Alert: "Registration successful!"
   - Redirects to home page `/`

7. **Check localStorage** (F12 → Application → Local Storage):
   - `token` should exist
   - `user` should contain your details with role `["USER"]`

### Test 3: User Login ✅

1. **Logout if logged in**

2. **Go to login page**

3. **Make sure "User Login" is selected** (NOT Admin Login)

4. **Enter credentials** you used for registration:
   - Email: test@example.com
   - Password: test123

5. **Click "Login"**

6. **Expected:** Redirects to home `/`

---

## Checklist Before Testing

- [ ] MongoDB Atlas IP whitelist configured (0.0.0.0/0 for testing)
- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] No errors in backend console
- [ ] No errors in browser console (F12)
- [ ] Admin user created (check backend logs)

---

## Common Errors & Fixes

### Error: "Authentication failed. Please check your credentials."

**Causes:**

1. User doesn't exist in database
2. Wrong password
3. Backend not running
4. MongoDB not connected

**Fix:**

- For Admin: Use exact credentials `admin@oceanview.com` / `admin123`
- For User: Create account first, then login
- Check backend is running
- Check MongoDB connection

### Error: "Access denied. Admin credentials required."

**Cause:** You clicked "Admin Login" but trying to login with user account

**Fix:**

- Click "User Login" button instead
- OR use admin credentials

### Error: "Please use admin login for administrator accounts."

**Cause:** You're using admin credentials with "User Login"

**Fix:**

- Click "Admin Login" button
- Then enter admin credentials

### Frontend shows blank page after login

**Causes:**

1. User data not stored in localStorage
2. Role checking failed
3. Protected route not working

**Fix:**

1. Open DevTools (F12) → Console
2. Look for any errors
3. Check Application → Local Storage
4. Should see `token` and `user` keys
5. `user` should have `roles` array

### Admin dashboard redirects to login

**Causes:**

1. Not logged in as admin
2. Token expired or invalid
3. Role not properly set

**Fix:**

1. Clear localStorage: Application → Local Storage → Clear All
2. Login again with admin credentials
3. Make sure "Admin Login" is selected

---

## Debugging Tips

### Check if user exists in MongoDB:

1. Go to MongoDB Atlas
2. Click "Browse Collections"
3. Select database: `view-resort`
4. Select collection: `users`
5. You should see:
   - Admin user with email `admin@oceanview.com`
   - Any registered users

### Check authentication response:

1. Open DevTools (F12)
2. Go to Network tab
3. Login
4. Find `login` request
5. Click on it
6. Check Response:
   ```json
   {
     "token": "eyJ...",
     "type": "Bearer",
     "id": "...",
     "fullName": "Admin User",
     "email": "admin@oceanview.com",
     "roles": ["ADMIN"]
   }
   ```

### Check localStorage:

1. Open DevTools (F12)
2. Application tab → Local Storage
3. Should see:
   - `token`: "eyJ..."
   - `user`: {"id":"...","fullName":"...","email":"...","roles":["ADMIN"]}

---

## Still Having Issues?

### 1. Clean Start

```powershell
# Backend
cd server
mvn clean install
mvn spring-boot:run

# Frontend (new terminal)
cd client
rm -rf node_modules
npm install
npm run dev
```

### 2. Clear Everything

1. Stop both frontend and backend
2. In browser: Clear all site data (F12 → Application → Clear site data)
3. In MongoDB: Delete `users` collection
4. Restart backend (will recreate admin user)
5. Restart frontend
6. Try admin login again

### 3. Check Versions

- Java: 17 or higher
- Node: 16 or higher
- Maven: 3.6 or higher

---

## Success Indicators ✅

**Backend:**

```
MongoDB connection successful
Admin user created:
  Email: admin@oceanview.com
  Password: admin123
Rooms initialized: 4
Packages initialized: 4
Food items initialized: 12
Ocean View Resort Backend is running on port 8080
```

**Frontend:**

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Browser Console (after login):**

```
User roles: ["ADMIN"]
```

OR

```
User roles: ["USER"]
```

---

## Contact

If none of these solutions work:

1. Check all error messages in backend console
2. Check all error messages in browser console
3. Verify MongoDB cluster is running (not paused)
4. Verify all ports are available (8080, 5173)
