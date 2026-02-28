import { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import { foodAPI } from "../../services/api";
import { FaUtensils, FaSearch, FaEye, FaCheck, FaTimes } from "react-icons/fa";

const FoodOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrdersData();
  }, [searchTerm, filterStatus, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await foodAPI.getAllFoodOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to load food orders");
    } finally {
      setLoading(false);
    }
  };

  const filterOrdersData = () => {
    let filtered = [...orders];

    // Filter by status
    if (filterStatus !== "ALL") {
      filtered = filtered.filter((o) => o.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.id?.toLowerCase().includes(term) ||
          o.roomNumber?.toLowerCase().includes(term) ||
          o.userId?.toLowerCase().includes(term),
      );
    }

    setFilteredOrders(filtered);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await foodAPI.updateFoodOrderStatus(orderId, newStatus);
      alert("Order status updated successfully!");
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating order:", error);
      alert(error.response?.data?.message || "Failed to update order");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading food orders...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Food Orders</h1>
          <p className="text-gray-600">View and manage all food orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID or room number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="PREPARING">Preparing</option>
                <option value="READY">Ready</option>
                <option value="DELIVERED">Delivered</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {orders.length}
              </p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter((o) => o.status === "PENDING").length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {orders.filter((o) => o.status === "PREPARING").length}
              </p>
              <p className="text-sm text-gray-600">Preparing</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {orders.filter((o) => o.status === "DELIVERED").length}
              </p>
              <p className="text-sm text-gray-600">Delivered</p>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrders.length === 0 ? (
            <div className="col-span-2 text-center py-16 bg-white rounded-xl shadow-lg">
              <FaUtensils className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No food orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-bold text-gray-800">{order.id}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === "DELIVERED"
                        ? "bg-green-100 text-green-800"
                        : order.status === "READY"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "PREPARING"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {order.roomNumber && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Room Number</p>
                    <p className="font-semibold">{order.roomNumber}</p>
                  </div>
                )}

                <div className="border-t pt-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Items ({order.items?.length || 0})
                  </p>
                  <div className="space-y-1">
                    {order.items?.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {item.quantity}x {item.itemName}
                        </span>
                        <span className="text-gray-600">Rs. {item.price}</span>
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <p className="text-xs text-gray-500">
                        +{order.items.length - 3} more items
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="text-xl font-bold text-primary">
                    Rs. {order.totalAmount?.toLocaleString()}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-gray-500">
                    Ordered at: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">
                Order Details
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedOrder.status === "DELIVERED"
                          ? "bg-green-100 text-green-800"
                          : selectedOrder.status === "READY"
                            ? "bg-blue-100 text-blue-800"
                            : selectedOrder.status === "PREPARING"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  {selectedOrder.roomNumber && (
                    <div>
                      <p className="text-sm text-gray-600">Room Number</p>
                      <p className="font-semibold">
                        {selectedOrder.roomNumber}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Order Time</p>
                    <p className="font-semibold">
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-bold text-lg mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {item.itemName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600">
                          Rs. {item.price} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Total Amount</span>
                  <span className="font-bold text-2xl text-primary">
                    Rs. {selectedOrder.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {selectedOrder.status !== "DELIVERED" && (
                <div className="space-y-3">
                  <h3 className="font-bold text-lg">Update Status</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedOrder.status === "PENDING" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(selectedOrder.id, "PREPARING")
                        }
                        className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                      >
                        Mark as Preparing
                      </button>
                    )}
                    {selectedOrder.status === "PREPARING" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(selectedOrder.id, "READY")
                        }
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Mark as Ready
                      </button>
                    )}
                    {(selectedOrder.status === "READY" ||
                      selectedOrder.status === "PREPARING") && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(selectedOrder.id, "DELIVERED")
                        }
                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <FaCheck /> Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default FoodOrders;
