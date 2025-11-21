using SalesOrders.API.Models;

namespace SalesOrders.API.Models
{
    public class Client
    {
        public int Id { get; set; }          // PK
        public string Name { get; set; } = string.Empty;

        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? Address3 { get; set; }
        public string? Suburb { get; set; }
        public string? State { get; set; }
        public string? PostCode { get; set; }

        public ICollection<SalesOrder> Orders { get; set; } = new List<SalesOrder>();
    }
}
