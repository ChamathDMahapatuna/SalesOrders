using SalesOrders.API.Domain.Entities;

namespace SalesOrders.API.Application.Interfaces
{
    public interface ISalesOrderRepository : IRepository<SalesOrder>
    {
        Task<SalesOrder?> GetByIdWithDetailsAsync(int id);
    }
}
