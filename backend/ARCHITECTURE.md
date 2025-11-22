# Backend Architecture Documentation

## Overview
The backend now follows **Layered (N-Tier) Architecture** with clear separation of concerns.

## Architecture Layers

### 1. **Domain Layer** (`/Domain/Entities`)
- Contains pure business entities
- No dependencies on other layers
- Files:
  - `Client.cs`
  - `Item.cs`
  - `SalesOrder.cs`
  - `SalesOrderLine.cs`

### 2. **Application Layer** (`/Application`)
Handles business logic and orchestration.

#### `/Application/Interfaces`
- `IRepository<T>` - Generic repository interface
- `IClientRepository` - Client-specific repository
- `IItemRepository` - Item-specific repository  
- `ISalesOrderRepository` - Order-specific repository with additional methods
- `ISalesOrderService` - Business logic service interface

#### `/Application/Services`
- `SalesOrderService` - Implements business logic for orders
  - Calculates totals
  - Maps between DTOs and Entities
  - Orchestrates repository operations

#### `/Application/DTOs`
- `ClientDto`
- `ItemDto`
- `SalesOrderDto`
- `SalesOrderLineDto`

### 3. **Infrastructure Layer** (`/Infrastructure`)
Handles data access and external concerns.

#### `/Infrastructure/Data`
- `AppDbContext` - Entity Framework DbContext
  - Configures database relationships
  - Manages database connections

#### `/Infrastructure/Repositories`
- `Repository<T>` - Generic repository implementation
- `ClientRepository` - Client data access
- `ItemRepository` - Item data access
- `SalesOrderRepository` - Order data access with eager loading

### 4. **API Layer** (`/Controllers`)
- `OrdersController` - RESTful API for orders
- `ClientsController` - API for clients
- `ItemsController` - API for items

## Dependency Flow
```
Controllers → Services → Repositories → DbContext → Database
     ↓           ↓            ↓
   DTOs    →  Entities  →  Entities
```

## Dependency Injection Setup (Program.cs)
```csharp
// Repositories
services.AddScoped<IClientRepository, ClientRepository>();
services.AddScoped<IItemRepository, ItemRepository>();
services.AddScoped<ISalesOrderRepository, SalesOrderRepository>();

// Services  
services.AddScoped<ISalesOrderService, SalesOrderService>();
```

## Key Features
✅ **Separation of Concerns** - Each layer has a single responsibility  
✅ **Dependency Inversion** - Depends on abstractions (interfaces)  
✅ **Testability** - Services and repositories can be easily mocked  
✅ **Maintainability** - Changes in one layer don't affect others  
✅ **Scalability** - Easy to add new features following the same pattern  

## Best Practices Implemented
- ✅ Repository Pattern for data access
- ✅ Service Layer for business logic
- ✅ DTOs for API contracts
- ✅ Dependency Injection
- ✅ Async/Await throughout
- ✅ Proper error handling with try-catch
- ✅ RESTful API design
- ✅ Entity Framework Core with eager loading
- ✅ JSON serialization with cycle handling

## Database Structure
Tables remain unchanged - using existing SQL Server database with:
- Clients
- Items
- SalesOrders (with address fields)
- SalesOrderLines

## Migration Path
All existing functionality is preserved. The refactoring:
1. Moves entities to Domain layer
2. Adds repository pattern for data access
3. Adds service layer for business logic
4. Uses DTOs for API contracts
5. Registers all dependencies via DI

The API endpoints remain the same, ensuring frontend compatibility.
