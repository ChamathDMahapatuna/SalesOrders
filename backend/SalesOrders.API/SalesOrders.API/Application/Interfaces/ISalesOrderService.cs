using SalesOrders.API.Application.DTOs;

namespace SalesOrders.API.Application.Interfaces
{
    public interface ISalesOrderService
    {
        Task<IEnumerable<SalesOrderDto>> GetAllOrdersAsync();
        Task<SalesOrderDto?> GetOrderByIdAsync(int id);
        Task<SalesOrderDto> CreateOrderAsync(SalesOrderDto orderDto);
        Task UpdateOrderAsync(int id, SalesOrderDto orderDto);
        Task DeleteOrderAsync(int id);
    }
}
