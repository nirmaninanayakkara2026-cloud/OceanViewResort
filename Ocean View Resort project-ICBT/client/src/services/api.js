import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      // Store user data (id, fullName, email, roles)
      const userData = {
        id: response.data.id,
        fullName: response.data.fullName,
        email: response.data.email,
        roles: response.data.roles,
      };
      localStorage.setItem("user", JSON.stringify(userData));
    }
    return response.data;
  },

  signup: async (userData) => {
    const response = await api.post("/auth/signup", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      // Store user data (id, fullName, email, roles)
      const user = {
        id: response.data.id,
        fullName: response.data.fullName,
        email: response.data.email,
        roles: response.data.roles,
      };
      localStorage.setItem("user", JSON.stringify(user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Try to call backend logout, but don't fail if it errors
    try {
      return api.post("/auth/logout");
    } catch (error) {
      // Ignore errors - already cleared localStorage
      return Promise.resolve();
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};

// Room API
export const roomAPI = {
  getAllRooms: () => api.get("/rooms"),

  getRoomById: (id) => api.get(`/rooms/${id}`),

  getRoomsByType: (type) => api.get(`/rooms/type/${type}`),

  createRoom: (roomData) => api.post("/rooms", roomData),

  updateRoom: (id, roomData) => api.put(`/rooms/${id}`, roomData),

  deleteRoom: (id) => api.delete(`/rooms/${id}`),
};

// Booking API
export const bookingAPI = {
  createBooking: (bookingData) => api.post("/bookings", bookingData),

  getAllBookings: () => api.get("/bookings"),

  getBookingById: (id) => api.get(`/bookings/${id}`),

  getBookingByReservation: (reservationNumber) =>
    api.get(`/bookings/reservation/${reservationNumber}`),

  getBookingsByEmail: (email) => api.get(`/bookings/email/${email}`),

  checkAvailability: (availabilityData) =>
    api.post("/bookings/check-availability", availabilityData),

  updateBookingStatus: (id, status) =>
    api.patch(`/bookings/${id}/status?status=${status}`),

  cancelBooking: (id) => api.delete(`/bookings/${id}`),
};

// Package API
export const packageAPI = {
  getAllPackages: () => api.get("/packages"),

  getPackageById: (id) => api.get(`/packages/${id}`),

  getPackageByPackageId: (packageId) =>
    api.get(`/packages/package/${packageId}`),

  getPopularPackages: () => api.get("/packages/popular"),

  createPackage: (packageData) => api.post("/packages", packageData),

  updatePackage: (id, packageData) => api.put(`/packages/${id}`, packageData),

  deletePackage: (id) => api.delete(`/packages/${id}`),
};

// Food API
export const foodAPI = {
  // Food Items
  getAllFoodItems: () => api.get("/food/items"),

  getFoodItemsByCategory: (category) =>
    api.get(`/food/items/category/${category}`),

  searchFoodItems: (query) => api.get(`/food/items/search?query=${query}`),

  getFoodItemById: (id) => api.get(`/food/items/${id}`),

  createFoodItem: (itemData) => api.post("/food/items", itemData),

  updateFoodItem: (id, itemData) => api.put(`/food/items/${id}`, itemData),

  deleteFoodItem: (id) => api.delete(`/food/items/${id}`),

  // Food Orders
  createFoodOrder: (orderData) => api.post("/food/orders", orderData),

  getAllFoodOrders: () => api.get("/food/orders"),

  getFoodOrderById: (id) => api.get(`/food/orders/${id}`),

  getFoodOrdersByUser: (userId) => api.get(`/food/orders/user/${userId}`),

  getFoodOrdersByStatus: (status) => api.get(`/food/orders/status/${status}`),

  updateFoodOrderStatus: (id, status) =>
    api.patch(`/food/orders/${id}/status`, { status }),
};

// Contact API
export const contactAPI = {
  submitContact: (contactData) => api.post("/contact", contactData),

  getAllContacts: () => api.get("/contact"),

  getContactById: (id) => api.get(`/contact/${id}`),

  getContactsByStatus: (status) => api.get(`/contact/status/${status}`),

  getContactsByEmail: (email) => api.get(`/contact/email/${email}`),

  updateContactStatus: (id, status) =>
    api.patch(`/contact/${id}/status`, { status }),

  deleteContact: (id) => api.delete(`/contact/${id}`),
};

export default api;
