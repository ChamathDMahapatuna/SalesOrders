using Microsoft.EntityFrameworkCore;
using SalesOrders.API.Models;

namespace SalesOrders.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Client> Clients => Set<Client>();
        public DbSet<Item> Items => Set<Item>();
        public DbSet<SalesOrder> SalesOrders => Set<SalesOrder>();
        public DbSet<SalesOrderLine> SalesOrderLines => Set<SalesOrderLine>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Item>()
                .HasIndex(i => i.ItemCode)
                .IsUnique();

            modelBuilder.Entity<SalesOrderLine>()
                .HasOne(l => l.SalesOrder)
                .WithMany(o => o.Lines)
                .HasForeignKey(l => l.SalesOrderId);

            modelBuilder.Entity<SalesOrderLine>()
                .HasOne(l => l.Item)
                .WithMany(i => i.Lines)
                .HasForeignKey(l => l.ItemId);
        }
    }
}