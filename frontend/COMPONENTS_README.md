# Tailwind CSS Component Library

## Overview
This project uses Tailwind CSS v4 with a comprehensive design system and reusable components for fast UI development.

## Design System

### Colors
- **Primary**: Blue shades (50-900) for main actions and links
- **Secondary**: Gray/slate shades for neutral elements
- **Success**: Green for positive actions and states
- **Warning**: Yellow/amber for caution states
- **Danger**: Red for errors and destructive actions

### Typography
- **Font Family**: Inter (sans-serif), Fira Code (monospace)
- **Headings**: Automatic sizing and weights via `@layer base`
- **Text Sizes**: `text-sm`, `text-base`, `text-lg`, `text-xl`, etc.

### Spacing & Layout
- Standard Tailwind spacing scale (0.5rem increments)
- Extended: `spacing-128` (32rem), `spacing-144` (36rem)
- **Utility Classes**:
  - Layout: `flex`, `grid`, `gap-*`, `p-*`, `m-*`
  - Responsive: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

### Shadows
- `shadow-soft`: Subtle elevation
- `shadow-card`: Standard card shadow
- `shadow-elevated`: Higher elevation

## Components

### Form Controls (`FormControls.jsx`)

#### Input
Text input with label, error handling, and validation states.

```jsx
import { Input } from './components';

<Input
  id="customerName"
  label="Customer Name"
  placeholder="Enter name"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  error="This field is required"
  required
/>
```

**Props:**
- `label` (string): Field label
- `id` (string, required): Unique identifier
- `type` (string): Input type (default: 'text')
- `placeholder` (string): Placeholder text
- `value` (string|number): Input value
- `onChange` (function): Change handler
- `error` (string): Error message
- `required` (bool): Required field indicator
- `disabled` (bool): Disabled state

#### Select
Dropdown with consistent styling.

```jsx
import { Select } from './components';

<Select
  id="category"
  label="Category"
  options={[
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' }
  ]}
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  required
/>
```

**Props:**
- `options` (array): Array of `{value, label}` objects
- All other props same as Input

#### Button
Multi-variant button with loading state.

```jsx
import { Button } from './components';

<Button
  variant="primary"
  size="md"
  type="submit"
  loading={isSubmitting}
  onClick={handleClick}
>
  Submit Order
</Button>
```

**Props:**
- `variant` (string): 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost'
- `size` (string): 'sm' | 'md' | 'lg'
- `type` (string): 'button' | 'submit' | 'reset'
- `loading` (bool): Shows loading spinner
- `disabled` (bool): Disabled state
- `onClick` (function): Click handler

### Table Components (`TableComponents.jsx`)

#### Table
Responsive data table with custom renderers.

```jsx
import { Table } from './components';

const columns = [
  { key: 'id', header: 'Order ID' },
  { 
    key: 'status', 
    header: 'Status',
    render: (value) => <Badge variant="success">{value}</Badge>
  },
];

<Table
  columns={columns}
  data={orders}
  loading={false}
  emptyMessage="No orders found"
  onRowClick={(row) => console.log(row)}
/>
```

**Props:**
- `columns` (array, required): Column definitions with `key`, `header`, optional `render` function
- `data` (array): Array of row objects
- `loading` (bool): Loading state
- `emptyMessage` (string): Message when no data
- `onRowClick` (function): Row click handler

#### Card
Container component with header and actions.

```jsx
import { Card } from './components';

<Card
  title="Sales Orders"
  subtitle="Manage your orders"
  actions={<Button>New Order</Button>}
>
  {/* Content here */}
</Card>
```

**Props:**
- `title` (string): Card title
- `subtitle` (string): Card subtitle
- `actions` (node): Action buttons in header
- `children` (node, required): Card content

#### Badge
Status indicator with color variants.

```jsx
import { Badge } from './components';

<Badge variant="success" size="md">
  Completed
</Badge>
```

**Props:**
- `variant` (string): 'default' | 'primary' | 'success' | 'warning' | 'danger'
- `size` (string): 'sm' | 'md' | 'lg'

## Custom CSS Classes

### Layout Utilities
```css
.form-grid          /* Responsive 3-column grid for forms */
.form-section       /* Card styling for form sections */
.container-custom   /* Max-width container with padding */
.table-container    /* Scrollable table wrapper */
```

### Usage Examples

#### Form Layout (Screen 1)
```jsx
<div className="container-custom py-8">
  <Card title="Create Order">
    <form className="space-y-6">
      <div className="form-grid">
        <Input label="Customer" />
        <Input label="Date" />
        <Select label="Category" />
      </div>
    </form>
  </Card>
</div>
```

#### Table Layout (Screen 2)
```jsx
<div className="container-custom py-8">
  <Card title="Orders List">
    <div className="table-container">
      <Table columns={columns} data={data} />
    </div>
  </Card>
</div>
```

## Responsive Design

All components are mobile-first and responsive:

```jsx
/* Responsive grid example */
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Stats cards */}
</div>

/* Responsive flex example */
<div className="flex flex-col sm:flex-row gap-4">
  <Input className="flex-1" />
  <Select className="sm:w-48" />
</div>
```

## Example Screens

### Screen 1: Sales Order Form
Location: `src/components/SalesOrderForm.jsx`

Features:
- Responsive form layout
- Real-time total calculation
- Form validation
- Loading states

### Screen 2: Orders List
Location: `src/components/OrdersList.jsx`

Features:
- Searchable/filterable table
- Status badges
- Summary statistics
- Row actions (Edit/Delete)
- Click-through navigation

## Getting Started

1. **Import components:**
```jsx
import { Input, Select, Button, Table, Card, Badge } from './components';
```

2. **Use Tailwind utilities:**
```jsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-card">
  {/* Content */}
</div>
```

3. **Responsive design:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Items */}
</div>
```

## Best Practices

1. **Consistent spacing**: Use `gap-*`, `p-*`, `m-*` utilities
2. **Color system**: Use defined color variants (primary, success, etc.)
3. **Responsive**: Always consider mobile-first design
4. **Reusable**: Use components instead of repeating markup
5. **Accessibility**: Always include labels, proper ARIA attributes

## Configuration

Tailwind config: `tailwind.config.js`
Custom styles: `src/index.css`
Components: `src/components/`

To customize the design system, edit `tailwind.config.js` theme.extend section.
