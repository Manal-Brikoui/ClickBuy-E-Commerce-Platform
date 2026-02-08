using Microsoft.EntityFrameworkCore;
using shopstore.Data;
using shopstore.DTOs.Orders;
using shopstore.DTOS.Orders;
using shopstore.Models;

namespace shopstore.Services
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;
        private static readonly List<OrderResponse> _orders = new();
        private static int _nextOrderId = 1;
        private static int _nextItemId = 1;

        public OrderService(AppDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        public async Task<OrderResponse> CreateOrderAsync(CreateOrderRequest request)
        {
            Console.WriteLine(" CREATE ORDER SERVICE");
            Console.WriteLine($" ACHETEUR (UserId): {request.UserId}");
            Console.WriteLine($" Email: {request.Email}");
            Console.WriteLine($" Phone: {request.Phone}");
            Console.WriteLine($"Items count: {request.Items?.Count ?? 0}");

            if (request.Items == null || !request.Items.Any())
                throw new Exception("La commande doit contenir au moins un article");

            //  Validation des informations de contact
            if (string.IsNullOrWhiteSpace(request.Email))
                throw new Exception("L'email est requis");

            if (string.IsNullOrWhiteSpace(request.Phone))
                throw new Exception("Le téléphone est requis");

            decimal total = 0;
            var items = new List<OrderItemDetailResponse>();
            var sellerIds = new HashSet<int>();

            foreach (var item in request.Items)
            {
                Console.WriteLine($"\n Processing item - ProductId: {item.ProductId}, Quantity: {item.Quantity}");

                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null)
                {
                    Console.WriteLine($" Product {item.ProductId} not found");
                    throw new Exception($"Produit {item.ProductId} introuvable");
                }

                Console.WriteLine($" VENDEUR du produit '{product.Name}': UserId = {product.UserId}");

                //  Vérifier que l'utilisateur n'achète pas son propre produit
                if (product.UserId == request.UserId)
                {
                    throw new Exception($"Vous ne pouvez pas acheter votre propre produit: {product.Name}");
                }

                if (product.Stock < item.Quantity)
                {
                    Console.WriteLine($" Insufficient stock for {product.Name}");
                    throw new Exception($"Stock insuffisant pour {product.Name}. Disponible: {product.Stock}");
                }

                decimal itemTotal = product.Price * item.Quantity;
                total += itemTotal;

                Console.WriteLine($" Item added:");
                Console.WriteLine($"   Name: {product.Name}");
                Console.WriteLine($"    Unit Price: {product.Price} DH");
                Console.WriteLine($"    Quantity: {item.Quantity}");
                Console.WriteLine($"    Item Total: {itemTotal} DH");

                if (product.UserId.HasValue)
                {
                    sellerIds.Add(product.UserId.Value);
                    Console.WriteLine($" Vendeur {product.UserId.Value} ajouté à la liste des vendeurs");
                }

                items.Add(new OrderItemDetailResponse
                {
                    Id = _nextItemId++,
                    ProductId = product.Id,
                    ProductName = product.Name,
                    Price = product.Price,
                    Quantity = item.Quantity,
                    Product = new ProductInfo
                    {
                        Id = product.Id,
                        Name = product.Name,
                        ImageUrl = product.ImageUrl,
                        UserId = product.UserId
                    }
                });

                product.Stock -= item.Quantity;
                _context.Products.Update(product);
                Console.WriteLine($"    Stock mis à jour: {product.Stock + item.Quantity} → {product.Stock}");
            }

            var order = new OrderResponse
            {
                Id = _nextOrderId++,
                UserId = request.UserId,  
                Email = request.Email,    
                Phone = request.Phone,   
                OrderDate = DateTime.UtcNow,
                Status = "Pending",
                TotalAmount = total,
                Items = items
            };

            _orders.Add(order);

            Console.WriteLine($"\n COMMANDE CRÉÉE ⭐⭐⭐");
            Console.WriteLine($"    Commande ID: {order.Id}");
            Console.WriteLine($"    ACHETEUR (UserId): {order.UserId}");
            Console.WriteLine($"    Email: {order.Email}");
            Console.WriteLine($"    Phone: {order.Phone}");
            Console.WriteLine($"    Total: {order.TotalAmount} DH");
            Console.WriteLine($"     VENDEURS concernés: [{string.Join(", ", sellerIds)}]");

            await _context.SaveChangesAsync();

            foreach (var sellerId in sellerIds)
            {
                try
                {
                    await _notificationService.CreateOrderReceivedNotificationAsync(
                        order.Id,
                        request.UserId,  
                        sellerId        
                    );
                    Console.WriteLine($" Notification envoyée au VENDEUR {sellerId} pour la commande de l'ACHETEUR {request.UserId}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($" Erreur lors de la création de la notification pour le vendeur {sellerId}: {ex.Message}");
                }
            }

            Console.WriteLine("\n");

            return order;
        }

        // ✅ RÉCUPÉRER UNE COMMANDE PAR ID
        public async Task<OrderResponse?> GetOrderByIdAsync(int orderId)
        {
            Console.WriteLine($"\n GET ORDER BY ID: {orderId} ");

            var order = _orders.FirstOrDefault(o => o.Id == orderId);

            if (order == null)
            {
                Console.WriteLine(" Order not found");
            }
            else
            {
                Console.WriteLine($" Order found:");
                Console.WriteLine($"    Status: {order.Status}");
                Console.WriteLine($"    Email: {order.Email}");
                Console.WriteLine($"    Phone: {order.Phone}");
                Console.WriteLine($"    Total: {order.TotalAmount} DH");
                Console.WriteLine($"    Items: {order.Items.Count}");
            }

            Console.WriteLine("\n");

            return await Task.FromResult(order);
        }

        public async Task<List<OrderResponse>> GetOrdersByUserIdAsync(int userId)
        {
            Console.WriteLine($"\n");
            Console.WriteLine($" GET ORDERS BY USER ID (ACHETEUR)");
           
            Console.WriteLine($" UserId de l'ACHETEUR recherché: {userId}");
            Console.WriteLine($" Total commandes dans le système: {_orders.Count}");
            Console.WriteLine($" LISTE DE TOUTES LES COMMANDES ");

            foreach (var order in _orders)
            {
                Console.WriteLine($"Commande #{order.Id}:");
                Console.WriteLine($"   UserId (Acheteur): {order.UserId}");
                Console.WriteLine($"   Email: {order.Email}");
                Console.WriteLine($"   Phone: {order.Phone}");
                Console.WriteLine($"   Statut: {order.Status}");
                Console.WriteLine($"   Items: {order.Items.Count}");

                foreach (var item in order.Items)
                {
                    Console.WriteLine($"     {item.ProductName} (Vendeur: {item.Product?.UserId})");
                }
            }

            Console.WriteLine($"\n FILTRAGE ");
            var userOrders = _orders.Where(o => o.UserId == userId).ToList();

            Console.WriteLine($" Commandes trouvées pour l'ACHETEUR {userId}: {userOrders.Count}");

            if (userOrders.Count > 0)
            {
                Console.WriteLine($"\n RÉSULTAT DU FILTRE ");
                foreach (var order in userOrders)
                {
                    Console.WriteLine($"Commande #{order.Id} - UserId: {order.UserId} - Email: {order.Email} - Total: {order.TotalAmount} DH");
                }
            }
            else
            {
                Console.WriteLine($" AUCUNE commande trouvée pour l'utilisateur {userId}");
                Console.WriteLine($" Cet utilisateur n'a PAS ENCORE ACHETÉ de produits");
            }

          

            return await Task.FromResult(userOrders);
        }


        public async Task<List<OrderResponse>> GetOrdersForSellerAsync(int sellerId)
        {
           
            Console.WriteLine($" GET ORDERS FOR SELLER (VENDEUR)");
            Console.WriteLine($" UserId du VENDEUR recherché: {sellerId}");
            Console.WriteLine($" Total commandes dans le système: {_orders.Count}");
            Console.WriteLine($" LISTE DE TOUTES LES COMMANDES ");

            foreach (var order in _orders)
            {
                Console.WriteLine($"Commande #{order.Id}:");
                Console.WriteLine($"   UserId (Acheteur): {order.UserId}");
                Console.WriteLine($"   Email: {order.Email}");
                Console.WriteLine($"   Phone: {order.Phone}");
                Console.WriteLine($"   Statut: {order.Status}");
                Console.WriteLine($"   Items:");

                foreach (var item in order.Items)
                {
                    var isMyProduct = item.Product?.UserId == sellerId;
                    Console.WriteLine($" {item.ProductName} - Vendeur: {item.Product?.UserId} {(isMyProduct ? " MON PRODUIT" : "")}");
                }
            }

            Console.WriteLine($"\n FILTRAGE ");
            var sellerOrders = _orders
                .Where(o => o.Items.Any(i => i.Product?.UserId == sellerId))
                .ToList();

            Console.WriteLine($" Commandes trouvées pour le VENDEUR {sellerId}: {sellerOrders.Count}");

            if (sellerOrders.Count > 0)
            {
                Console.WriteLine($"\n RÉSULTAT DU FILTRE ");
                foreach (var order in sellerOrders)
                {
                    Console.WriteLine($"Commande #{order.Id} - Acheteur: {order.UserId} - Email: {order.Email} - Total: {order.TotalAmount} DH");
                }
            }
            else
            {
                Console.WriteLine($" AUCUNE commande trouvée pour le vendeur {sellerId}");
                Console.WriteLine($" Personne n'a encore acheté les produits de ce vendeur");
            }

   

            return await Task.FromResult(sellerOrders);
        }

        public async Task<List<OrderResponse>> GetAllOrdersAsync()
        {
            Console.WriteLine("\n GET ALL ORDERS ");
            Console.WriteLine($"Total orders: {_orders.Count}");

            var ordersList = _orders.ToList();

            foreach (var order in ordersList)
            {
                Console.WriteLine($"\nOrder #{order.Id}:");
                Console.WriteLine($"    Acheteur UserId: {order.UserId}");
                Console.WriteLine($"    Email: {order.Email}");
                Console.WriteLine($"    Phone: {order.Phone}");
                Console.WriteLine($"    Status: {order.Status}");
                Console.WriteLine($"    Total: {order.TotalAmount} DH");
                Console.WriteLine($"    Items: {order.Items.Count}");

                foreach (var item in order.Items)
                {
                    Console.WriteLine($"  {item.ProductName} - {item.Quantity} × {item.Price} DH = {item.Price * item.Quantity} DH");
                    Console.WriteLine($"  Vendeur: {item.Product?.UserId}");
                }
            }

       

            return await Task.FromResult(ordersList);
        }

     
        public async Task<OrderResponse> UpdateItemQuantityAsync(int orderId, int itemId, int quantity)
        {
            Console.WriteLine($"\n UPDATE ITEM QUANTITY ");
            Console.WriteLine($"OrderId: {orderId}, ItemId: {itemId}, New Quantity: {quantity}");

            if (quantity < 1)
                throw new Exception("La quantité doit être au moins 1");

            var order = _orders.FirstOrDefault(o => o.Id == orderId);
            if (order == null)
                throw new Exception("Commande introuvable");

            if (order.Status != "Pending")
                throw new Exception("Impossible de modifier une commande qui n'est pas en attente");

            var item = order.Items.FirstOrDefault(i => i.Id == itemId);
            if (item == null)
                throw new Exception("Article introuvable dans la commande");

            var product = await _context.Products.FindAsync(item.ProductId);
            if (product == null)
                throw new Exception("Produit introuvable");

            if (product.Stock < quantity)
                throw new Exception($"Stock insuffisant. Stock disponible: {product.Stock}");

            var oldQuantity = item.Quantity;
            item.Quantity = quantity;

            order.TotalAmount = order.Items.Sum(i => i.Price * i.Quantity);

            Console.WriteLine($" Quantity updated:");
            Console.WriteLine($"    Old: {oldQuantity}");
            Console.WriteLine($"    New: {quantity}");
            Console.WriteLine($"    New Total: {order.TotalAmount} DH");
        

            return await Task.FromResult(order);
        }


        public async Task<OrderResponse> DeleteItemAsync(int orderId, int itemId)
        {
            Console.WriteLine($"\n DELETE ITEM ");
            Console.WriteLine($"OrderId: {orderId}, ItemId: {itemId}");

            var order = _orders.FirstOrDefault(o => o.Id == orderId);
            if (order == null)
                throw new Exception("Commande introuvable");

            if (order.Status != "Pending")
                throw new Exception("Impossible de modifier une commande qui n'est pas en attente");

            var item = order.Items.FirstOrDefault(i => i.Id == itemId);
            if (item == null)
                throw new Exception("Article introuvable dans la commande");

            var product = await _context.Products.FindAsync(item.ProductId);
            if (product != null)
            {
                product.Stock += item.Quantity;
                _context.Products.Update(product);
                await _context.SaveChangesAsync();
                Console.WriteLine($"   -Stock remis: {item.Quantity} unités");
            }

            order.Items.Remove(item);

            if (!order.Items.Any())
            {
                _orders.Remove(order);
                Console.WriteLine(" Last item removed - Order deleted");
            
                return await Task.FromResult(order);
            }

            order.TotalAmount = order.Items.Sum(i => i.Price * i.Quantity);

            Console.WriteLine($" Item deleted:");
            Console.WriteLine($"    Remaining items: {order.Items.Count}");
            Console.WriteLine($"   New Total: {order.TotalAmount} DH");
          

            return await Task.FromResult(order);
        }

  
        public async Task<OrderResponse> CancelOrderAsync(int orderId)
        {
            Console.WriteLine($"\n CANCEL ORDER: {orderId} ");

            var order = _orders.FirstOrDefault(o => o.Id == orderId);
            if (order == null)
                throw new Exception("Commande introuvable");

            if (order.Status == "Cancelled")
                throw new Exception("La commande est déjà annulée");

            if (order.Status == "Delivered")
                throw new Exception("Impossible d'annuler une commande déjà livrée");

            foreach (var item in order.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product != null)
                {
                    product.Stock += item.Quantity;
                    _context.Products.Update(product);
                    Console.WriteLine($"    Stock remis pour {item.ProductName}: {item.Quantity} unités");
                }
            }

            await _context.SaveChangesAsync();

            order.Status = "Cancelled";

            Console.WriteLine($" Order cancelled");
          

            return await Task.FromResult(order);
        }

      
        public async Task<OrderResponse> UpdateOrderStatusAsync(int orderId, string newStatus, int currentUserId)
        {
            Console.WriteLine($"\nUPDATE ORDER STATUS ");
            Console.WriteLine($"OrderId: {orderId}, New Status: {newStatus}, UserId: {currentUserId}");

            var order = _orders.FirstOrDefault(o => o.Id == orderId);
            if (order == null)
                throw new Exception("Commande introuvable");

            bool isSeller = order.Items.Any(item => item.Product?.UserId == currentUserId);

            if (!isSeller)
            {
                Console.WriteLine($" L'utilisateur {currentUserId} n'est pas le vendeur de la commande {orderId}");
                throw new UnauthorizedAccessException("Seul le vendeur peut modifier le statut de la commande");
            }

            var validStatuses = new[] { "Pending", "Processing", "Shipped", "Delivered", "Cancelled" };
            if (!validStatuses.Contains(newStatus))
            {
                throw new Exception($"Statut invalide. Statuts autorisés: {string.Join(", ", validStatuses)}");
            }

            var oldStatus = order.Status;
            order.Status = newStatus;

            try
            {
                await _notificationService.CreateOrderStatusChangedNotificationAsync(
                    orderId,
                    order.UserId,
                    newStatus
                );
                Console.WriteLine($" Notification envoyée à l'acheteur {order.UserId}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($" Erreur lors de la création de la notification: {ex.Message}");
            }

            Console.WriteLine($" Status updated:");
            Console.WriteLine($"   Old: {oldStatus}");
            Console.WriteLine($"    New: {newStatus}");
  

            return await Task.FromResult(order);
        }

        public async Task<OrderResponse> AcceptOrderAsync(int orderId, int sellerId)
        {
            Console.WriteLine($"\n ACCEPT ORDER ");
            Console.WriteLine($"OrderId: {orderId}, SellerId: {sellerId}");

            var order = _orders.FirstOrDefault(o => o.Id == orderId);
            if (order == null)
                throw new Exception("Commande introuvable");

            bool isSeller = order.Items.Any(item => item.Product?.UserId == sellerId);
            if (!isSeller)
            {
                Console.WriteLine($" L'utilisateur {sellerId} n'est pas le vendeur de la commande {orderId}");
                throw new UnauthorizedAccessException("Seul le vendeur peut accepter cette commande");
            }

            if (order.Status != "Pending")
                throw new Exception("Seules les commandes en attente peuvent être acceptées");

            order.Status = "Processing";

            try
            {
                await _notificationService.CreateOrderStatusChangedNotificationAsync(
                    orderId,
                    order.UserId,
                    "Processing"
                );
                Console.WriteLine($" Notification 'Commande acceptée' envoyée à l'acheteur {order.UserId}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($" Erreur lors de la création de la notification: {ex.Message}");
            }

            Console.WriteLine($" Order accepted - Status: Pending to Processing");
          

            return await Task.FromResult(order);
        }

    
        public async Task<OrderResponse> RejectOrderAsync(int orderId, int sellerId)
        {
            Console.WriteLine($"\n REJECT ORDER ");
            Console.WriteLine($"OrderId: {orderId}, SellerId: {sellerId}");

            var order = _orders.FirstOrDefault(o => o.Id == orderId);
            if (order == null)
                throw new Exception("Commande introuvable");

            bool isSeller = order.Items.Any(item => item.Product?.UserId == sellerId);
            if (!isSeller)
            {
                Console.WriteLine($" L'utilisateur {sellerId} n'est pas le vendeur de la commande {orderId}");
                throw new UnauthorizedAccessException("Seul le vendeur peut rejeter cette commande");
            }

            if (order.Status != "Pending")
                throw new Exception("Seules les commandes en attente peuvent être rejetées");

            foreach (var item in order.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product != null)
                {
                    product.Stock += item.Quantity;
                    _context.Products.Update(product);
                    Console.WriteLine($"    Stock remis pour {item.ProductName}: {item.Quantity} unités");
                }
            }

            await _context.SaveChangesAsync();

            order.Status = "Cancelled";

            try
            {
                await _notificationService.CreateOrderStatusChangedNotificationAsync(
                    orderId,
                    order.UserId,
                    "Cancelled"
                );
                Console.WriteLine($" Notification 'Commande rejetée' envoyée à l'acheteur {order.UserId}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($" Erreur lors de la création de la notification: {ex.Message}");
            }

            Console.WriteLine($" Order rejected - Status: Pending to Cancelled");
            Console.WriteLine($" Stock remis pour tous les items");
        

            return await Task.FromResult(order);
        }
    }
}