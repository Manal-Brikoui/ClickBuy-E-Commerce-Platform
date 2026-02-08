using Microsoft.AspNetCore.Mvc;
using shopstore.DTOs.Orders;
using shopstore.Services;
using shopstore.DTOS.Orders;

namespace shopstore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IAuthService _authService;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(
            IOrderService orderService,
            IAuthService authService,
            ILogger<OrdersController> logger)
        {
            _orderService = orderService;
            _authService = authService;
            _logger = logger;
        }

        private async Task<Models.User?> GetCurrentUser()
        {
            try
            {
                var authHeader = Request.Headers["Authorization"].ToString();

                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                    return null;

                var token = authHeader.Replace("Bearer ", "").Trim();

                if (string.IsNullOrEmpty(token))
                    return null;

                return await _authService.GetUserByToken(token);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, " Erreur lors de la récupération de l'utilisateur");
                return null;
            }
        }

       
        [HttpPost("create")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
        {
            try
            {
                _logger.LogInformation(" CRÉATION DE COMMANDE ");
                _logger.LogInformation($" UserId (Acheteur): {request.UserId}");
                _logger.LogInformation($" Email: {request.Email}");
                _logger.LogInformation($" Phone: {request.Phone}");
                _logger.LogInformation($"Items: {request.Items?.Count ?? 0}");

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    _logger.LogWarning($" Validation échouée: {string.Join(", ", errors)}");
                    return BadRequest(new { message = "Données invalides", errors });
                }

                var order = await _orderService.CreateOrderAsync(request);

                _logger.LogInformation($" Commande créée avec succès - ID: {order.Id}");
                _logger.LogInformation($" Email: {order.Email}");
                _logger.LogInformation($" Phone: {order.Phone}");

                return Ok(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, " Erreur lors de la création de la commande");
                return BadRequest(new { message = ex.Message });
            }
        }

        
        [HttpGet]
        public async Task<IActionResult> GetMyOrders()
        {
            try
            {
                var user = await GetCurrentUser();
                if (user == null)
                {
                    _logger.LogWarning(" Utilisateur non authentifié");
                    return Unauthorized(new { message = "Vous devez être connecté" });
                }

                _logger.LogInformation($" Récupération des commandes PASSÉES par l'utilisateur {user.Id}");

                var orders = await _orderService.GetOrdersByUserIdAsync(user.Id);

                _logger.LogInformation($" {orders.Count} commande(s) récupérée(s) pour l'acheteur {user.Id}");

                // Vérifier que les commandes contiennent Email et Phone
                if (orders.Count > 0)
                {
                    var firstOrder = orders[0];
                    _logger.LogInformation($" Email présent: {!string.IsNullOrEmpty(firstOrder.Email)}");
                    _logger.LogInformation($" Phone présent: {!string.IsNullOrEmpty(firstOrder.Phone)}");
                }

                return Ok(orders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, " Erreur lors de la récupération des commandes");
                return BadRequest(new { message = ex.Message });
            }
        }

        
        [HttpGet("received")]
        public async Task<IActionResult> GetReceivedOrders()
        {
            try
            {
                var user = await GetCurrentUser();
                if (user == null)
                {
                    _logger.LogWarning(" Utilisateur non authentifié");
                    return Unauthorized(new { message = "Vous devez être connecté" });
                }

                _logger.LogInformation($" Récupération des commandes REÇUES pour les produits de l'utilisateur {user.Id}");

                var orders = await _orderService.GetOrdersForSellerAsync(user.Id);

                _logger.LogInformation($" {orders.Count} commande(s) reçue(s) pour le vendeur {user.Id}");

                // Vérifier que les commandes contiennent Email et Phone de l'acheteur
                if (orders.Count > 0)
                {
                    var firstOrder = orders[0];
                    _logger.LogInformation($" Email acheteur présent: {!string.IsNullOrEmpty(firstOrder.Email)}");
                    _logger.LogInformation($" Phone acheteur présent: {!string.IsNullOrEmpty(firstOrder.Phone)}");
                }

                return Ok(orders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, " Erreur lors de la récupération des commandes reçues");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            try
            {
                _logger.LogInformation($" Récupération de la commande ID: {id}");

                var order = await _orderService.GetOrderByIdAsync(id);

                if (order == null)
                {
                    _logger.LogWarning($" Commande {id} introuvable");
                    return NotFound(new { message = "Commande introuvable" });
                }

                _logger.LogInformation($" Commande {id} récupérée");
                _logger.LogInformation($" Email: {order.Email}");
                _logger.LogInformation($" Phone: {order.Phone}");

                return Ok(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $" Erreur lors de la récupération de la commande {id}");
                return BadRequest(new { message = ex.Message });
            }
        }

       
        [HttpPut("{orderId}/items/{itemId}")]
        public async Task<IActionResult> UpdateItemQuantity(
            int orderId,
            int itemId,
            [FromBody] UpdateQuantityRequest request)
        {
            try
            {
                _logger.LogInformation($" Mise à jour de la quantité - OrderId: {orderId}, ItemId: {itemId}, Quantity: {request.Quantity}");

                var order = await _orderService.UpdateItemQuantityAsync(orderId, itemId, request.Quantity);

                _logger.LogInformation($" Quantité mise à jour avec succès");

                return Ok(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $" Erreur lors de la mise à jour de la quantité");
                return BadRequest(new { message = ex.Message });
            }
        }

      
        [HttpDelete("{orderId}/items/{itemId}")]
        public async Task<IActionResult> DeleteItem(int orderId, int itemId)
        {
            try
            {
                _logger.LogInformation($" Suppression de l'item - OrderId: {orderId}, ItemId: {itemId}");

                var order = await _orderService.DeleteItemAsync(orderId, itemId);

                _logger.LogInformation($" Item supprimé avec succès");

                return Ok(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $" Erreur lors de la suppression de l'item");
                return BadRequest(new { message = ex.Message });
            }
        }

       
        [HttpPut("{orderId}/cancel")]
        public async Task<IActionResult> CancelOrder(int orderId)
        {
            try
            {
                _logger.LogInformation($" Annulation de la commande {orderId}");

                var order = await _orderService.CancelOrderAsync(orderId);

                _logger.LogInformation($" Commande {orderId} annulée avec succès");

                return Ok(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $" Erreur lors de l'annulation de la commande");
                return BadRequest(new { message = ex.Message });
            }
        }

     
        [HttpPut("{orderId}/status")]
        public async Task<IActionResult> UpdateOrderStatus(
            int orderId,
            [FromBody] UpdateOrderStatusRequest request)
        {
            try
            {
                var user = await GetCurrentUser();
                if (user == null)
                {
                    _logger.LogWarning($" Tentative de mise à jour du statut sans authentification");
                    return Unauthorized(new { message = "Vous devez être connecté pour modifier le statut d'une commande" });
                }

                _logger.LogInformation($" Mise à jour du statut de la commande {orderId} par l'utilisateur {user.Id}");
                _logger.LogInformation($" Nouveau statut: {request.Status}");

                var order = await _orderService.UpdateOrderStatusAsync(orderId, request.Status, user.Id);

                _logger.LogInformation($" Statut mis à jour avec succès");

                return Ok(order);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, $" Accès refusé pour la commande {orderId}");
                return StatusCode(403, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $" Erreur lors de la mise à jour du statut de la commande {orderId}");
                return BadRequest(new { message = ex.Message });
            }
        }

        
        [HttpPut("{orderId}/accept")]
        public async Task<IActionResult> AcceptOrder(int orderId)
        {
            try
            {
                var user = await GetCurrentUser();
                if (user == null)
                {
                    _logger.LogWarning(" Tentative d'acceptation sans authentification");
                    return Unauthorized(new { message = "Vous devez être connecté" });
                }

                _logger.LogInformation($" Acceptation de la commande {orderId} par l'utilisateur {user.Id}");

                var order = await _orderService.AcceptOrderAsync(orderId, user.Id);

                _logger.LogInformation($" Commande {orderId} acceptée avec succès");
                _logger.LogInformation($" Email acheteur: {order.Email}");
                _logger.LogInformation($" Phone acheteur: {order.Phone}");

                return Ok(order);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, $" Accès refusé pour accepter la commande {orderId}");
                return StatusCode(403, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $" Erreur lors de l'acceptation de la commande {orderId}");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{orderId}/reject")]
        public async Task<IActionResult> RejectOrder(int orderId)
        {
            try
            {
                var user = await GetCurrentUser();
                if (user == null)
                {
                    _logger.LogWarning(" Tentative de rejet sans authentification");
                    return Unauthorized(new { message = "Vous devez être connecté" });
                }

                _logger.LogInformation($" Rejet de la commande {orderId} par l'utilisateur {user.Id}");

                var order = await _orderService.RejectOrderAsync(orderId, user.Id);

                _logger.LogInformation($" Commande {orderId} rejetée avec succès");

                return Ok(order);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, $" Accès refusé pour rejeter la commande {orderId}");
                return StatusCode(403, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $" Erreur lors du rejet de la commande {orderId}");
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}