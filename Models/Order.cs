namespace shopstore.Models
{
    public class Order
    {
        public int Id { get; set; }  
        public int UserId { get; set; }  
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;  
        public OrderStatus Status { get; set; } = OrderStatus.Pending; 
        public decimal TotalAmount { get; set; } 

        public string Email { get; set; } = string.Empty;  
        public string Phone { get; set; } = string.Empty;  

        public User User { get; set; } 
        public List<OrderItem> Items { get; set; } = new();  
    }
}