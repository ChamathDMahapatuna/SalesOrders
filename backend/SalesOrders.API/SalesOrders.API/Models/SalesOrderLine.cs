namespace SalesOrders.API.Models
{
    public class SalesOrderLine
    {
        public int Id { get; set; }       // PK

        public int SalesOrderId { get; set; }
        public SalesOrder SalesOrder { get; set; } = null!;

        public int ItemId { get; set; }
        public Item Item { get; set; } = null!;

        public string? Note { get; set; }
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal TaxRate { get; set; }

        public decimal ExclAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal InclAmount { get; set; }
    }
}
