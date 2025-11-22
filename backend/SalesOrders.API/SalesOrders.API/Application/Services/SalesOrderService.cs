using SalesOrders.API.Application.DTOs;
using SalesOrders.API.Application.Interfaces;
using SalesOrders.API.Domain.Entities;

namespace SalesOrders.API.Application.Services
{
    public class SalesOrderService : ISalesOrderService
    {
        private readonly ISalesOrderRepository _orderRepository;
        private readonly IClientRepository _clientRepository;
        private readonly IItemRepository _itemRepository;

        public SalesOrderService(
            ISalesOrderRepository orderRepository,
            IClientRepository clientRepository,
            IItemRepository itemRepository)
        {
            _orderRepository = orderRepository;
            _clientRepository = clientRepository;
            _itemRepository = itemRepository;
        }

        public async Task<IEnumerable<SalesOrderDto>> GetAllOrdersAsync()
        {
            var orders = await _orderRepository.GetAllAsync();
            return orders.Select(MapToDto);
        }

        public async Task<SalesOrderDto?> GetOrderByIdAsync(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            return order == null ? null : MapToDto(order);
        }

        public async Task<SalesOrderDto> CreateOrderAsync(SalesOrderDto orderDto)
        {
            var order = MapToEntity(orderDto);
            
            // Calculate totals
            order.TotalExcl = order.Lines.Sum(l => l.ExclAmount);
            order.TotalTax = order.Lines.Sum(l => l.TaxAmount);
            order.TotalIncl = order.Lines.Sum(l => l.InclAmount);

            var createdOrder = await _orderRepository.AddAsync(order);
            return MapToDto(createdOrder);
        }

        public async Task UpdateOrderAsync(int id, SalesOrderDto orderDto)
        {
            var existingOrder = await _orderRepository.GetByIdAsync(id);
            if (existingOrder == null)
                throw new KeyNotFoundException($"Order with ID {id} not found");

            // Update order properties
            existingOrder.InvoiceNo = orderDto.InvoiceNo;
            existingOrder.InvoiceDate = orderDto.InvoiceDate;
            existingOrder.ReferenceNo = orderDto.ReferenceNo;
            existingOrder.Note = orderDto.Note;
            existingOrder.ClientId = orderDto.ClientId;
            existingOrder.Address1 = orderDto.Address1;
            existingOrder.Address2 = orderDto.Address2;
            existingOrder.Address3 = orderDto.Address3;
            existingOrder.Suburb = orderDto.Suburb;
            existingOrder.State = orderDto.State;
            existingOrder.PostCode = orderDto.PostCode;

            // Update lines
            existingOrder.Lines.Clear();
            foreach (var lineDto in orderDto.Lines)
            {
                existingOrder.Lines.Add(new SalesOrderLine
                {
                    ItemId = lineDto.ItemId,
                    Note = lineDto.Note,
                    Quantity = lineDto.Quantity,
                    Price = lineDto.Price,
                    TaxRate = lineDto.TaxRate,
                    ExclAmount = lineDto.ExclAmount,
                    TaxAmount = lineDto.TaxAmount,
                    InclAmount = lineDto.InclAmount
                });
            }

            // Recalculate totals
            existingOrder.TotalExcl = existingOrder.Lines.Sum(l => l.ExclAmount);
            existingOrder.TotalTax = existingOrder.Lines.Sum(l => l.TaxAmount);
            existingOrder.TotalIncl = existingOrder.Lines.Sum(l => l.InclAmount);

            await _orderRepository.UpdateAsync(existingOrder);
        }

        public async Task DeleteOrderAsync(int id)
        {
            await _orderRepository.DeleteAsync(id);
        }

        private SalesOrderDto MapToDto(SalesOrder order)
        {
            return new SalesOrderDto
            {
                Id = order.Id,
                InvoiceNo = order.InvoiceNo,
                InvoiceDate = order.InvoiceDate,
                ReferenceNo = order.ReferenceNo,
                Note = order.Note,
                ClientId = order.ClientId,
                ClientName = order.Client?.Name,
                Address1 = order.Address1,
                Address2 = order.Address2,
                Address3 = order.Address3,
                Suburb = order.Suburb,
                State = order.State,
                PostCode = order.PostCode,
                TotalExcl = order.TotalExcl,
                TotalTax = order.TotalTax,
                TotalIncl = order.TotalIncl,
                Lines = order.Lines.Select(l => new SalesOrderLineDto
                {
                    Id = l.Id,
                    ItemId = l.ItemId,
                    Note = l.Note,
                    Quantity = l.Quantity,
                    Price = l.Price,
                    TaxRate = l.TaxRate,
                    ExclAmount = l.ExclAmount,
                    TaxAmount = l.TaxAmount,
                    InclAmount = l.InclAmount
                }).ToList()
            };
        }

        private SalesOrder MapToEntity(SalesOrderDto dto)
        {
            return new SalesOrder
            {
                Id = dto.Id,
                InvoiceNo = dto.InvoiceNo,
                InvoiceDate = dto.InvoiceDate,
                ReferenceNo = dto.ReferenceNo,
                Note = dto.Note,
                ClientId = dto.ClientId,
                Address1 = dto.Address1,
                Address2 = dto.Address2,
                Address3 = dto.Address3,
                Suburb = dto.Suburb,
                State = dto.State,
                PostCode = dto.PostCode,
                Lines = dto.Lines.Select(l => new SalesOrderLine
                {
                    Id = l.Id,
                    ItemId = l.ItemId,
                    Note = l.Note,
                    Quantity = l.Quantity,
                    Price = l.Price,
                    TaxRate = l.TaxRate,
                    ExclAmount = l.ExclAmount,
                    TaxAmount = l.TaxAmount,
                    InclAmount = l.InclAmount
                }).ToList()
            };
        }
    }
}
