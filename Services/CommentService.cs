using Microsoft.EntityFrameworkCore;
using shopstore.Data;
using shopstore.Models;
using shopstore.DTOs.Comments;

namespace shopstore.Services
{
    public class CommentService : ICommentService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<CommentService> _logger;

        public CommentService(AppDbContext context, ILogger<CommentService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<CommentDto> CreateCommentAsync(CreateCommentRequest request, int userId)
        {
            _logger.LogInformation($" Création d'un commentaire pour le produit {request.ProductId} par l'utilisateur {userId}");

            // Vérifier que le produit existe
            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null)
            {
                throw new Exception("Produit introuvable");
            }

            // Vérifier que l'utilisateur existe
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new Exception("Utilisateur introuvable");
            }

            // Créer le commentaire
            var comment = new Comment
            {
                Content = request.Content,
                Rating = request.Rating,
                ProductId = request.ProductId,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            _logger.LogInformation($" Commentaire {comment.Id} créé avec succès");

            return await GetCommentDtoAsync(comment.Id);
        }

        public async Task<List<CommentDto>> GetCommentsByProductIdAsync(int productId)
        {
            _logger.LogInformation($"📖 Récupération des commentaires du produit {productId}");

            var comments = await _context.Comments
                .Include(c => c.User)
                .Include(c => c.Product)
                .Where(c => c.ProductId == productId)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new CommentDto
                {
                    Id = c.Id,
                    Content = c.Content,
                    Rating = c.Rating,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                    UserId = c.UserId,
                    UserName = c.User.Username,
                    ProductId = c.ProductId,
                    ProductName = c.Product.Name
                })
                .ToListAsync();

            _logger.LogInformation($" {comments.Count} commentaire(s) récupéré(s)");

            return comments;
        }

        public async Task<CommentDto?> GetCommentByIdAsync(int commentId)
        {
            return await GetCommentDtoAsync(commentId);
        }

        public async Task<CommentDto> UpdateCommentAsync(int commentId, UpdateCommentRequest request, int userId)
        {
            _logger.LogInformation($" Mise à jour du commentaire {commentId} par l'utilisateur {userId}");

            var comment = await _context.Comments.FindAsync(commentId);
            if (comment == null)
            {
                throw new Exception("Commentaire introuvable");
            }

            // Vérifier que l'utilisateur est l'auteur du commentaire
            if (comment.UserId != userId)
            {
                throw new UnauthorizedAccessException("Vous ne pouvez modifier que vos propres commentaires");
            }

            comment.Content = request.Content;
            comment.Rating = request.Rating;
            comment.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation($" Commentaire {commentId} mis à jour avec succès");

            return await GetCommentDtoAsync(commentId);
        }

        public async Task<bool> DeleteCommentAsync(int commentId, int userId)
        {
            _logger.LogInformation($" Suppression du commentaire {commentId} par l'utilisateur {userId}");

            var comment = await _context.Comments.FindAsync(commentId);
            if (comment == null)
            {
                throw new Exception("Commentaire introuvable");
            }

            // Vérifier que l'utilisateur est l'auteur du commentaire
            if (comment.UserId != userId)
            {
                throw new UnauthorizedAccessException("Vous ne pouvez supprimer que vos propres commentaires");
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            _logger.LogInformation($" Commentaire {commentId} supprimé avec succès");

            return true;
        }

        public async Task<double> GetAverageRatingAsync(int productId)
        {
            var ratings = await _context.Comments
                .Where(c => c.ProductId == productId && c.Rating.HasValue)
                .Select(c => c.Rating!.Value)
                .ToListAsync();

            if (!ratings.Any())
                return 0;

            return Math.Round(ratings.Average(), 1);
        }

        public async Task<int> GetCommentCountAsync(int productId)
        {
            return await _context.Comments
                .CountAsync(c => c.ProductId == productId);
        }

        private async Task<CommentDto> GetCommentDtoAsync(int commentId)
        {
            var comment = await _context.Comments
                .Include(c => c.User)
                .Include(c => c.Product)
                .FirstOrDefaultAsync(c => c.Id == commentId);

            if (comment == null)
            {
                throw new Exception("Commentaire introuvable");
            }

            return new CommentDto
            {
                Id = comment.Id,
                Content = comment.Content,
                Rating = comment.Rating,
                CreatedAt = comment.CreatedAt,
                UpdatedAt = comment.UpdatedAt,
                UserId = comment.UserId,
                UserName = comment.User.Username,
                ProductId = comment.ProductId,
                ProductName = comment.Product.Name
            };
        }
    }
}