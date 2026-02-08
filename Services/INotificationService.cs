using shopstore.DTOS.Notifications;

namespace shopstore.Services
{
    public interface INotificationService
    {
        Task CreateOrderReceivedNotificationAsync(int orderId, int buyerId, int sellerId);
        Task CreateOrderStatusChangedNotificationAsync(int orderId, int buyerId, string newStatus);
        Task<List<NotificationDto>> GetUserNotificationsAsync(int userId, bool unreadOnly = false);
        Task<int> GetUnreadCountAsync(int userId);
        Task<NotificationDto> MarkAsReadAsync(int notificationId, int userId);
        Task MarkAllAsReadAsync(int userId);
        Task DeleteNotificationAsync(int notificationId, int userId);
    }
}