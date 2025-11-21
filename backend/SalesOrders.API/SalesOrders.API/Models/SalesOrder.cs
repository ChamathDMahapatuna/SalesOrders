using SalesOrders.API.Models;

namespace SalesOrders.API.Models
{
    public class SalesOrder
    {
        public int Id { get; set; }   // PK

        public string InvoiceNo { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; }
        public string? ReferenceNo { get; set; }
        public string? Note { get; set; }

        public int ClientId { get; set; }
        public Client Client { get; set; } = null!;

        public decimal TotalExcl { get; set; }
        public decimal TotalTax { get; set; }
        public decimal TotalIncl { get; set; }

        public ICollection<SalesOrderLine> Lines { get; set; } = new List<SalesOrderLine>();
    }
}
