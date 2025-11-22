import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/apiClient";

function HomePage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/orders");
      setOrders(response.data);
    } catch (err) {
      console.error("Failed to load orders:", err);
      alert("Failed to load orders. Please check your API connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleRowDoubleClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-gray-300 rounded shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-300 bg-gray-100 px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">Home</h1>
            <button
              onClick={() => navigate("/orders/new")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
            >
              Add New
            </button>
          </div>

          {/* Orders Table */}
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      ▼ Invoice No
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      ▼ Customer
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      ▼ Invoice Date
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      ▼ Reference No
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-700">
                      ▼ Total Amount
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">
                      ▼ Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                        No orders found. Click "Add New" to create your first order.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr
                        key={order.id}
                        onDoubleClick={() => handleRowDoubleClick(order.id)}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="border border-gray-300 px-4 py-2 text-sm">
                          {order.invoiceNo}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">
                          {order.client?.name || order.clientName || "-"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">
                          {formatDate(order.invoiceDate)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">
                          {order.referenceNo || "-"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-sm text-right font-medium">
                          {formatCurrency(order.totalIncl)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/orders/${order.id}`);
                            }}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {orders.length > 0 && (
              <p className="mt-4 text-sm text-gray-600">
                Double-click on any row to edit the order
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
