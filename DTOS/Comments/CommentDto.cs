namespace shopstore.DTOs.Comments
{
    public class CommentDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public int? Rating { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Informations utilisateur
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;

        // Informations produit
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
    }

    public class CreateCommentRequest
    {
        public string Content { get; set; } = string.Empty;
        public int? Rating { get; set; }
        public int ProductId { get; set; }
    }

    public class UpdateCommentRequest
    {
        public string Content { get; set; } = string.Empty;
        public int? Rating { get; set; }
    }
}
