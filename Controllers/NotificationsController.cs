using Microsoft.AspNetCore.Mvc;
using shopstore.DTOS.Notifications;
using shopstore.Services;

namespace shopstore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
   
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        private readonly IAuthService _authService;
        private readonly ILogger<NotificationsController> _logger;

        public NotificationsController(
            INotificationService notificationService,
            IAuthService authService,
            ILogger<NotificationsController> logger)
        {
            _notificationService = notificationService;
            _authService = authService;
            _logger = logger;
        }

        private async Task<Models.User?> GetCurrentUser()
        {
            try
            {
                var authHeader = Request.Headers["Authorization"].ToString();

                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    _logger.LogWarning(" En-tête Authorization manquant ou invalide");
                    return null;
                }

                var token = authHeader.Replace("Bearer ", "").Trim();

                if (string.IsNullOrEmpty(token))
                {
                    _logger.LogWarning(" Token vide");
                    return null;
                }

                var user = await _authService.GetUserByToken(token);

                if (user == null)
                {
                    _logger.LogWarning($" Utilisateur non trouvé pour le token: {token.Substring(0, Math.Min(8, token.Length))}...");
                }

                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, " Erreur lors de la récupération de l'utilisateur");
                return null;
            }
        }

        // GET: api/notifications
        [HttpGet]
        public async Task<IActionResult> GetNotifications([FromQuery] bool unreadOnly = false)
        {
            try
            {
                var user = await GetCurrentUser();
                if (user == null)
                    return Unauthorized(new { message = "Vous devez être connecté pour voir vos notifications" });

                _logger.LogInformation($" Récupération des notifications pour l'utilisateur {user.Id}");

                var notifications = await _notificationService.GetUserNotificationsAsync(user.Id, unreadOnly);
                return Ok(notifications);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, " Erreur lors de la récupération des notifications");
                return BadRequest(new { message = ex.Message });
            }
        }

      
        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            try
            {
                var user = await GetCurrentUser();
                if (user == null)
                {
                    _logger.LogWarning(" Tentative d'accès au compteur sans authentification");
                    return Unauthorized(new { message = "Vous devez être connecté" });
                }

                _logger.LogInformation($" Récupération du compteur de notifications pour l'utilisateur {user.Id}");

                var count = await _notificationService.GetUnreadCountAsync(user.Id);

                _logger.LogInformation($" Compteur récupéré: {count} notifications non lues");

                return Ok(new { count });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, " Erreur lors de la récupération du compteur");
                return StatusCode(500, new { message = "Erreur serveur", error = ex.Message });
            }
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            try
            {
                var user = await GetCurrentUser();
                if (user == null)
                    return Unauthorized(new { message = "Vous devez être connecté" });

                _logger.LogInformation($" Marquage de la notification {id} comme lue pour l'utilisateur {user.Id}");

                var notification = await _notificationService.MarkAsReadAsync(id, user.Id);
                return Ok(notification);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $" Erreur lors du marquage de la notification {id}");
                return BadRequest(new { message = ex.Message });
            }
        }

  
        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            try
            {
                var user = await GetCurrentUser();
                if (user == null)
                    return Unauthorized(new { message = "Vous devez être connecté" });

                _logger.LogInformation($" Marquage de toutes les notifications comme lues pour l'utilisateur {user.Id}");

                await _notificationService.MarkAllAsReadAsync(user.Id);
                return Ok(new { message = "Toutes les notifications ont été marquées comme lues" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, " Erreur lors du marquage global");
                return BadRequest(new { message = ex.Message });
            }
        }

      
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            try
            {
                var user = await GetCurrentUser();
                if (user == null)
                    return Unauthorized(new { message = "Vous devez être connecté" });

                _logger.LogInformation($" Suppression de la notification {id} pour l'utilisateur {user.Id}");

                await _notificationService.DeleteNotificationAsync(id, user.Id);
                return Ok(new { message = "Notification supprimée" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $" Erreur lors de la suppression de la notification {id}");
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}