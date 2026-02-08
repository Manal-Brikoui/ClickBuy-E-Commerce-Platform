namespace shopstore.DTOS.Orders
{
    public class OrderResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }

        
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;

        public List<OrderItemDetailResponse> Items { get; set; } = new();
    }
}