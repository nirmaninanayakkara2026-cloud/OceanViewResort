import { useState, useEffect } from "react";
import { foodAPI } from "../services/api";
import {
  FaUtensils,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        alert("Please login to view your orders");
        window.location.href = "/login";
        return;
      }

      const response = await foodAPI.getFoodOrdersByUser(user.id);
      // Sort orders by orderedAt date (newest first)
      const sortedOrders = (response.data || []).sort((a, b) => {
        return new Date(b.orderedAt) - new Date(a.orderedAt);
      });
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "PREPARING":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "READY":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
      case "PREPARING":
        return <FaClock className="inline mr-2" />;
      case "READY":
      case "DELIVERED":
        return <FaCheckCircle className="inline mr-2" />;
      case "CANCELLED":
        return <FaTimesCircle className="inline mr-2" />;
      default:
        return <FaClock className="inline mr-2" />;
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "ALL") return true;
    return order.status?.toUpperCase() === filterStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            My Food Orders
          </h1>
          <p className="text-gray-600">
            Track your food orders and delivery status
          </p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-gray-700 font-medium">Filter:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
            >
              <option value="ALL">All Orders</option>
              <option value="PENDING">Pending</option>
              <option value="PREPARING">Preparing</option>
              <option value="READY">Ready</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <span className="text-gray-500 ml-auto">
              {filteredOrders.length} order(s)
            </span>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FaUtensils className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500 mb-6">
              {filterStatus === "ALL"
                ? "You haven't placed any orders yet."
                : `You don't have any ${filterStatus.toLowerCase()} orders.`}
            </p>
            <a
              href="/order-foods"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition"
            >
              Order Food
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6"
              >
                {/* Header with Order ID and Status */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <FaUtensils />
                      <span className="font-mono font-semibold text-sm">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Ordered on{" "}
                      {new Date(order.orderedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                      order.status,
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status?.toUpperCase()}
                  </span>
                </div>

                {/* Room Number */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-600">Delivery To</p>
                  <p className="font-semibold text-gray-800">
                    Room {order.roomNumber}
                  </p>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Items Ordered:
                  </p>
                  <div className="space-y-2">
                    {order.items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-700">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-gray-600 font-semibold">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Instructions */}
                {order.deliveryInstructions && (
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-600">
                      Delivery Instructions
                    </p>
                    <p className="text-sm text-gray-800">
                      {order.deliveryInstructions}
                    </p>
                  </div>
                )}

                {/* Total Price */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-lg font-semibold text-gray-700">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    Rs. {order.totalPrice?.toLocaleString()}
                  </span>
                </div>

                {/* Status Messages */}
                {order.status?.toUpperCase() === "DELIVERED" &&
                  order.deliveredAt && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800 text-center">
                        ✓ Delivered on{" "}
                        {new Date(order.deliveredAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  )}

                {order.status?.toUpperCase() === "READY" && (
                  <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-sm text-purple-800 text-center">
                      🍽️ Your order is ready and will be delivered shortly!
                    </p>
                  </div>
                )}

                {order.status?.toUpperCase() === "PREPARING" && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800 text-center">
                      👨‍🍳 Your order is being prepared...
                    </p>
                  </div>
                )}

                {order.status?.toUpperCase() === "PENDING" && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800 text-center">
                      ⏰ Waiting for kitchen to confirm your order
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
