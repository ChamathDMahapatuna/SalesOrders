# Backend Requirements for Sales Orders Application

Based on the frontend implementation and your specification, here are the **exact backend requirements**:

---

## 🗄️ Database Schema Required

### 1. **Clients Table**
```sql
CREATE TABLE Clients (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ClientName NVARCHAR(200) NOT NULL,
    Address1 NVARCHAR(200),
    Address2 NVARCHAR(200),
    Address3 NVARCHAR(200),
    Suburb NVARCHAR(100),
    State NVARCHAR(50),
    PostCode NVARCHAR(20)
);
```

**C# Model:**
```csharp
public class Client
{
    public int Id { get; set; }
    public string ClientName { get; set; }
    public string? Address1 { get; set; }
    public string? Address2 { get; set; }
    public string? Address3 { get; set; }
    public string? Suburb { get; set; }
    public string? State { get; set; }
    public string? PostCode { get; set; }
}
```

---

### 2. **Items Table**
```sql
CREATE TABLE Items (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ItemCode NVARCHAR(50) NOT NULL,
    Description NVARCHAR(500) NOT NULL,
    Price DECIMAL(18, 2) NOT NULL
);
```

**C# Model:**
```csharp
public class Item
{
    public int Id { get; set; }
    public string ItemCode { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
}
```

---

### 3. **Orders Table (Header)**
```sql
CREATE TABLE Orders (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ClientId INT NOT NULL,
    InvoiceNo NVARCHAR(50) NOT NULL UNIQUE,
    InvoiceDate DATE NOT NULL,
    ReferenceNo NVARCHAR(50),
    Note NVARCHAR(MAX),
    Address1 NVARCHAR(200),
    Address2 NVARCHAR(200),
    Address3 NVARCHAR(200),
    Suburb NVARCHAR(100),
    State NVARCHAR(50),
    PostCode NVARCHAR(20),
    TotalExcl DECIMAL(18, 2) NOT NULL DEFAULT 0,
    TotalTax DECIMAL(18, 2) NOT NULL DEFAULT 0,
    TotalIncl DECIMAL(18, 2) NOT NULL DEFAULT 0,
    Status NVARCHAR(50) DEFAULT 'Pending',
    CreatedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ClientId) REFERENCES Clients(Id)
);
```

**C# Model:**
```csharp
public class Order
{
    public int Id { get; set; }
    public int ClientId { get; set; }
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
    public string Status { get; set; } = "Pending";
    public DateTime CreatedDate { get; set; } = DateTime.Now;
    
    // Navigation properties
    public virtual Client? Client { get; set; }
    public virtual ICollection<OrderLine> Lines { get; set; } = new List<OrderLine>();
}
```

---

### 4. **OrderLines Table**
```sql
CREATE TABLE OrderLines (
    Id INT PRIMARY KEY IDENTITY(1,1),
    OrderId INT NOT NULL,
    ItemId INT NOT NULL,
    Note NVARCHAR(MAX),
    Quantity DECIMAL(18, 2) NOT NULL,
    Price DECIMAL(18, 2) NOT NULL,
    TaxRate DECIMAL(5, 2) NOT NULL,
    ExclAmount DECIMAL(18, 2) NOT NULL,
    TaxAmount DECIMAL(18, 2) NOT NULL,
    InclAmount DECIMAL(18, 2) NOT NULL,
    FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE,
    FOREIGN KEY (ItemId) REFERENCES Items(Id)
);
```

**C# Model:**
```csharp
public class OrderLine
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int ItemId { get; set; }
    public string? Note { get; set; }
    public decimal Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal TaxRate { get; set; }
    public decimal ExclAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal InclAmount { get; set; }
    
    // Navigation properties
    public virtual Order? Order { get; set; }
    public virtual Item? Item { get; set; }
}
```

---

## 🌐 API Endpoints Required

### **1. Clients API**

#### GET `/api/clients` - List all clients
**Response:**
```json
[
  {
    "id": 1,
    "clientName": "Acme Corporation",
    "address1": "123 Business St",
    "address2": "Suite 100",
    "address3": "",
    "suburb": "Sydney",
    "state": "NSW",
    "postCode": "2000"
  }
]
```

**Controller:**
```csharp
[ApiController]
[Route("api/[controller]")]
public class ClientsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Client>>> GetClients()
    {
        return await _context.Clients.ToListAsync();
    }
}
```

---

### **2. Items API**

#### GET `/api/items` - List all items
**Response:**
```json
[
  {
    "id": 1,
    "itemCode": "ITEM-001",
    "description": "Product Description",
    "price": 99.99
  }
]
```

**Controller:**
```csharp
[ApiController]
[Route("api/[controller]")]
public class ItemsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Item>>> GetItems()
    {
        return await _context.Items.ToListAsync();
    }
}
```

---

### **3. Orders API**

#### GET `/api/orders` - List all orders (with client name for display)

