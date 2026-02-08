namespace shopstore.Models
{
    public class User
    {
        public int Id { get; set; }  
        public string Username { get; set; } = string.Empty;  
        public string PasswordHash { get; set; } = string.Empty;  
        public string Token { get; set; } = string.Empty;  

        public List<CartItem> CartItems { get; set; } = new(); 
        public List<Order> Orders { get; set; } = new(); 

       
        public virtual ICollection<Product>? Products { get; set; }
    }
}