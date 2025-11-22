# 🗺️ Application Routes & Navigation Flow

## Route Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     React Router (BrowserRouter)             │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
    
   Route: /           Route: /orders/new    Route: /orders/:id
   ┌──────────┐       ┌─────────────────┐  ┌──────────────────┐
   │ HomePage │       │ SalesOrderPage  │  │ SalesOrderPage   │
   │ (List)   │       │ (Create Mode)   │  │ (Edit Mode)      │
   └──────────┘       └─────────────────┘  └──────────────────┘
```

---

## 🏠 Route 1: Home Page (/)

### Component: `HomePage`
### Purpose: Display list of all orders

### Visual Layout:
```
┌───────────────────────────────────────────────────────────┐
│  📊 Sales Orders                        [+ New Order]     │ ← Sticky Header
├───────────────────────────────────────────────────────────┤
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────┐│
│  │Total Orders│ │   Revenue  │ │  Pending   │ │Complete││ ← Stats Cards
│  │    45      │ │  $12,450   │ │     12     │ │   33   ││
│  └────────────┘ └────────────┘ └────────────┘ └────────┘│
├───────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐ │
│  │ All Orders (45 found)                    [Refresh]  │ │
│  ├─────────────────────────────────────────────────────┤ │
│  │ [Search by invoice or customer...] [Status Filter]  │ │
│  ├──────────┬──────────┬──────┬────────┬──────────────┤ │
│  │Invoice # │ Customer │ Date │ Status │ Total        │ │
│  ├──────────┼──────────┼──────┼────────┼──────────────┤ │
│  │ INV-001  │ Acme     │11/22 │ ✓ Done │ $220.00     │ │ ← Double-click
│  │ INV-002  │ Beta Inc │11/21 │ ⏱ Pend │ $450.00     │ │   to edit
│  └──────────┴──────────┴──────┴────────┴──────────────┘ │
└───────────────────────────────────────────────────────────┘
```

### User Actions:
1. **Click "New Order"** → Navigate to `/orders/new`
2. **Double-click row** → Navigate to `/orders/{id}`
3. **Search/Filter** → Filter data locally
4. **Refresh** → Reload from API

### API Calls:
- `GET /api/orders` on mount

---

## ➕ Route 2: Create Order (/orders/new)

### Component: `SalesOrderPage`
### Purpose: Create a new sales order

### Visual Layout:
```
┌──────────────────────────────────────────────────────────────────────┐
│  [← Back]  New Sales Order            [Cancel] [Create Order]       │ ← Sticky Header
├──────────────────────────────────────────────┬───────────────────────┤
│  ┌──────────────────────────────────────┐   │ ┌───────────────────┐│
│  │ Customer & Invoice Information       │   │ │ Order Summary     ││
│  ├──────────────────────────────────────┤   │ ├───────────────────┤│
│  │ [Customer ▼] [Invoice No]            │   │ │ Subtotal:  $200   ││
│  │ [Date]       [Reference]             │   │ │ Tax:       $20    ││
│  │ [Notes...]                           │   │ │ Total:     $220   ││ ← Sticky
│  └──────────────────────────────────────┘   │ │                   ││   Sidebar
│  ┌──────────────────────────────────────┐   │ │ 2 items           ││
│  │ Delivery Address                     │   │ │ Customer: Acme    ││
│  ├──────────────────────────────────────┤   │ │ Date: Nov 22      ││
│  │ [Address 1] [Address 2] [Address 3]  │   │ └───────────────────┘│
│  │ [Suburb] [State] [Postcode]          │   │ ┌───────────────────┐│
│  └──────────────────────────────────────┘   │ │ 💡 Quick Tips     ││
│  ┌──────────────────────────────────────┐   │ │ • Select customer ││
│  │ Order Items (2 items)    [+ Add Item]│   │ │   to auto-fill    ││
│  ├──────────────────────────────────────┤   │ └───────────────────┘│
│  │ Item #1                    [Remove]   │   │                      │
│  │ [Item ▼] [Note...]                   │   │                      │
│  │ [Qty] [Price] [Tax%]  Total: $110    │   │                      │
│  │                                       │   │                      │
│  │ Item #2                    [Remove]   │   │                      │
│  │ [Item ▼] [Note...]                   │   │                      │
│  │ [Qty] [Price] [Tax%]  Total: $110    │   │                      │
│  └──────────────────────────────────────┘   │                      │
└──────────────────────────────────────────────┴───────────────────────┘
```

### User Actions:
1. **Select Customer** → Auto-fills address
2. **Select Item** → Auto-fills price
3. **Change Qty/Price/Tax** → Recalculates amounts
4. **Add Item** → Adds new line
5. **Remove Item** → Removes line (min 1)
6. **Create Order** → POST to API, navigate to `/`
7. **Cancel/Back** → Navigate to `/`

### API Calls:
- `GET /api/clients` on mount
- `GET /api/items` on mount
- `POST /api/orders` on save

---

## ✏️ Route 3: Edit Order (/orders/:id)

### Component: `SalesOrderPage` (same component, edit mode)
### Purpose: Edit existing order

### Visual Layout:
Same as Create, but:
- Header shows "Edit Sales Order" + order number
- Button says "Update Order" instead of "Create Order"
- Form pre-populated with existing data

### User Actions:
Same as Create, plus:
1. **Update Order** → PUT to API, navigate to `/`

### API Calls:
- `GET /api/clients` on mount
- `GET /api/items` on mount
- `GET /api/orders/{id}` on mount (loads existing order)
- `PUT /api/orders/{id}` on save

---

## 🔄 Navigation Flow Diagram

```
         Start
           │
           ▼
      ┌─────────┐
      │ HOME    │ ← GET /api/orders
      │ /       │
      └─────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
