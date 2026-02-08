namespace shopstore.DTOs.Orders
{
   
    public class ConfirmOrderResponse
    {
        public int OrderId { get; set; }  
        public int UserId { get; set; } 
        public DateTime CreatedAt { get; set; }  
        public decimal TotalAmount { get; set; } 
        public List<OrderItemResponse> Items { get; set; } = new List<OrderItemResponse>(); 
    }

    public class OrderItemResponse
    {
        public int ProductId { get; set; } 
        public string ProductName { get; set; } = string.Empty;  
        public decimal Price { get; set; }  
        public int Quantity { get; set; } 
    }
}