**Response:**
```json
[
  {
    "id": 1,
    "clientId": 1,
    "clientName": "Acme Corporation",
    "invoiceNo": "INV-001",
    "invoiceDate": "2025-11-22",
    "referenceNo": "REF-001",
    "note": "Order notes",
    "address1": "123 Business St",
    "address2": "Suite 100",
    "address3": "",
    "suburb": "Sydney",
    "state": "NSW",
    "postCode": "2000",
    "totalExcl": 200.00,
    "totalTax": 20.00,
    "totalIncl": 220.00,
    "status": "Pending",
    "createdDate": "2025-11-22T10:30:00"
  }
]
```

**DTO (Data Transfer Object):**
```csharp
public class OrderListDto
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    public string ClientName { get; set; }
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
    public string Status { get; set; }
    public DateTime CreatedDate { get; set; }
}
```

**Controller:**
```csharp
[HttpGet]
public async Task<ActionResult<IEnumerable<OrderListDto>>> GetOrders()
{
    var orders = await _context.Orders
        .Include(o => o.Client)
        .Select(o => new OrderListDto
        {
            Id = o.Id,
            ClientId = o.ClientId,
            ClientName = o.Client.ClientName,
            InvoiceNo = o.InvoiceNo,
            InvoiceDate = o.InvoiceDate,
            ReferenceNo = o.ReferenceNo,
            Note = o.Note,
            Address1 = o.Address1,
            Address2 = o.Address2,
            Address3 = o.Address3,
            Suburb = o.Suburb,
            State = o.State,
            PostCode = o.PostCode,
            TotalExcl = o.TotalExcl,
            TotalTax = o.TotalTax,
            TotalIncl = o.TotalIncl,
            Status = o.Status,
            CreatedDate = o.CreatedDate
        })
        .OrderByDescending(o => o.CreatedDate)
        .ToListAsync();

    return orders;
}
```

---

#### GET `/api/orders/{id}` - Get single order with lines

**Response:**
```json
{
  "id": 1,
  "clientId": 1,
  "invoiceNo": "INV-001",
  "invoiceDate": "2025-11-22",
  "referenceNo": "REF-001",
  "note": "Order notes",
  "address1": "123 Business St",
  "address2": "Suite 100",
  "address3": "",
  "suburb": "Sydney",
  "state": "NSW",
  "postCode": "2000",
  "lines": [
    {
      "id": 1,
      "itemId": 1,
      "note": "Item note",
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

**DTO:**
```csharp
public class OrderDto
{
    public int Id { get; set; }
    public int ClientId { get; set; }
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
    public List<OrderLineDto> Lines { get; set; } = new();
}

