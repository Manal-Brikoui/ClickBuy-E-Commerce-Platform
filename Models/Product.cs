namespace shopstore.Models
{
    public class Product
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public int Stock { get; set; }

        public string? Description { get; set; }  

        public string? ImageUrl { get; set; }

        public int? UserId { get; set; }

        public virtual User? User { get; set; }
    }
}