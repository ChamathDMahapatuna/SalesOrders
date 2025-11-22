using SalesOrders.API.Application.Interfaces;
using SalesOrders.API.Domain.Entities;
using SalesOrders.API.Infrastructure.Data;

namespace SalesOrders.API.Infrastructure.Repositories
{
    public class ClientRepository : Repository<Client>, IClientRepository
    {
        public ClientRepository(AppDbContext context) : base(context)
        {
        }
    }
}
