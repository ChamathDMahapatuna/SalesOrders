using Microsoft.AspNetCore.Mvc;
using SalesOrders.API.Application.DTOs;
using SalesOrders.API.Application.Interfaces;

namespace SalesOrders.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemsController : ControllerBase
    {
        private readonly IItemRepository _itemRepository;

        public ItemsController(IItemRepository itemRepository)
        {
            _itemRepository = itemRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetItems()
        {
            var items = await _itemRepository.GetAllAsync();
            var itemDtos = items.Select(i => new ItemDto
            {
                Id = i.Id,
                Code = i.ItemCode,
                Description = i.Description,
                Price = i.Price
            });

            return Ok(itemDtos);
        }
    }
}
