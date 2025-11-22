# Sales Orders Frontend - Setup Guide

## ✅ Implementation Complete

Your React frontend for the Sales Orders system is now fully implemented with beautiful Tailwind CSS styling.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── FormControls.jsx    # Input, Select, Button
│   │   ├── TableComponents.jsx # Table, Card, Badge
│   │   ├── index.js            # Component exports
│   │   ├── SalesOrderForm.jsx  # Example form (can be deleted)
│   │   └── OrdersList.jsx      # Example list (can be deleted)
│   ├── pages/              # Main application pages
│   │   ├── HomePage.jsx        # Orders list (Screen 2)
│   │   └── SalesOrderPage.jsx  # Order form (Screen 1)
│   ├── services/           # API services
│   │   └── apiClient.js        # Axios configuration
│   ├── App.jsx             # Routing configuration
│   ├── index.css           # Tailwind + custom styles
│   └── main.jsx
├── tailwind.config.js      # Tailwind design system
└── vite.config.js
```

## 🚀 Features Implemented

### HomePage (Screen 2 - Orders List)
✅ Fetches orders from `GET /api/orders`
✅ Beautiful stats dashboard with cards
✅ Search by invoice number or customer name
✅ Filter by status (pending, processing, completed, cancelled)
✅ Responsive table with customer avatars
✅ Double-click row to edit order
✅ "Add New" button navigates to create order
✅ Real-time total revenue calculation
✅ Attractive gradient background

### SalesOrderPage (Screen 1 - Order Form)
✅ Fetches customers from `GET /api/clients`
✅ Fetches items from `GET /api/items`
✅ Loads existing order from `GET /api/orders/{id}` when editing
✅ Customer dropdown auto-fills address fields
✅ Item dropdown auto-fills price
✅ Multiple line items with add/remove functionality
✅ Automatic calculations (excl, tax, incl)
✅ Real-time totals in sidebar summary
✅ POST `/api/orders` for new orders
✅ PUT `/api/orders/{id}` for updates
✅ Form validation before save
✅ Beautiful sticky sidebar with order summary
✅ Responsive design for mobile/tablet/desktop

## 🎨 Design Features

- **Gradient backgrounds** for modern look
- **Icon integration** using SVG icons
- **Color-coded status badges** (success, warning, danger)
- **Hover effects** on interactive elements
- **Loading states** with spinners
- **Empty states** with helpful messages
- **Sticky headers** for better UX
- **Card-based layouts** for organization
- **Responsive grid system** (mobile-first)

## 🔧 API Configuration

**Update the API URL** in `src/services/apiClient.js`:

```javascript
const api = axios.create({
  baseURL: "https://localhost:7047", // 🔴 Change to your API port
});
```

Common ports:
- Development: `https://localhost:7047`
- Production: Your deployed API URL

## 🔐 Backend CORS Setup (Required!)

Add this to your backend `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .WithOrigins("http://localhost:5173"); // Vite dev URL
    });
});

var app = builder.Build();

// Add before app.UseAuthorization()
app.UseCors("AllowFrontend");
```

## 📊 API Endpoints Expected

### Orders
- `GET /api/orders` - List all orders
- `GET /api/orders/{id}` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/{id}` - Update order

### Clients
- `GET /api/clients` - List all customers

### Items
- `GET /api/items` - List all products/items

## 🎯 Data Structure

### Order Object
```json
{
  "id": 0,
  "clientId": 1,
  "invoiceNo": "INV-001",
  "invoiceDate": "2025-11-22",
  "referenceNo": "REF-001",
  "note": "Order notes",
  "address1": "123 Main St",
  "address2": "Suite 100",
  "address3": "",
  "suburb": "Springfield",
  "state": "NSW",
  "postCode": "2000",
  "lines": [
    {
      "id": 0,
      "itemId": 1,
      "note": "Item description",
      "quantity": 2,
      "price": 100.00,
      "taxRate": 10,
      "exclAmount": 200.00,
      "taxAmount": 20.00,
      "inclAmount": 220.00
    }
  ]
}
```

### Client Object
```json
{
  "id": 1,
  "name": "Acme Corp",
  "address1": "123 Business St",
  "address2": "",
  "address3": "",
  "suburb": "Sydney",
  "state": "NSW",
  "postCode": "2000"
}
```

### Item Object
```json
{
  "id": 1,
  "code": "ITEM-001",
  "description": "Product Name",
  "price": 99.99
}
```

## 🏃 Run the Application

### Development Mode
```bash
npm run dev
```

Opens at: `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## 🧪 Testing Checklist

