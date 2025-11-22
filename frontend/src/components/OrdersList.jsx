import { useState } from 'react';
import { Table, Card, Badge, Button, Input, Select } from '../components';

/**
 * Screen 2: Orders List
 * Example implementation using Table component
 */
const OrdersList = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Sample data - replace with API call
  const [orders] = useState([
    {
      id: 'ORD-001',
      customerName: 'John Doe',
      orderDate: '2025-11-20',
      category: 'Electronics',
      quantity: 5,
      unitPrice: 299.99,
      total: 1499.95,
      status: 'completed',
    },
    {
      id: 'ORD-002',
      customerName: 'Jane Smith',
      orderDate: '2025-11-21',
      category: 'Furniture',
      quantity: 2,
      unitPrice: 599.00,
      total: 1198.00,
      status: 'pending',
    },
    {
      id: 'ORD-003',
      customerName: 'Bob Johnson',
      orderDate: '2025-11-22',
      category: 'Clothing',
      quantity: 10,
      unitPrice: 49.99,
      total: 499.90,
      status: 'processing',
    },
  ]);

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  // Status badge variants
  const getStatusVariant = (status) => {
    const variants = {
      pending: 'warning',
      processing: 'primary',
      completed: 'success',
      cancelled: 'danger',
    };
    return variants[status] || 'default';
  };

  // Table columns configuration
  const columns = [
    {
      key: 'id',
      header: 'Order ID',
      render: (value) => (
        <span className="font-semibold text-primary-600">{value}</span>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer Name',
    },
    {
      key: 'orderDate',
      header: 'Order Date',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'category',
      header: 'Category',
    },
    {
      key: 'quantity',
      header: 'Qty',
      cellClassName: 'text-center',
      headerClassName: 'text-center',
    },
    {
      key: 'unitPrice',
      header: 'Unit Price',
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      key: 'total',
      header: 'Total',
      render: (value) => (
        <span className="font-semibold">${value.toFixed(2)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <Badge variant={getStatusVariant(value)} size="sm">
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit:', row.id);
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Delete:', row.id);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleRowClick = (row) => {
    console.log('Row clicked:', row);
    // Navigate to order details page
  };

  const handleExport = () => {
    console.log('Exporting orders...');
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container-custom py-8">
      <Card
        title="Sales Orders"
        subtitle={`${filteredOrders.length} orders found`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleExport}>
              Export
            </Button>
            <Button variant="primary" size="sm">
              + New Order
            </Button>
          </>
        }
      >
        {/* Filters Section */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <Input
            id="search"
            type="search"
            placeholder="Search by customer name or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select
            id="statusFilter"
            placeholder="All Statuses"
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="sm:w-48"
          />
        </div>

        {/* Orders Table */}
        <div className="table-container">
          <Table
            columns={columns}
            data={filteredOrders}
            loading={loading}
            emptyMessage="No orders found. Create your first order to get started."
            onRowClick={handleRowClick}
          />
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {filteredOrders.length}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-success-600 mt-1">
              ${filteredOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Pending Orders</p>
            <p className="text-2xl font-bold text-warning-600 mt-1">
              {filteredOrders.filter(o => o.status === 'pending').length}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Completed Orders</p>
            <p className="text-2xl font-bold text-primary-600 mt-1">
              {filteredOrders.filter(o => o.status === 'completed').length}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrdersList;
