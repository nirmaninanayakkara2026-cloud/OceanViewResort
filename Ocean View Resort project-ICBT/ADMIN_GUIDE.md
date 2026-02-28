# Ocean View Resort - Complete Setup Guide

## 🎉 What's Completed

### ✅ Step 1: Authentication System (COMPLETED)

- User login and registration
- Admin login (separate from user login)
- JWT-based authentication
- Protected routes for admin panel
- Password encryption with BCrypt

### ✅ Step 2: Admin Panel (COMPLETED)

Complete admin dashboard with:

1. **Dashboard Overview** - Stats and recent bookings
2. **Room Management** - Add, edit, delete rooms
3. **Booking Management** - View all bookings, update status, cancel bookings
4. **Food Orders** - View all food orders, update order status

---

## 🚀 Quick Start

### Backend Setup

1. **Start Spring Boot server:**

   ```bash
   cd server
   mvn spring-boot:run
   ```

2. **Default Admin Account:**
   - Email: `admin@oceanview.com`
   - Password: `admin123`
   - **⚠️ CHANGE THIS PASSWORD AFTER FIRST LOGIN**

### Frontend Setup

1. **Start React development server:**

   ```bash
   cd client
   npm run dev
   ```

2. **Access the application:**
   - User Site: `http://localhost:5173`
   - Admin Login: `http://localhost:5173/login` (Click "Admin Login")
   - Admin Dashboard: `http://localhost:5173/admin/dashboard`

---

## 🔐 Authentication Flow

### User Registration & Login

1. Go to `/login`
2. Click "Sign Up" to create account
3. Fill in: Full Name, Email, Phone, Password
4. After registration, you'll be logged in automatically
5. Users can book rooms, order food, etc.

### Admin Login

1. Go to `/login`
2. Click **"Admin Login"** button (top of form)
3. Enter admin credentials:
   - Email: `admin@oceanview.com`
   - Password: `admin123`
4. Click "Login"
5. You'll be redirected to `/admin/dashboard`

### Role-Based Access

- **Users** → Cannot access admin routes
- **Admin** → Full access to admin panel
- Protected routes automatically redirect unauthorized users

---

## 📊 Admin Panel Features

### 1. Dashboard (`/admin/dashboard`)

- **Overview Statistics:**
  - Total rooms & availability
  - Total bookings & pending count
  - Food orders & pending count
  - Total revenue
- **Recent Bookings Table:**
  - Last 5 bookings
  - Status, guest details, pricing

### 2. Room Management (`/admin/rooms`)

**Features:**

- ➕ **Add New Room:**
  - Room type, name, description
  - Price per night
  - Guest capacity
  - Total number of rooms
  - Amenities (comma-separated)
  - Icon emoji
- ✏️ **Edit Room:**
  - Update all room details
  - Modify pricing and capacity
- 🗑️ **Delete Room:**
  - Remove room types
  - Confirmation dialog

- 📋 **Room Cards:**
  - Visual display with icons
  - Availability status
  - Pricing and capacity info
  - Amenities list

### 3. Booking Management (`/admin/bookings`)

**Features:**

- 🔍 **Search & Filter:**
  - Search by name, email, reservation number
  - Filter by status (All, Pending, Confirmed, Cancelled, Completed)
- 📊 **Statistics:**
  - Total bookings count
  - Pending bookings
  - Confirmed bookings
  - Completed bookings

- 📋 **Bookings Table:**
  - Reservation number
  - Guest details (name, email, phone)
  - Room type & guest count
  - Check-in/check-out dates
  - Status badge
  - Total price
- 👁️ **View Details:**
  - Complete booking information
  - Guest information
  - Package & preferences
  - Special requests
  - Pricing breakdown
- ⚙️ **Actions:**
  - Confirm pending bookings
  - Mark as completed
  - Cancel bookings

### 4. Food Orders (`/admin/food-orders`)

**Features:**

- 🔍 **Search & Filter:**
  - Search by order ID or room number
  - Filter by status (All, Pending, Preparing, Ready, Delivered)
- 📊 **Statistics:**
  - Total orders
  - Pending orders
  - Preparing orders
  - Delivered orders

- 🍽️ **Order Cards:**
  - Order ID
  - Room number (if available)
  - Items list (first 3 items)
  - Status badge
  - Total amount
  - Order timestamp
- 👁️ **View Details:**
  - Complete order information
  - All ordered items with quantities
  - Total price breakdown
- ⚙️ **Status Updates:**
  - Pending → Preparing
  - Preparing → Ready
  - Ready → Delivered
  - Direct complete option

---

## 🗂️ Project Structure

