using Microsoft.AspNetCore.Mvc;
using shopstore.Services;
using shopstore.DTOs.Comments;

namespace shopstore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentService _commentService;
        private readonly IAuthService _authService;
        private readonly ILogger<CommentsController> _logger;

        public CommentsController(
            ICommentService commentService,
            IAuthService authService,
            ILogger<CommentsController> logger)
        {
            _commentService = commentService;
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

        // POST: api/comments
        [HttpPost]
        public async Task<IActionResult> CreateComment([FromBody] CreateCommentRequest request)
        {
            try
            {
                var user = await GetCurrentUser();
                if (user == null)
                    return Unauthorized(new { message = "Vous devez être connecté pour commenter" });

                var comment = await _commentService.CreateCommentAsync(request, user.Id);
                return Ok(comment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, " Erreur lors de la création du commentaire");
                return BadRequest(new { message = ex.Message });
            }
        }

    
        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetCommentsByProduct(int productId)
        {
            try
            {
                var comments = await _commentService.GetCommentsByProductIdAsync(productId);
                return Ok(comments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $" Erreur lors de la récupération des commentaires du produit {productId}");
                return BadRequest(new { message = ex.Message });
            }
        }

    
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCommentById(int id)
        {
            try
            {
                var comment = await _commentService.GetCommentByIdAsync(id);
                if (comment == null)
                    return NotFound(new { message = "Commentaire introuvable" });

                return Ok(comment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $" Erreur lors de la récupération du commentaire {id}");
                return BadRequest(new { message = ex.Message });
            }
        }

        // PUT: api/comments/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(int id, [FromBody] UpdateCommentRequest request)
        {
            try
            {
                var user = await GetCurrentUser();
                if (user == null)
                    return Unauthorized(new { message = "Vous devez être connecté" });

                var comment = await _commentService.UpdateCommentAsync(id, request, user.Id);
                return Ok(comment);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $" Erreur lors de la mise à jour du commentaire {id}");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            try
            {
                var user = await GetCurrentUser();
                if (user == null)
                    return Unauthorized(new { message = "Vous devez être connecté" });

                await _commentService.DeleteCommentAsync(id, user.Id);
                return Ok(new { message = "Commentaire supprimé avec succès" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $" Erreur lors de la suppression du commentaire {id}");
                return BadRequest(new { message = ex.Message });
            }
        }

       
        [HttpGet("product/{productId}/stats")]
        public async Task<IActionResult> GetProductStats(int productId)
        {
            try
            {
                var averageRating = await _commentService.GetAverageRatingAsync(productId);
                var commentCount = await _commentService.GetCommentCountAsync(productId);

                return Ok(new
                {
                    averageRating,
                    commentCount
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $" Erreur lors de la récupération des stats du produit {productId}");
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}