using SalesOrders.API.Application.Interfaces;
using SalesOrders.API.Domain.Entities;
using SalesOrders.API.Infrastructure.Data;

namespace SalesOrders.API.Infrastructure.Repositories
{
    public class ItemRepository : Repository<Item>, IItemRepository
    {
        public ItemRepository(AppDbContext context) : base(context)
        {
        }
    }
}
