# Sales Orders Management System

A full-stack sales order management application built with React and .NET Core.

## 🚀 Features

- Create and manage sales orders
- Customer management with address auto-fill
- Item catalog with pricing
- Real-time tax and total calculations
- Responsive table-based UI
- Redux state management

## 📋 Tech Stack

### Frontend
- **React 18.3** - UI framework
- **Vite 7.2.4** - Build tool
- **Redux Toolkit** - State management
- **React Router v7** - Routing
- **Axios** - HTTP client
- **Tailwind CSS v4** - Styling

### Backend (Required)
- **.NET Core** - API framework
- **Entity Framework Core** - ORM
- **SQL Server** - Database

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- .NET Core SDK 8.0+
- SQL Server

### Frontend Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

The app will run on `http://localhost:5173`

### Backend Setup

1. Create database tables:
   - `Clients` - Customer information
   - `Items` - Product catalog
   - `SalesOrders` - Order headers
   - `SalesOrderLines` - Order line items

2. Configure API endpoints:
   - `GET /api/clients` - List customers
   - `GET /api/items` - List products
   - `GET /api/orders` - List orders
   - `GET /api/orders/{id}` - Get order details
   - `POST /api/orders` - Create order
   - `PUT /api/orders/{id}` - Update order

3. Enable CORS for `http://localhost:5173`

4. Start backend on `https://localhost:7275`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   │   ├── HomePage.jsx        # Orders list
│   │   └── SalesOrderPage.jsx  # Order form
│   ├── redux/          # Redux slices and store
│   │   ├── slices/
│   │   │   ├── clientsSlice.js
│   │   │   ├── itemsSlice.js
│   │   │   └── ordersSlice.js
│   │   └── store.js
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Helper functions
│   └── services/       # API configuration
├── public/             # Static assets
└── index.html          # HTML template
```

## 🔧 Configuration

### API Endpoint

Update the base URL in `src/services/apiClient.js`:

```javascript
const api = axios.create({
  baseURL: "https://localhost:7275"
});
```

## 💡 Usage

### Creating an Order

1. Click "Add New Order" on the home page
2. Select customer from dropdown (address auto-fills)
3. Enter invoice details
4. Add line items by selecting products
5. Quantities and prices calculate automatically
6. Click "Save Order"

### Viewing Orders

- Home page displays all orders in a table
- Double-click a row to edit
- Filter by status or search by invoice number

## 🗄️ Backend Models

### Client
```csharp
public class Client {
    public int Id { get; set; }
    public string Name { get; set; }
    public string? Address1 { get; set; }
    public string? Address2 { get; set; }
    public string? Address3 { get; set; }
    public string? Suburb { get; set; }
    public string? State { get; set; }
    public string? PostCode { get; set; }
}
```

### Item
```csharp
public class Item {
    public int Id { get; set; }
    public string ItemCode { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
}
```

### SalesOrder
```csharp
public class SalesOrder {
    public int Id { get; set; }
    public int ClientId { get; set; }
    public Client? Client { get; set; }
    public string InvoiceNo { get; set; }
    public DateTime InvoiceDate { get; set; }
    public string? ReferenceNo { get; set; }
    public string? Note { get; set; }
    public string? Address1 { get; set; }
    public string? Address2 { get; set; }
    public string? Address3 { get; set; }
    public string? Suburb { get; set; }
    public string? State { get; set; }
    public string? PostCode { get; set; }
    public decimal TotalExcl { get; set; }
    public decimal TotalTax { get; set; }
    public decimal TotalIncl { get; set; }
    public ICollection<SalesOrderLine> Lines { get; set; }
}
```

### SalesOrderLine
```csharp
public class SalesOrderLine {
    public int Id { get; set; }
    public int SalesOrderId { get; set; }
    public SalesOrder? SalesOrder { get; set; }
    public int ItemId { get; set; }
    public Item? Item { get; set; }
    public string? Note { get; set; }
    public decimal Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal TaxRate { get; set; }
    public decimal ExclAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal InclAmount { get; set; }
}
```

## 🐛 Troubleshooting

### CORS Issues
Ensure backend Program.cs includes:
```csharp
builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

### Navigation Properties Required Error
Make navigation properties nullable:
```csharp
public Client? Client { get; set; }  // Add ?
public Item? Item { get; set; }      // Add ?
```

### Connection Refused
- Verify backend is running on `https://localhost:7275`
- Check Windows Firewall settings
- Ensure SSL certificate is trusted

## 📝 License

MIT

## 👤 Author

Personal Project