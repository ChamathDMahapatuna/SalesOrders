using Microsoft.AspNetCore.Mvc;
using SalesOrders.API.Application.DTOs;
using SalesOrders.API.Application.Interfaces;

namespace SalesOrders.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientsController : ControllerBase
    {
        private readonly IClientRepository _clientRepository;

        public ClientsController(IClientRepository clientRepository)
        {
            _clientRepository = clientRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClientDto>>> GetClients()
        {
            var clients = await _clientRepository.GetAllAsync();
            var clientDtos = clients.Select(c => new ClientDto
            {
                Id = c.Id,
                Name = c.Name,
                Address1 = c.Address1,
                Address2 = c.Address2,
                Address3 = c.Address3,
                Suburb = c.Suburb,
                State = c.State,
                PostCode = c.PostCode
            });

            return Ok(clientDtos);
        }
    }
}