[New Order]   [Double-click row]
    │             │
    ▼             ▼
┌─────────┐   ┌─────────┐
│ CREATE  │   │  EDIT   │ ← GET /api/clients, /api/items
│/new     │   │ /{id}   │ ← GET /api/orders/{id} (edit only)
└─────────┘   └─────────┘
    │             │
    ▼             ▼
[Save Order]  [Update Order]
    │             │
    ▼             ▼
POST /api/    PUT /api/
   orders        orders/{id}
    │             │
    └──────┬──────┘
           │
           ▼
   Navigate to /
```

---

## 🎨 Responsive Breakpoints

### Mobile (< 640px)
- Single column layout
- Stacked stats cards
- Sidebar moves below form
- Table scrolls horizontally

### Tablet (640px - 1024px)
- 2-column stats grid
- Form remains single column
- Sidebar still below

### Desktop (> 1024px)
- 4-column stats grid
- 2/3 form + 1/3 sidebar layout
- Full table visible

---

## 🔐 Protected Routes (Future Enhancement)

If you add authentication later:

```jsx
<Route
  path="/orders/new"
  element={
    <ProtectedRoute>
      <SalesOrderPage />
    </ProtectedRoute>
  }
/>
```

---

## 📱 URL Parameters

### Route Parameters
- `:id` in `/orders/:id` - Order ID for editing

### Query Parameters (not currently used, but can add)
- `/orders?status=pending` - Filter by status
- `/orders?search=INV-001` - Pre-fill search
- `/orders?page=2` - Pagination

---

## 🚀 Quick Navigation Commands

Users can navigate using:
1. **Browser back/forward** buttons (full browser history)
2. **Direct URL** entry
3. **Component buttons** (New Order, Back, Cancel)
4. **Table interaction** (double-click)

---

## 📝 Route Guards (Validation)

Before navigating away from form with unsaved changes, you can add:

```jsx
// In SalesOrderPage.jsx
useEffect(() => {
  const handleBeforeUnload = (e) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = '';
    }
  };
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [hasUnsavedChanges]);
```

---

## 🎯 Key Features by Route

### Home (/)
✅ Read-only operations
✅ Search & filter
✅ Stats dashboard
✅ Quick navigation

### Create (/orders/new)
✅ Form with validation
✅ Real-time calculations
✅ Auto-fill functionality
✅ Multi-line items

### Edit (/orders/:id)
✅ Pre-populated form
✅ Same features as create
✅ Update existing data
✅ Preserve history
