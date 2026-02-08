using Microsoft.EntityFrameworkCore;
using shopstore.Models;

namespace shopstore.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

    
        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            
            modelBuilder.Entity<User>()
                .HasMany(u => u.CartItems)
                .WithOne(c => c.User)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Orders)
                .WithOne(o => o.User)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Product>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);

          
            modelBuilder.Entity<CartItem>()
                .HasOne(ci => ci.Product)
                .WithMany()
                .HasForeignKey(ci => ci.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

      
            modelBuilder.Entity<Order>()
                .HasMany(o => o.Items)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

        
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany()
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

           
            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.RelatedUser)
                .WithMany()
                .HasForeignKey(n => n.RelatedUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Order)
                .WithMany()
                .HasForeignKey(n => n.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

           
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Product)
                .WithMany()
                .HasForeignKey(c => c.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .Property(u => u.Username)
                .HasColumnType("varchar(50)")
                .IsRequired();

            modelBuilder.Entity<User>()
                .Property(u => u.PasswordHash)
                .HasColumnType("varchar(255)")
                .IsRequired();

            modelBuilder.Entity<User>()
                .Property(u => u.Token)
                .HasColumnType("varchar(36)");

        

            modelBuilder.Entity<Product>()
                .Property(p => p.Name)
                .HasColumnType("varchar(255)")
                .IsRequired();

            modelBuilder.Entity<Product>()
                .Property(p => p.Description)
                .HasColumnType("text");

            modelBuilder.Entity<Product>()
                .Property(p => p.ImageUrl)
                .HasColumnType("varchar(500)");

            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18,2)");

           

            modelBuilder.Entity<Order>()
                .Property(o => o.Email)
                .HasColumnType("varchar(100)")
                .IsRequired();

            modelBuilder.Entity<Order>()
                .Property(o => o.Phone)
                .HasColumnType("varchar(20)")
                .IsRequired();

            modelBuilder.Entity<Order>()
                .Property(o => o.TotalAmount)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Order>()
                .HasIndex(o => o.Email);

          

            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.UnitPrice)
                .HasColumnType("decimal(18,2)");


            modelBuilder.Entity<Notification>()
                .Property(n => n.Type)
                .HasColumnType("varchar(100)")
                .IsRequired();

            modelBuilder.Entity<Notification>()
                .Property(n => n.Message)
                .HasColumnType("varchar(500)")
                .IsRequired();

            modelBuilder.Entity<Notification>()
                .Property(n => n.Link)
                .HasColumnType("varchar(500)");

          

            modelBuilder.Entity<Comment>()
                .Property(c => c.Content)
                .HasColumnType("text")
                .IsRequired();

          
            modelBuilder.Entity<Comment>()
                .HasIndex(c => c.ProductId);

            modelBuilder.Entity<Comment>()
                .HasIndex(c => c.UserId);

    
            modelBuilder.Entity<Comment>()
                .HasIndex(c => new { c.UserId, c.ProductId })
                .IsUnique(); 
        }
    }
}