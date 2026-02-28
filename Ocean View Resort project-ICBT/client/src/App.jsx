import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import CheckAvailability from "./pages/CheckAvailability";
import BookRooms from "./pages/BookRooms";
import OrderFoods from "./pages/OrderFoods";
import BuyPackages from "./pages/BuyPackages";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import MyBookings from "./pages/MyBookings";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RoomManagement from "./pages/admin/RoomManagement";
import BookingManagement from "./pages/admin/BookingManagement";
import FoodOrders from "./pages/admin/FoodOrders";
import RoomAvailability from "./pages/admin/RoomAvailability";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Header/Footer */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route
                    path="/check-availability"
                    element={<CheckAvailability />}
                  />
                  <Route path="/book-rooms" element={<BookRooms />} />
                  <Route path="/order-foods" element={<OrderFoods />} />
                  <Route path="/packages" element={<BuyPackages />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/my-bookings"
                    element={
                      <ProtectedRoute>
                        <MyBookings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-orders"
                    element={
                      <ProtectedRoute>
                        <MyOrders />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />

        {/* Admin Routes (No Header/Footer) */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rooms"
          element={
            <ProtectedRoute requireAdmin={true}>
              <RoomManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute requireAdmin={true}>
              <BookingManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/food-orders"
          element={
            <ProtectedRoute requireAdmin={true}>
              <FoodOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/availability"
          element={
            <ProtectedRoute requireAdmin={true}>
              <RoomAvailability />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
