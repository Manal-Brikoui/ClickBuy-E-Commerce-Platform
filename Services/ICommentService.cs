using shopstore.DTOs.Comments;

namespace shopstore.Services
{
    public interface ICommentService
    {
        Task<CommentDto> CreateCommentAsync(CreateCommentRequest request, int userId);
        Task<List<CommentDto>> GetCommentsByProductIdAsync(int productId);
        Task<CommentDto?> GetCommentByIdAsync(int commentId);
        Task<CommentDto> UpdateCommentAsync(int commentId, UpdateCommentRequest request, int userId);
        Task<bool> DeleteCommentAsync(int commentId, int userId);
        Task<double> GetAverageRatingAsync(int productId);
        Task<int> GetCommentCountAsync(int productId);
    }
}