### HomePage Tests
- [ ] Orders load from API
- [ ] Search filters orders correctly
- [ ] Status filter works
- [ ] Double-click opens order for editing
- [ ] "New Order" button navigates to form
- [ ] Stats cards show correct totals
- [ ] Refresh button reloads data

### SalesOrderPage Tests
- [ ] Customer dropdown populates from API
- [ ] Selecting customer fills address
- [ ] Item dropdown populates from API
- [ ] Selecting item fills price
- [ ] Quantity changes recalculate amounts
- [ ] Price changes recalculate amounts
- [ ] Tax rate changes recalculate amounts
- [ ] Add line button works
- [ ] Remove line button works (with validation)
- [ ] Sidebar totals update automatically
- [ ] Save creates new order (POST)
- [ ] Save updates existing order (PUT)
- [ ] Form validation prevents invalid saves
- [ ] Cancel button returns to home
- [ ] Back button returns to home

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js` theme colors:
```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your brand colors */ },
    },
  },
}
```

### Change API Port
Edit `src/services/apiClient.js`:
```javascript
baseURL: "https://localhost:YOUR_PORT",
```

### Add Authentication
Uncomment the token code in `src/services/apiClient.js`:
```javascript
const token = localStorage.getItem('token');
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

## 📦 Dependencies

All dependencies are installed:
- `react` & `react-dom` - UI framework
- `react-router-dom` - Routing
- `axios` - HTTP client
- `prop-types` - Component validation
- `tailwindcss` - Styling
- `@tailwindcss/vite` - Vite integration

## 🐛 Troubleshooting

### CORS Errors
- Make sure CORS is configured in backend
- Check API URL in `apiClient.js`
- Verify backend is running

### API Connection Failed
- Check backend is running
- Verify API port matches
- Check network tab in browser DevTools

### Items Not Loading
- Verify API endpoints return correct data structure
- Check console for errors
- Test API endpoints directly (Postman/Swagger)

### Calculations Wrong
- Check tax rate is in percentage (10 = 10%)
- Verify item prices are numbers
- Check API returns numeric values

## 🎓 Key Features to Demonstrate

1. **Responsive Design** - Resize browser to see mobile/tablet/desktop layouts
2. **Real-time Calculations** - Change quantities/prices to see instant updates
3. **Auto-fill Functionality** - Select customer to fill address, item to fill price
4. **Search & Filter** - Use search bar and status filter on home page
5. **CRUD Operations** - Create, read, update orders
6. **Validation** - Try to save incomplete forms
7. **User Feedback** - Loading states, error messages
8. **Professional UI** - Modern design with Tailwind CSS

## 📝 Notes

- Example components (`SalesOrderForm.jsx`, `OrdersList.jsx`) can be deleted - they're just for reference
- All components use your custom design system from `tailwind.config.js`
- Forms are fully validated before API calls
- All amounts are formatted as currency
- Dates are properly formatted
- The UI is fully accessible with proper labels

## 🎉 Ready to Demo!

Your frontend is production-ready with:
✅ Beautiful, modern UI
✅ Full CRUD functionality
✅ Responsive design
✅ Real-time calculations
✅ Professional Tailwind styling
✅ Proper error handling
✅ Loading states
✅ Form validation

Just ensure your backend API is running and CORS is configured!
