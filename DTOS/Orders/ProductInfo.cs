namespace shopstore.DTOS.Orders
{
    public class ProductInfo
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public int? UserId { get; set; }
    }

}
