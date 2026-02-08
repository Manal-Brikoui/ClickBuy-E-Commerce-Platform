using shopstore.DTOs.Orders;
using shopstore.DTOS.Orders;

namespace shopstore.Services
{
    public interface IOrderService
    {
        Task<OrderResponse> CreateOrderAsync(CreateOrderRequest request);

        Task<OrderResponse?> GetOrderByIdAsync(int orderId);
        Task<List<OrderResponse>> GetOrdersByUserIdAsync(int userId); 
        Task<List<OrderResponse>> GetOrdersForSellerAsync(int sellerId); 
        Task<List<OrderResponse>> GetAllOrdersAsync();

        Task<OrderResponse> UpdateItemQuantityAsync(int orderId, int itemId, int quantity);
        Task<OrderResponse> DeleteItemAsync(int orderId, int itemId);

        Task<OrderResponse> CancelOrderAsync(int orderId);
        Task<OrderResponse> UpdateOrderStatusAsync(int orderId, string newStatus, int currentUserId);

        Task<OrderResponse> AcceptOrderAsync(int orderId, int sellerId);
        Task<OrderResponse> RejectOrderAsync(int orderId, int sellerId);
    }
}