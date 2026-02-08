using Microsoft.EntityFrameworkCore;
using shopstore.Data;
using shopstore.DTOS.Notifications;
using shopstore.Models;

namespace shopstore.Services
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(AppDbContext context, ILogger<NotificationService> logger)
        {
            _context = context;
            _logger = logger;
        }

        //  Créer une notification pour une nouvelle commande reçue
        public async Task CreateOrderReceivedNotificationAsync(int orderId, int buyerId, int sellerId)
        {
            try
            {
                _logger.LogInformation($" Création notification ORDER_RECEIVED - OrderId: {orderId}, BuyerId: {buyerId}, SellerId: {sellerId}");

              
                var buyer = await _context.Users.FindAsync(buyerId);
                var buyerName = buyer?.Username ?? "un client";

                _logger.LogInformation($" Acheteur trouvé: {buyerName}");

                var notification = new Notification
                {
                    UserId = sellerId,  
                    Type = "ORDER_RECEIVED",
                    Message = $"Nouvelle commande #{orderId} de {buyerName}",
                    OrderId = orderId,
                    RelatedUserId = buyerId,
                    IsRead = false,
                    Link = $"/orders/{orderId}",
                    CreatedAt = DateTime.UtcNow
                };

                _context.Notifications.Add(notification);
                await _context.SaveChangesAsync();

                _logger.LogInformation($" Notification créée avec succès pour le vendeur {sellerId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $" Erreur lors de la création de la notification ORDER_RECEIVED");
                throw;
            }
        }

        //  Créer une notification pour un changement de statut
        public async Task CreateOrderStatusChangedNotificationAsync(int orderId, int buyerId, string newStatus)
        {
            try
            {
                _logger.LogInformation($" Création notification ORDER_STATUS_CHANGED - OrderId: {orderId}, BuyerId: {buyerId}, Status: {newStatus}");

                var statusMessages = new Dictionary<string, string>
                {
                    { "Processing", "Votre commande est en cours de traitement" },
                    { "Shipped", "Votre commande a été expédiée" },
                    { "Delivered", "Votre commande a été livrée" },
                    { "Cancelled", "Votre commande a été annulée" }
                };

                var message = statusMessages.ContainsKey(newStatus)
                    ? statusMessages[newStatus]
                    : $"Statut de votre commande: {newStatus}";

                var notification = new Notification
                {
                    UserId = buyerId,  
                    Type = "ORDER_STATUS_CHANGED",
                    Message = $"{message} (Commande #{orderId})",
                    OrderId = orderId,
                    IsRead = false,
                    Link = $"/orders/{orderId}",
                    CreatedAt = DateTime.UtcNow
                };

                _context.Notifications.Add(notification);
                await _context.SaveChangesAsync();

                _logger.LogInformation($" Notification créée avec succès pour l'acheteur {buyerId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $" Erreur lors de la création de la notification ORDER_STATUS_CHANGED");
                throw;
            }
        }

        //  Récupérer les notifications d'un utilisateur
        public async Task<List<NotificationDto>> GetUserNotificationsAsync(int userId, bool unreadOnly = false)
        {
            var query = _context.Notifications
                .Include(n => n.RelatedUser)
                .Where(n => n.UserId == userId);

            if (unreadOnly)
            {
                query = query.Where(n => !n.IsRead);
            }

            var notifications = await query
                .OrderByDescending(n => n.CreatedAt)
                .Take(50)
                .ToListAsync();

            return notifications.Select(n => new NotificationDto
            {
                Id = n.Id,
                UserId = n.UserId,
                Type = n.Type,
                Message = n.Message,
                OrderId = n.OrderId,
                RelatedUserId = n.RelatedUserId,
                RelatedUserName = n.RelatedUser?.Username,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt,
                Link = n.Link
            }).ToList();
        }

        //  Compter les notifications non lues
        public async Task<int> GetUnreadCountAsync(int userId)
        {
            return await _context.Notifications
                .CountAsync(n => n.UserId == userId && !n.IsRead);
        }

        //  Marquer comme lue
        public async Task<NotificationDto> MarkAsReadAsync(int notificationId, int userId)
        {
            var notification = await _context.Notifications
                .Include(n => n.RelatedUser)
                .FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId);

            if (notification == null)
                throw new Exception("Notification introuvable");

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            return new NotificationDto
            {
                Id = notification.Id,
                UserId = notification.UserId,
                Type = notification.Type,
                Message = notification.Message,
                OrderId = notification.OrderId,
                RelatedUserId = notification.RelatedUserId,
                RelatedUserName = notification.RelatedUser?.Username,
                IsRead = notification.IsRead,
                CreatedAt = notification.CreatedAt,
                Link = notification.Link
            };
        }

        //  Marquer toutes comme lues
        public async Task MarkAllAsReadAsync(int userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToListAsync();

            foreach (var notification in notifications)
            {
                notification.IsRead = true;
            }

            await _context.SaveChangesAsync();
        }

        //  Supprimer une notification
        public async Task DeleteNotificationAsync(int notificationId, int userId)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId);

            if (notification == null)
                throw new Exception("Notification introuvable");

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();
        }
    }
}