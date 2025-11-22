using Microsoft.EntityFrameworkCore;
using SalesOrders.API.Application.Interfaces;
using SalesOrders.API.Domain.Entities;
using SalesOrders.API.Infrastructure.Data;

namespace SalesOrders.API.Infrastructure.Repositories
{
    public class SalesOrderRepository : Repository<SalesOrder>, ISalesOrderRepository
    {
        public SalesOrderRepository(AppDbContext context) : base(context)
        {
        }

        public override async Task<IEnumerable<SalesOrder>> GetAllAsync()
        {
            return await _dbSet
                .Include(o => o.Client)
                .Include(o => o.Lines)
                .ThenInclude(l => l.Item)
                .ToListAsync();
        }

        public async Task<SalesOrder?> GetByIdWithDetailsAsync(int id)
        {
            return await _dbSet
                .Include(o => o.Client)
                .Include(o => o.Lines)
                .ThenInclude(l => l.Item)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public override async Task<SalesOrder?> GetByIdAsync(int id)
        {
            return await GetByIdWithDetailsAsync(id);
        }
    }
}
