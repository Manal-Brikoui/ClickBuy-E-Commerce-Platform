namespace shopstore.DTOs.Cart
{
    public class CartItemDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal ProductPrice { get; set; }
        public string ProductImage { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Subtotal { get; set; }
    }
}