# API Quick Reference

## 🔗 Base URL
```
https://localhost:7047
```
**Update in:** `src/services/apiClient.js`

---

## 📋 Endpoints

### 🛒 Orders

#### List All Orders
```http
GET /api/orders
```
**Response:**
```json
[
  {
    "id": 1,
    "clientId": 1,
    "clientName": "Acme Corp",
    "invoiceNo": "INV-001",
    "invoiceDate": "2025-11-22",
    "referenceNo": "REF-001",
    "note": "Order notes",
    "status": "pending",
    "totalExcl": 200.00,
    "totalTax": 20.00,
    "totalIncl": 220.00,
    "address1": "123 Main St",
    "address2": "",
    "address3": "",
    "suburb": "Springfield",
    "state": "NSW",
    "postCode": "2000",
    "lines": [...]
  }
]
```

#### Get Single Order
```http
GET /api/orders/{id}
```
**Response:** Single order object with lines array

#### Create Order
```http
POST /api/orders
Content-Type: application/json
```
**Request Body:**
```json
{
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

#### Update Order
```http
PUT /api/orders/{id}
Content-Type: application/json
```
**Request Body:** Same as POST

---

### 👥 Clients

#### List All Clients
```http
GET /api/clients
```
**Response:**
```json
[
  {
    "id": 1,
    "name": "Acme Corp",
    "address1": "123 Business St",
    "address2": "Suite 200",
    "address3": "",
    "suburb": "Sydney",
    "state": "NSW",
    "postCode": "2000"
  }
]
```

---

### 📦 Items

#### List All Items
```http
GET /api/items
```
**Response:**
```json
[
  {
    "id": 1,
    "code": "ITEM-001",
    "description": "Product Name",
    "price": 99.99
  }
]
```

---

## 🔒 CORS Configuration

Add to `Program.cs` in your .NET backend:

```csharp
// Add before builder.Build()
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .WithOrigins("http://localhost:5173"); // Vite dev port
    });
});

var app = builder.Build();

// Add after app.UseRouting() and before app.UseAuthorization()
app.UseCors("AllowFrontend");
```

---

## 🧪 Testing with cURL

### Get Orders
```bash
curl https://localhost:7047/api/orders
```

### Create Order
```bash
curl -X POST https://localhost:7047/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 1,
    "invoiceNo": "INV-001",
    "invoiceDate": "2025-11-22",
    "lines": [
      {
        "itemId": 1,
        "quantity": 2,
        "price": 100.00,
        "taxRate": 10
      }
    ]
  }'
```

---

## 📝 Field Requirements

### Order (Required)
- ✅ `clientId` - Must exist in clients table
- ✅ `invoiceNo` - Unique invoice number
- ✅ `invoiceDate` - ISO date format
- ✅ `lines` - At least one line item

### Order Line (Required)
- ✅ `itemId` - Must exist in items table
- ✅ `quantity` - Greater than 0
- ✅ `price` - Greater than or equal to 0
- ✅ `taxRate` - 0-100 (percentage)

### Optional Fields
- `referenceNo` - External reference
- `note` - Order notes
- `address1-3` - Delivery address
- `suburb`, `state`, `postCode` - Address components
- Line `note` - Item-specific notes

---

## 💡 Tips

1. **Calculate amounts on backend** - Frontend calculations are for display only
2. **Return totals from API** - Include `totalExcl`, `totalTax`, `totalIncl` in response
3. **Include client name** - Join client table to include `clientName` in orders list
4. **Use DTOs** - Map between database entities and API models
5. **Validation** - Validate all inputs on backend before saving
6. **Error handling** - Return proper HTTP status codes (400, 404, 500)

---

## 🐛 Common Issues

### Issue: CORS Error
**Solution:** Enable CORS in backend (see above)

### Issue: 404 Not Found
**Solution:** Check API routes match endpoints exactly

### Issue: Calculations Wrong
**Solution:** Ensure backend calculates amounts from qty × price × tax

### Issue: Dropdown Empty
**Solution:** Check `/api/clients` and `/api/items` return data

---

## 📊 Status Codes

- `200 OK` - Success (GET, PUT)
- `201 Created` - Success (POST)
- `204 No Content` - Success (DELETE)
- `400 Bad Request` - Validation error
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## 🎯 Frontend Usage

### Using the API Client

```javascript
import api from '../services/apiClient';

// Get orders
const orders = await api.get('/api/orders');

// Get single order
const order = await api.get(`/api/orders/${id}`);

// Create order
await api.post('/api/orders', orderData);

// Update order
await api.put(`/api/orders/${id}`, orderData);
```

### Error Handling

```javascript
try {
  const response = await api.get('/api/orders');
  setOrders(response.data);
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error(error.response.status, error.response.data);
  } else {
    // Network error
    console.error('Network error:', error.message);
  }
}
```
