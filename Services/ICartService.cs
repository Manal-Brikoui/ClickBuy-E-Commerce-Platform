using shopstore.DTOs.Cart;

namespace shopstore.Services
{
    public interface ICartService
    {
        Task<List<CartItemDto>> GetCartAsync();
        Task AddToCartAsync(AddToCartRequest request);
        Task UpdateCartAsync(UpdateCartRequest request);
        Task RemoveFromCartAsync(int productId);
        Task ClearCartAsync();
    }
}
