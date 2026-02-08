using Microsoft.EntityFrameworkCore;
using shopstore.Data;
using shopstore.DTOs.Cart;
using shopstore.Models;

namespace shopstore.Services
{
    public class CartService : ICartService
    {
        private readonly AppDbContext _db;
        private readonly IHttpContextAccessor _httpContext;
        private readonly IAuthService _authService;

        public CartService(
            AppDbContext db,
            IHttpContextAccessor httpContext,
            IAuthService authService)
        {
            _db = db;
            _httpContext = httpContext;
            _authService = authService;
        }

        private async Task<User?> GetCurrentUser()
        {
            var token = _httpContext.HttpContext?.Request.Headers["Authorization"]
                .ToString()
                .Replace("Bearer ", "");

            if (string.IsNullOrEmpty(token))
                return null;

            return await _authService.GetUserByToken(token);
        }

        public async Task<List<CartItemDto>> GetCartAsync()
        {
            var user = await GetCurrentUser();
            if (user == null) return new List<CartItemDto>();

            var cartItems = await _db.CartItems
                .Include(c => c.Product)
                .Where(c => c.UserId == user.Id)
                .Select(c => new CartItemDto
                {
                    Id = c.Id,
                    ProductId = c.ProductId,
                    ProductName = c.Product.Name,
                    ProductPrice = c.Product.Price,
                    ProductImage = c.Product.ImageUrl,
                    Quantity = c.Quantity,
                    Subtotal = c.Product.Price * c.Quantity
                })
                .ToListAsync();

            return cartItems;
        }

        public async Task AddToCartAsync(AddToCartRequest request)
        {
            var user = await GetCurrentUser();
            if (user == null)
                throw new Exception("Utilisateur non connecté");

            var product = await _db.Products.FindAsync(request.ProductId);
            if (product == null)
                throw new Exception("Produit introuvable");

            if (product.UserId == user.Id)
                throw new Exception("Vous ne pouvez pas commander vos propres produits !");

            if (product.Stock < request.Quantity)
                throw new Exception("Stock insuffisant");

            // Vérifier si le produit est déjà dans le panier
            var existingItem = await _db.CartItems
                .FirstOrDefaultAsync(c => c.UserId == user.Id && c.ProductId == request.ProductId);

            if (existingItem != null)
            {
                // Vérifier le stock avant d'augmenter la quantité
                if (product.Stock < (existingItem.Quantity + request.Quantity))
                    throw new Exception("Stock insuffisant pour cette quantité");

                // Mettre à jour la quantité
                existingItem.Quantity += request.Quantity;
            }
            else
            {
                // Créer un nouvel élément
                var cartItem = new CartItem
                {
                    UserId = user.Id,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity
                };
                _db.CartItems.Add(cartItem);
            }

            await _db.SaveChangesAsync();
        }

        public async Task UpdateCartAsync(UpdateCartRequest request)
        {
            var user = await GetCurrentUser();
            if (user == null)
                throw new Exception("Utilisateur non connecté");

            var cartItem = await _db.CartItems
                .Include(c => c.Product)
                .FirstOrDefaultAsync(c => c.Id == request.CartItemId && c.UserId == user.Id);

            if (cartItem == null)
                throw new Exception("Élément du panier introuvable");

            if (cartItem.Product.Stock < request.Quantity)
                throw new Exception("Stock insuffisant");

            cartItem.Quantity = request.Quantity;
            await _db.SaveChangesAsync();
        }

        public async Task RemoveFromCartAsync(int productId)
        {
            var user = await GetCurrentUser();
            if (user == null)
                throw new Exception("Utilisateur non connecté");

            var cartItem = await _db.CartItems
                .FirstOrDefaultAsync(c => c.UserId == user.Id && c.ProductId == productId);

            if (cartItem != null)
            {
                _db.CartItems.Remove(cartItem);
                await _db.SaveChangesAsync();
            }
        }

        public async Task ClearCartAsync()
        {
            var user = await GetCurrentUser();
            if (user == null)
                throw new Exception("Utilisateur non connecté");

            var cartItems = await _db.CartItems
                .Where(c => c.UserId == user.Id)
                .ToListAsync();

            _db.CartItems.RemoveRange(cartItems);
            await _db.SaveChangesAsync();
        }
    }

    
}