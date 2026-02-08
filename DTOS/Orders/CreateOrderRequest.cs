using System.ComponentModel.DataAnnotations;

namespace shopstore.DTOs.Orders
{
    public class CreateOrderRequest
    {
        [Required(ErrorMessage = "L'utilisateur est requis")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "L'email est requis")]
        [EmailAddress(ErrorMessage = "Format d'email invalide")]
        [StringLength(100, ErrorMessage = "L'email ne doit pas dépasser 100 caractères")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le téléphone est requis")]
        [Phone(ErrorMessage = "Format de téléphone invalide")]
        [StringLength(20, ErrorMessage = "Le téléphone ne doit pas dépasser 20 caractères")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "La commande doit contenir au moins un article")]
        public List<OrderItemRequest> Items { get; set; } = new();
    }

    public class OrderItemRequest
    {
        [Required(ErrorMessage = "L'ID du produit est requis")]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "La quantité est requise")]
        [Range(1, 999, ErrorMessage = "La quantité doit être entre 1 et 999")]
        public int Quantity { get; set; }
    }
}