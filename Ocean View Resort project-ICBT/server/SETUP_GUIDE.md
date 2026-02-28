# Quick Setup Guide

## 1. MongoDB Atlas Configuration

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new cluster (Free tier is sufficient)

### Step 2: Setup Database User

1. In Atlas dashboard, go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Set username and password (remember these!)
5. Set role to "Atlas admin" or "Read and write to any database"

### Step 3: Setup Network Access

1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0) for development
4. Click "Confirm"

### Step 4: Get Connection String

1. Go to "Database" section
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string

Example:

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## 2. Update Application Properties

Open `src/main/resources/application.properties` and update:

```properties
spring.data.mongodb.uri=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER_URL/oceanview_resort?retryWrites=true&w=majority
```

Replace:

- `YOUR_USERNAME` → Your MongoDB username
- `YOUR_PASSWORD` → Your MongoDB password
- `YOUR_CLUSTER_URL` → Your cluster URL (e.g., cluster0.xxxxx.mongodb.net)

## 3. Run the Application

### Using Maven:

```bash
cd server
mvn clean install
mvn spring-boot:run
```

### Using IDE (IntelliJ IDEA):

1. Open the `server` folder as a project
2. Wait for Maven to download dependencies
3. Find `OceanViewResortApplication.java`
4. Right-click and select "Run"

## 4. Verify Backend is Running

1. Open browser and go to: `http://localhost:8080/api/rooms`
2. You should see a JSON response with room data
3. If you see data, backend is working!

## 5. Test API with Postman (Optional)

### Test Signup:

```
POST http://localhost:8080/api/auth/signup
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

### Test Login:

```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Test Get Rooms:

```
GET http://localhost:8080/api/rooms
```

### Test Create Booking:

```
POST http://localhost:8080/api/bookings
Content-Type: application/json

{
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "1234567890",
  "guestAddress": "123 Main St",
  "roomType": "Standard Room",
  "checkIn": "2026-03-01",
  "checkOut": "2026-03-05",
  "numberOfGuests": 2,
  "selectedPackage": "honeymoon",
  "foodPreferences": ["breakfast", "dinner"],
  "drinkPackage": "basic",
  "specialRequests": "Early check-in please"
}
```

## 6. Connect Frontend to Backend

In your React frontend, create an API service file:

```javascript
// client/src/services/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  signup: (userData) => api.post("/auth/signup", userData),
  logout: () => api.post("/auth/logout"),
};

export const roomAPI = {
  getAllRooms: () => api.get("/rooms"),
  getRoomById: (id) => api.get(`/rooms/${id}`),
};

export const bookingAPI = {
  createBooking: (bookingData) => api.post("/bookings", bookingData),
  checkAvailability: (data) => api.post("/bookings/check-availability", data),
  getBookingsByEmail: (email) => api.get(`/bookings/email/${email}`),
};

export const packageAPI = {
  getAllPackages: () => api.get("/packages"),
  getPopularPackages: () => api.get("/packages/popular"),
};

export const foodAPI = {
  getAllFoodItems: () => api.get("/food/items"),
  getFoodItemsByCategory: (category) =>
    api.get(`/food/items/category/${category}`),
  createOrder: (orderData) => api.post("/food/orders", orderData),
};

export const contactAPI = {
  submitContact: (contactData) => api.post("/contact", contactData),
};

export default api;
```

## 7. Troubleshooting

### Error: "Unable to connect to MongoDB"

- Check your MongoDB Atlas credentials
- Verify IP address is whitelisted (0.0.0.0/0)
- Ensure database user has correct permissions

### Error: "Port 8080 already in use"

- Change port in `application.properties`:
  ```properties
  server.port=8081
  ```

### Error: "Maven dependencies not downloading"

- Check internet connection
- Try: `mvn clean install -U`
- Delete `~/.m2/repository` folder and retry

### CORS Errors from Frontend

- Backend CORS is already configured for `http://localhost:5173`
- If using different port, update `application.properties`:
  ```properties
  cors.allowed.origins=http://localhost:YOUR_PORT
  ```

## 8. Success Checklist

✅ MongoDB Atlas cluster created  
✅ Database user created with password  
✅ IP address whitelisted (0.0.0.0/0)  
✅ Connection string updated in application.properties  
✅ Backend running on http://localhost:8080  
✅ Can access http://localhost:8080/api/rooms in browser  
✅ Database automatically populated with initial data

## Need Help?

Check the logs in your terminal/console for detailed error messages.
