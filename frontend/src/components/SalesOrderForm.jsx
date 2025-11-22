import { useState } from 'react';
import { Input, Select, Button, Card } from '../components';

/**
 * Screen 1: Sales Order Form
 * Example implementation using reusable form components
 */
const SalesOrderForm = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    orderDate: '',
    productCategory: '',
    quantity: '',
    unitPrice: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const productCategories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'food', label: 'Food & Beverages' },
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setLoading(false);
      // Reset form or show success message
    }, 2000);
  };

  const handleReset = () => {
    setFormData({
      customerName: '',
      orderDate: '',
      productCategory: '',
      quantity: '',
      unitPrice: '',
    });
    setErrors({});
  };

  return (
    <div className="container-custom py-8">
      <Card
        title="Create Sales Order"
        subtitle="Fill in the details below to create a new sales order"
        className="max-w-4xl mx-auto"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Customer Information
            </h3>
            <div className="form-grid">
              <Input
                id="customerName"
                label="Customer Name"
                placeholder="Enter customer name"
                value={formData.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
                error={errors.customerName}
                required
                className="md:col-span-2"
              />
              
              <Input
                id="orderDate"
                type="date"
                label="Order Date"
                value={formData.orderDate}
                onChange={(e) => handleChange('orderDate', e.target.value)}
                error={errors.orderDate}
                required
              />
            </div>
          </div>

          {/* Product Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Product Details
            </h3>
            <div className="form-grid">
              <Select
                id="productCategory"
                label="Product Category"
                options={productCategories}
                value={formData.productCategory}
                onChange={(e) => handleChange('productCategory', e.target.value)}
                error={errors.productCategory}
                required
              />
              
              <Input
                id="quantity"
                type="number"
                label="Quantity"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                error={errors.quantity}
                required
                min="1"
              />
              
              <Input
                id="unitPrice"
                type="number"
                label="Unit Price"
                placeholder="Enter unit price"
                value={formData.unitPrice}
                onChange={(e) => handleChange('unitPrice', e.target.value)}
                error={errors.unitPrice}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Total Display */}
          {formData.quantity && formData.unitPrice && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  Total Amount:
                </span>
                <span className="text-2xl font-bold text-primary-600">
                  ${(parseFloat(formData.quantity) * parseFloat(formData.unitPrice)).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              Create Order
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SalesOrderForm;
