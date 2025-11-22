import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/apiClient";

function SalesOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [clients, setClients] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [order, setOrder] = useState({
    id: 0,
    clientId: "",
    invoiceNo: "",
    invoiceDate: new Date().toISOString().substring(0, 10),
    referenceNo: "",
    note: "",
    address1: "",
    address2: "",
    address3: "",
    suburb: "",
    state: "",
    postCode: "",
    lines: [
      {
        id: 0,
        itemId: "",
        note: "",
        quantity: 1,
        price: 0,
        taxRate: 10,
        exclAmount: 0,
        taxAmount: 0,
        inclAmount: 0,
      },
    ],
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [clientsRes, itemsRes] = await Promise.all([
        api.get("/api/clients"),
        api.get("/api/items"),
      ]);
      
      setClients(clientsRes.data);
      setItems(itemsRes.data);

      if (id) {
        const orderRes = await api.get(`/api/orders/${id}`);
        const backendOrder = orderRes.data;
        
        setOrder({
          id: backendOrder.id || backendOrder.Id,
          clientId: backendOrder.clientId || backendOrder.ClientId,
          invoiceNo: backendOrder.invoiceNo || backendOrder.InvoiceNo,
          invoiceDate: (backendOrder.invoiceDate || backendOrder.InvoiceDate)?.substring(0, 10) || "",
          referenceNo: (backendOrder.referenceNo || backendOrder.ReferenceNo) || "",
          note: (backendOrder.note || backendOrder.Note) || "",
          address1: (backendOrder.address1 || backendOrder.Address1) || "",
          address2: (backendOrder.address2 || backendOrder.Address2) || "",
          address3: (backendOrder.address3 || backendOrder.Address3) || "",
          suburb: (backendOrder.suburb || backendOrder.Suburb) || "",
          state: (backendOrder.state || backendOrder.State) || "",
          postCode: (backendOrder.postCode || backendOrder.PostCode) || "",
          lines: (backendOrder.lines || backendOrder.Lines)?.map(line => ({
            id: line.id || line.Id,
            itemId: line.itemId || line.ItemId,
            note: (line.note || line.Note) || "",
            quantity: line.quantity || line.Quantity,
            price: line.price || line.Price,
            taxRate: line.taxRate || line.TaxRate,
            exclAmount: line.exclAmount || line.ExclAmount,
            taxAmount: line.taxAmount || line.TaxAmount,
            inclAmount: line.inclAmount || line.InclAmount
          })) || []
        });
      }
    } catch (err) {
      console.error("Failed to load data:", err);
      alert("Failed to load data. Please check your API connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleClientChange = (e) => {
    const clientId = parseInt(e.target.value);
    const client = clients.find((c) => c.id === clientId);
    
    setOrder((o) => ({
      ...o,
      clientId,
      address1: client?.address1 ?? "",
      address2: client?.address2 ?? "",
      address3: client?.address3 ?? "",
      suburb: client?.suburb ?? "",
      state: client?.state ?? "",
      postCode: client?.postCode ?? "",
    }));
  };

  const handleLineChange = (index, field, value) => {
    setOrder((o) => {
      const lines = [...o.lines];
      let line = { ...lines[index], [field]: value };

      if (field === "itemId") {
        const item = items.find((i) => i.id === parseInt(value));
        if (item) {
          line.price = item.price;
          line.note = item.description || "";
        }
      }

      const qty = parseFloat(line.quantity) || 0;
      const price = parseFloat(line.price) || 0;
      const taxRate = parseFloat(line.taxRate) || 0;

      const excl = qty * price;
      const taxAmount = excl * (taxRate / 100);
      const incl = excl + taxAmount;

      line.exclAmount = parseFloat(excl.toFixed(2));
      line.taxAmount = parseFloat(taxAmount.toFixed(2));
      line.inclAmount = parseFloat(incl.toFixed(2));

      lines[index] = line;
      return { ...o, lines };
    });
  };

  const addLine = () => {
    setOrder((o) => ({
      ...o,
      lines: [
        ...o.lines,
        {
          id: 0,
          itemId: "",
          note: "",
          quantity: 1,
          price: 0,
          taxRate: 10,
          exclAmount: 0,
          taxAmount: 0,
          inclAmount: 0,
        },
      ],
    }));
  };

  const removeLine = (index) => {
    if (order.lines.length === 1) {
      alert("You must have at least one line item");
      return;
    }
    setOrder((o) => ({
      ...o,
      lines: o.lines.filter((_, i) => i !== index),
    }));
  };

  const saveOrder = async () => {
    if (!order.clientId) {
      alert("Please select a customer");
      return;
    }
    if (!order.invoiceNo) {
      alert("Please enter an invoice number");
      return;
    }
    if (order.lines.length === 0 || !order.lines[0].itemId) {
      alert("Please add at least one item");
      return;
    }

    try {
      setSaving(true);
      
      const backendOrder = {
        Id: order.id || 0,
        ClientId: parseInt(order.clientId),
        InvoiceNo: order.invoiceNo,
        InvoiceDate: order.invoiceDate,
        ReferenceNo: order.referenceNo || "",
        Note: order.note || "",
        Address1: order.address1 || "",
        Address2: order.address2 || "",
        Address3: order.address3 || "",
        Suburb: order.suburb || "",
        State: order.state || "",
        PostCode: order.postCode || "",
        TotalExcl: 0,
        TotalTax: 0,
        TotalIncl: 0,
        Lines: order.lines.map(line => ({
          Id: line.id || 0,
          ItemId: parseInt(line.itemId),
          Note: line.note || "",
          Quantity: parseFloat(line.quantity),
          Price: parseFloat(line.price),
          TaxRate: parseFloat(line.taxRate),
          ExclAmount: parseFloat(line.exclAmount),
          TaxAmount: parseFloat(line.taxAmount),
          InclAmount: parseFloat(line.inclAmount)
        }))
      };
      
      console.log("Sending order data:", JSON.stringify(backendOrder, null, 2));
      
      if (isEditing) {
        await api.put(`/api/orders/${id}`, backendOrder);
      } else {
        await api.post("/api/orders", backendOrder);
      }
      
      alert("Order saved successfully!");
      navigate("/");
    } catch (err) {
      console.error("Failed to save order:", err);
      
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        console.error("Backend error details:", errorData);
        
        if (errorData.errors) {
          const errorMessages = Object.entries(errorData.errors)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join("\n");
          alert(`Validation errors:\n\n${errorMessages}`);
        } else if (errorData.title) {
          alert(`Error: ${errorData.title}`);
        } else {
          alert("Failed to save order. Please check the console for details.");
        }
      } else {
        alert("Failed to save order. Please check your connection.");
      }
    } finally {
      setSaving(false);
    }
  };

  const totals = order.lines.reduce(
    (acc, l) => {
      acc.excl += l.exclAmount || 0;
      acc.tax += l.taxAmount || 0;
      acc.incl += l.inclAmount || 0;
      return acc;
    },
    { excl: 0, tax: 0, incl: 0 }
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-gray-300 rounded shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-300 bg-gray-100 px-4 py-3">
            <h1 className="text-xl font-semibold text-gray-800">Sales Order</h1>
          </div>
          
          <div className="p-6">
            {/* Save Button */}
            <div className="mb-6">
              <button
                onClick={saveOrder}
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                <span>✓</span>
                {saving ? "Saving..." : "Save Order"}
              </button>
            </div>

            {/* Customer and Invoice Info - Two Columns */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              {/* Left Column - Customer & Address */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <select
                    value={order.clientId}
                    onChange={handleClientChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Customer</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address 1
                  </label>
                  <input
                    type="text"
                    value={order.address1}
                    onChange={(e) => setOrder({ ...order, address1: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address 2
                  </label>
                  <input
                    type="text"
                    value={order.address2}
                    onChange={(e) => setOrder({ ...order, address2: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address 3
                  </label>
                  <input
                    type="text"
                    value={order.address3}
                    onChange={(e) => setOrder({ ...order, address3: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Suburb
                  </label>
                  <input
                    type="text"
                    value={order.suburb}
                    onChange={(e) => setOrder({ ...order, suburb: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={order.state}
                    onChange={(e) => setOrder({ ...order, state: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Post Code
                  </label>
                  <input
                    type="text"
                    value={order.postCode}
                    onChange={(e) => setOrder({ ...order, postCode: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Right Column - Invoice Info */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice No
                  </label>
                  <input
                    type="text"
                    value={order.invoiceNo}
                    onChange={(e) => setOrder({ ...order, invoiceNo: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={order.invoiceDate}
                    onChange={(e) => setOrder({ ...order, invoiceDate: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reference no
                  </label>
                  <input
                    type="text"
                    value={order.referenceNo}
                    onChange={(e) => setOrder({ ...order, referenceNo: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note
                  </label>
                  <textarea
                    value={order.note}
                    onChange={(e) => setOrder({ ...order, note: e.target.value })}
                    rows={6}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="mb-6 overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Item Code</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Note</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Quantity</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Price</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Tax</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Excl Amount</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Tax Amount</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Incl Amount</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {order.lines.map((line, index) => {
                    const selectedItem = items.find(i => i.id === parseInt(line.itemId));
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-2">
                          <select
                            value={line.itemId}
                            onChange={(e) => handleLineChange(index, "itemId", e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select</option>
                            {items.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.code}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <select
                            value={line.itemId}
                            onChange={(e) => handleLineChange(index, "itemId", e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select</option>
                            {items.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.description}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <input
                            type="text"
                            value={line.note}
                            onChange={(e) => handleLineChange(index, "note", e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <input
                            type="number"
                            value={line.quantity}
                            onChange={(e) => handleLineChange(index, "quantity", e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                            step="1"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <input
                            type="number"
                            value={line.price}
                            readOnly
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <input
                            type="number"
                            value={line.taxRate}
                            onChange={(e) => handleLineChange(index, "taxRate", e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <input
                            type="text"
                            value={line.exclAmount.toFixed(2)}
                            readOnly
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50 text-right"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <input
                            type="text"
                            value={line.taxAmount.toFixed(2)}
                            readOnly
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50 text-right"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <input
                            type="text"
                            value={line.inclAmount.toFixed(2)}
                            readOnly
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50 text-right"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center">
                          <button
                            onClick={() => removeLine(index)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                            disabled={order.lines.length === 1}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <button
                onClick={addLine}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                + Add Line
              </button>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                  <span className="text-sm font-medium text-gray-700">Total Excl</span>
                  <input
                    type="text"
                    value={totals.excl.toFixed(2)}
                    readOnly
                    className="w-32 border border-gray-300 rounded px-3 py-1 text-sm bg-gray-50 text-right"
                  />
                </div>
                <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                  <span className="text-sm font-medium text-gray-700">Total Tax</span>
                  <input
                    type="text"
                    value={totals.tax.toFixed(2)}
                    readOnly
                    className="w-32 border border-gray-300 rounded px-3 py-1 text-sm bg-gray-50 text-right"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total Incl</span>
                  <input
                    type="text"
                    value={totals.incl.toFixed(2)}
                    readOnly
                    className="w-32 border border-gray-300 rounded px-3 py-1 text-sm bg-gray-50 text-right font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="mt-4">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default SalesOrderPage;