public class OrderLineDto
{
    public int Id { get; set; }
    public int ItemId { get; set; }
    public string? Note { get; set; }
    public decimal Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal TaxRate { get; set; }
    public decimal ExclAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal InclAmount { get; set; }
}
```

**Controller:**
```csharp
[HttpGet("{id}")]
public async Task<ActionResult<OrderDto>> GetOrder(int id)
{
    var order = await _context.Orders
        .Include(o => o.Lines)
        .FirstOrDefaultAsync(o => o.Id == id);

    if (order == null)
        return NotFound();

    var dto = new OrderDto
    {
        Id = order.Id,
        ClientId = order.ClientId,
        InvoiceNo = order.InvoiceNo,
        InvoiceDate = order.InvoiceDate,
        ReferenceNo = order.ReferenceNo,
        Note = order.Note,
        Address1 = order.Address1,
        Address2 = order.Address2,
        Address3 = order.Address3,
        Suburb = order.Suburb,
        State = order.State,
        PostCode = order.PostCode,
        Lines = order.Lines.Select(l => new OrderLineDto
        {
            Id = l.Id,
            ItemId = l.ItemId,
            Note = l.Note,
            Quantity = l.Quantity,
            Price = l.Price,
            TaxRate = l.TaxRate,
            ExclAmount = l.ExclAmount,
            TaxAmount = l.TaxAmount,
            InclAmount = l.InclAmount
        }).ToList()
    };

    return dto;
}
```

---

#### POST `/api/orders` - Create new order

**Request Body:**
```json
{
  "clientId": 1,
  "invoiceNo": "INV-001",
  "invoiceDate": "2025-11-22",
  "referenceNo": "REF-001",
  "note": "Order notes",
  "address1": "123 Business St",
  "address2": "Suite 100",
  "address3": "",
  "suburb": "Sydney",
  "state": "NSW",
  "postCode": "2000",
  "lines": [
    {
      "itemId": 1,
      "note": "Item note",
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

**Controller:**
```csharp
[HttpPost]
public async Task<ActionResult<Order>> CreateOrder(OrderDto dto)
{
    // Calculate totals
    var totalExcl = dto.Lines.Sum(l => l.ExclAmount);
    var totalTax = dto.Lines.Sum(l => l.TaxAmount);
    var totalIncl = dto.Lines.Sum(l => l.InclAmount);

    var order = new Order
    {
        ClientId = dto.ClientId,
        InvoiceNo = dto.InvoiceNo,
        InvoiceDate = dto.InvoiceDate,
        ReferenceNo = dto.ReferenceNo,
        Note = dto.Note,
        Address1 = dto.Address1,
        Address2 = dto.Address2,
        Address3 = dto.Address3,
        Suburb = dto.Suburb,
        State = dto.State,
        PostCode = dto.PostCode,
        TotalExcl = totalExcl,
        TotalTax = totalTax,
        TotalIncl = totalIncl,
        Status = "Pending"
    };

    foreach (var lineDto in dto.Lines)
    {
        order.Lines.Add(new OrderLine
        {
            ItemId = lineDto.ItemId,
            Note = lineDto.Note,
            Quantity = lineDto.Quantity,
            Price = lineDto.Price,
            TaxRate = lineDto.TaxRate,
            ExclAmount = lineDto.ExclAmount,
            TaxAmount = lineDto.TaxAmount,
            InclAmount = lineDto.InclAmount
        });
    }

    _context.Orders.Add(order);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
}
```

---

#### PUT `/api/orders/{id}` - Update existing order

**Request Body:** Same as POST

**Controller:**
```csharp
[HttpPut("{id}")]
public async Task<IActionResult> UpdateOrder(int id, OrderDto dto)
{
    if (id != dto.Id)
        return BadRequest();

    var order = await _context.Orders
        .Include(o => o.Lines)
        .FirstOrDefaultAsync(o => o.Id == id);

    if (order == null)
        return NotFound();

    // Update header
    order.ClientId = dto.ClientId;
    order.InvoiceNo = dto.InvoiceNo;
    order.InvoiceDate = dto.InvoiceDate;
    order.ReferenceNo = dto.ReferenceNo;
    order.Note = dto.Note;
    order.Address1 = dto.Address1;
    order.Address2 = dto.Address2;
    order.Address3 = dto.Address3;
    order.Suburb = dto.Suburb;
    order.State = dto.State;
    order.PostCode = dto.PostCode;

    // Remove old lines
    _context.OrderLines.RemoveRange(order.Lines);

    // Add new lines
    order.Lines.Clear();
    foreach (var lineDto in dto.Lines)
    {
        order.Lines.Add(new OrderLine
        {
            ItemId = lineDto.ItemId,
            Note = lineDto.Note,
            Quantity = lineDto.Quantity,
            Price = lineDto.Price,
            TaxRate = lineDto.TaxRate,
            ExclAmount = lineDto.ExclAmount,
            TaxAmount = lineDto.TaxAmount,
            InclAmount = lineDto.InclAmount
        });
    }

    // Recalculate totals
    order.TotalExcl = order.Lines.Sum(l => l.ExclAmount);
    order.TotalTax = order.Lines.Sum(l => l.TaxAmount);
    order.TotalIncl = order.Lines.Sum(l => l.InclAmount);

    await _context.SaveChangesAsync();

    return NoContent();
}
```

---

## 🔐 CORS Configuration (CRITICAL!)

Add this to `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .WithOrigins("http://localhost:5173"); // Vite dev server
    });
});

var app = builder.Build();

// Add CORS before UseAuthorization
app.UseCors("AllowFrontend");
```

---

## 📋 Sample Data for Testing

```sql
-- Sample Clients
INSERT INTO Clients (ClientName, Address1, Address2, Suburb, State, PostCode) VALUES
('Acme Corporation', '123 Business St', 'Suite 100', 'Sydney', 'NSW', '2000'),
('Beta Industries', '456 Commerce Ave', 'Floor 5', 'Melbourne', 'VIC', '3000'),
('Gamma Enterprises', '789 Trade Blvd', '', 'Brisbane', 'QLD', '4000');

-- Sample Items
INSERT INTO Items (ItemCode, Description, Price) VALUES
('ITEM-001', 'Premium Widget', 99.99),
('ITEM-002', 'Standard Widget', 49.99),
('ITEM-003', 'Economy Widget', 19.99),
('SERV-001', 'Installation Service', 150.00),
('SERV-002', 'Maintenance Service', 75.00);
```

---

## ✅ Testing Checklist

1. **Test Client API:**
   ```bash
   curl https://localhost:7275/api/clients
   ```

2. **Test Items API:**
   ```bash
   curl https://localhost:7275/api/items
   ```

3. **Test Orders List:**
   ```bash
   curl https://localhost:7275/api/orders
   ```

4. **Test Create Order:**
   ```bash
   curl -X POST https://localhost:7275/api/orders \
     -H "Content-Type: application/json" \
     -d '{...order data...}'
   ```

---

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Solution:** Make sure CORS is configured BEFORE `app.UseAuthorization()`

### Issue: Navigation property null
**Solution:** Use `.Include()` in queries to load related data

### Issue: Cascade delete fails
**Solution:** Add `ON DELETE CASCADE` to foreign keys

### Issue: Invoice number duplicate
**Solution:** Add UNIQUE constraint and handle in code

---

## 📊 Frontend Expects These Exact Property Names

**From `/api/orders`:**
- `clientName` (not `name`)
- `invoiceNo`
- `invoiceDate`
- `totalIncl`

**From `/api/clients`:**
- `clientName` (not `name`)
- `address1`, `address2`, `address3`
- `suburb`, `state`, `postCode`

**From `/api/items`:**
- `itemCode` (not `code`)
- `description`
- `price`

---

This document contains **EVERYTHING** your backend needs to work with the frontend! 🎉
