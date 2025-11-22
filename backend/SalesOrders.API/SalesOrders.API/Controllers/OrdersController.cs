using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalesOrders.API.Data;
using SalesOrders.API.Models;

namespace SalesOrders.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetOrders()
        {
            var orders = await _context.SalesOrders
                .Include(o => o.Client)
                .ToListAsync();

            // simple projection for list screen
            var result = orders.Select(o => new
            {
                id = o.Id,
                invoiceNo = o.InvoiceNo,
                invoiceDate = o.InvoiceDate.ToString("yyyy-MM-dd"),
                clientName = o.Client.Name,
                totalIncl = o.TotalIncl,
                referenceNo = o.ReferenceNo,
                note = o.Note
            });

            return Ok(result);
        }

        // GET: api/orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SalesOrder>> GetOrder(int id)
        {
            var order = await _context.SalesOrders
                .Include(o => o.Client)
                .Include(o => o.Lines)
                    .ThenInclude(l => l.Item)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound();

            return order; // React can read Client + Lines
        }

        // POST: api/orders
        [HttpPost]
        public async Task<ActionResult<SalesOrder>> CreateOrder(SalesOrder order)
        {
            // calculate amounts on backend
            foreach (var line in order.Lines)
            {
                var excl = line.Quantity * line.Price;
                var taxAmount = excl * line.TaxRate / 100m;
                var incl = excl + taxAmount;

                line.ExclAmount = excl;
                line.TaxAmount = taxAmount;
                line.InclAmount = incl;
            }

            order.TotalExcl = order.Lines.Sum(l => l.ExclAmount);
            order.TotalTax = order.Lines.Sum(l => l.TaxAmount);
            order.TotalIncl = order.Lines.Sum(l => l.InclAmount);

            _context.SalesOrders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }

        // PUT: api/orders/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, SalesOrder order)
        {
            if (id != order.Id)
                return BadRequest();

            // Recalculate
            foreach (var line in order.Lines)
            {
                var excl = line.Quantity * line.Price;
                var taxAmount = excl * line.TaxRate / 100m;
                var incl = excl + taxAmount;

                line.ExclAmount = excl;
                line.TaxAmount = taxAmount;
                line.InclAmount = incl;
            }

            order.TotalExcl = order.Lines.Sum(l => l.ExclAmount);
            order.TotalTax = order.Lines.Sum(l => l.TaxAmount);
            order.TotalIncl = order.Lines.Sum(l => l.InclAmount);

            _context.Entry(order).State = EntityState.Modified;

            // mark lines too
            foreach (var line in order.Lines)
            {
                if (line.Id == 0)
                {
                    _context.Entry(line).State = EntityState.Added;
                }
                else
                {
                    _context.Entry(line).State = EntityState.Modified;
                }
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