```
client/src/
├── components/
│   ├── AdminLayout.jsx       # Admin panel layout with sidebar
│   ├── ProtectedRoute.jsx    # Route protection HOC
│   ├── Header.jsx
│   └── Footer.jsx
├── pages/
│   ├── Login.jsx              # User & admin login
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── RoomManagement.jsx
│   │   ├── BookingManagement.jsx
│   │   └── FoodOrders.jsx
│   ├── BookRooms.jsx          # Connected to API
│   └── [other pages]
├── services/
│   └── api.js                 # All API endpoints
└── App.jsx                    # Route configuration

server/src/main/java/com/oceanview/resort/
├── config/
│   ├── DataInitializer.java   # Creates admin user
│   ├── SecurityConfig.java
│   └── WebConfig.java
├── controller/
│   ├── AuthController.java
│   ├── BookingController.java
│   ├── RoomController.java
│   ├── PackageController.java
│   ├── FoodController.java
│   └── ContactController.java
├── model/
│   ├── User.java              # With roles (USER/ADMIN)
│   └── [other models]
├── repository/
├── service/
└── security/
```

---

## 🎨 Admin Panel Design

- **Gradient sidebar** with navigation
- **Responsive** mobile-friendly design
- **Modern UI** with Tailwind CSS
- **Status badges** with color coding
- **Modal dialogs** for details & forms
- **Loading states** & error handling
- **Hover effects** & smooth transitions

---

## 🔒 Security Features

1. **JWT Tokens** - Stored in localStorage
2. **Password Encryption** - BCrypt hashing
3. **Role-Based Access** - USER vs ADMIN
4. **Protected Routes** - Frontend & backend
5. **Token Validation** - On every request
6. **Auto Logout** - On 401 Unauthorized
7. **CORS Enabled** - For localhost:5173

---

## 📝 API Endpoints Used by Admin

### Authentication

- `POST /api/auth/login` - User/Admin login
- `POST /api/auth/signup` - User registration

### Rooms

- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create room
- `PUT /api/rooms/{id}` - Update room
- `DELETE /api/rooms/{id}` - Delete room

### Bookings

- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/{id}` - Get booking by ID
- `PATCH /api/bookings/{id}/status` - Update status
- `DELETE /api/bookings/{id}` - Cancel booking

### Food Orders

- `GET /api/food/orders` - Get all orders
- `GET /api/food/orders/{id}` - Get order by ID
- `PATCH /api/food/orders/{id}/status` - Update status

---

## 🧪 Testing the Admin Panel

### Test Admin Login

1. Go to `http://localhost:5173/login`
2. Click "Admin Login"
3. Enter:
   - Email: admin@oceanview.com
   - Password: admin123
4. Should redirect to dashboard

### Test Room Management

1. Login as admin
2. Go to "Room Management"
3. Click "Add New Room"
4. Fill in details:
   - Type: "Luxury Suite"
   - Name: "Luxury Suite"
   - Description: "Premium luxury experience"
   - Price: 60000
   - Capacity: 4
   - Total Rooms: 5
   - Amenities: "WiFi, TV, Pool Access, Butler"
5. Click "Add Room"
6. Room should appear in grid

### Test Booking Management

1. Make a test booking from user side
2. Login as admin
3. Go to "Bookings"
4. Find booking in table
5. Click eye icon to view details
6. Click "Confirm Booking"
7. Status should update to "CONFIRMED"

### Test Food Orders

1. Place a food order from user side
2. Login as admin
3. Go to "Food Orders"
4. Find order in grid
5. Click to view details
6. Update status: Pending → Preparing → Ready → Delivered

---

## 🎯 Next Steps (Optional Enhancements)

1. **User Dashboard**
   - View my bookings
   - View my food orders
   - Update profile

2. **Admin Analytics**
   - Revenue charts
   - Booking trends
   - Popular rooms

3. **Email Notifications**
   - Booking confirmation
   - Status updates

4. **Advanced Features**
   - Package management (add/edit/delete)
   - User management
   - Reports & exports

---

## ⚠️ Important Notes

1. **Change Admin Password** immediately after first login
2. **MongoDB Required** - Backend needs MongoDB connection
3. **Ports**:
   - Frontend: 5173
   - Backend: 8080
   - MongoDB: 27017
4. **CORS** already configured for local development
5. **Data Persistence** - MongoDB stores all data

---

## 🐛 Troubleshooting

### Can't login as admin

- Check backend is running
- Verify MongoDB connection
- Check console for errors
- Default credentials: admin@oceanview.com / admin123

### Admin routes redirect to login

- Check if token is stored: Open DevTools → Application → Local Storage
- Verify user role is "ADMIN"
- Clear localStorage and login again

### Backend errors

- Check MongoDB is running
- Verify application.properties settings
- Check console logs for stack trace

### Frontend errors

- Check console for API errors
- Verify backend is running on port 8080
- Check network tab for failed requests

---

## ✅ Success Checklist

- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] MongoDB connected
- [ ] Can login as admin
- [ ] Dashboard loads with stats
- [ ] Can add/edit/delete rooms
- [ ] Can view bookings
- [ ] Can update booking status
- [ ] Can view food orders
- [ ] Can update order status

---

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section
2. Verify all services are running
3. Check browser console for errors
4. Check backend logs for exceptions

---

**🎉 Congratulations! Your Ocean View Resort management system is complete!**

Admin Panel: http://localhost:5173/login (Click "Admin Login")
