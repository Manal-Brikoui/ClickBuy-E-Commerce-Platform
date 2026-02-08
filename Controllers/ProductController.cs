using Microsoft.AspNetCore.Mvc;
using shopstore.Models;
using shopstore.Services;
using System.ComponentModel.DataAnnotations;

namespace shopstore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _service;
        private readonly IAuthService _authService;
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<ProductController> _logger;

        public ProductController(
            IProductService service,
            IAuthService authService,
            IWebHostEnvironment env,
            ILogger<ProductController> logger)
        {
            _service = service;
            _authService = authService;
            _env = env;
            _logger = logger;
        }

     
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                _logger.LogInformation(" Récupération de tous les produits");
                var products = await _service.GetAllAsync();

                var enrichedProducts = products.Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.Stock,
                    p.Description,  
                    p.ImageUrl,
                    p.UserId,
                    UserName = p.User?.Username ?? "Utilisateur inconnu"
                }).ToList();

                _logger.LogInformation($" {enrichedProducts.Count} produits récupérés");
                return Ok(enrichedProducts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, " Erreur lors de la récupération des produits");
                return StatusCode(500, new { message = "Erreur serveur lors de la récupération des produits", error = ex.Message });
            }
        }

        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "ID invalide" });

                var product = await _service.GetByIdAsync(id);
                if (product == null)
                    return NotFound(new { message = $"Produit avec l'ID {id} introuvable" });

                var enrichedProduct = new
                {
                    product.Id,
                    product.Name,
                    product.Price,
                    product.Stock,
                    product.Description,  
                    product.ImageUrl,
                    product.UserId,
                    UserName = product.User?.Username ?? "Utilisateur inconnu"
                };

                return Ok(enrichedProduct);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $" Erreur lors de la récupération du produit {id}");
                return StatusCode(500, new { message = "Erreur serveur", error = ex.Message });
            }
        }

       
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ProductCreateDto dto)
        {
            try
            {
                _logger.LogInformation(" DÉBUT CRÉATION PRODUIT ");
                _logger.LogInformation($" Données reçues: Name={dto.Name}, Price={dto.Price}, Stock={dto.Stock}, Description={dto.Description?.Substring(0, Math.Min(50, dto.Description?.Length ?? 0))}...");

                //  Validation de l'utilisateur
                var user = await GetCurrentUser();
                if (user == null)
                {
                    _logger.LogWarning(" Utilisateur non authentifié");
                    return Unauthorized(new { message = "Vous devez être connecté pour ajouter un produit" });
                }

                _logger.LogInformation($" Utilisateur authentifié: ID={user.Id}, Username={user.Username}");

                //  Validation des données
                if (string.IsNullOrWhiteSpace(dto.Name))
                    return BadRequest(new { message = "Le nom du produit est requis" });

                if (dto.Name.Length > 200)
                    return BadRequest(new { message = "Le nom du produit ne doit pas dépasser 200 caractères" });

                if (dto.Price < 0)
                    return BadRequest(new { message = "Le prix ne peut pas être négatif" });

                if (dto.Price > 999999.99m)
                    return BadRequest(new { message = "Le prix ne peut pas dépasser 999,999.99" });

                if (dto.Stock < 0)
                    return BadRequest(new { message = "Le stock ne peut pas être négatif" });

                if (dto.Stock > 999999)
                    return BadRequest(new { message = "Le stock ne peut pas dépasser 999,999" });

                
                if (!string.IsNullOrWhiteSpace(dto.Description) && dto.Description.Length > 2000)
                    return BadRequest(new { message = "La description ne doit pas dépasser 2000 caractères" });

                //  Créer le produit
                var product = new Product
                {
                    Name = dto.Name.Trim(),
                    Price = dto.Price,
                    Stock = dto.Stock,
                    Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description.Trim(),  
                    UserId = user.Id
                };

                _logger.LogInformation($" Produit créé en mémoire: UserId={product.UserId}");

               
                if (dto.Image != null && dto.Image.Length > 0)
                {
                    try
                    {
                        var imageUrl = await SaveImage(dto.Image);
                        product.ImageUrl = imageUrl;
                        _logger.LogInformation($" Image sauvegardée: {imageUrl}");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, " Erreur lors de l'upload de l'image");
                        return BadRequest(new { message = $"Erreur lors de l'upload de l'image: {ex.Message}" });
                    }
                }

                //  Sauvegarder en base de données
                var created = await _service.AddAsync(product);
                _logger.LogInformation($" Produit créé avec succès: ID={created.Id}, Name={created.Name}, UserId={created.UserId}");
                _logger.LogInformation("FIN CRÉATION PRODUIT ");

                return CreatedAtAction(nameof(GetById), new { id = created.Id }, new
                {
                    message = "Produit ajouté avec succès",
                    product = created
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, " ERREUR CRÉATION PRODUIT ");
                _logger.LogError(ex, $" Message: {ex.Message}");
                _logger.LogError(ex, $" StackTrace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Erreur serveur lors de la création du produit", error = ex.Message });
            }
        }

        //  Méthode pour sauvegarder l'image
        private async Task<string> SaveImage(IFormFile image)
        {
            if (image == null || image.Length == 0)
                throw new ArgumentException("Fichier image invalide");

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var extension = Path.GetExtension(image.FileName).ToLowerInvariant();

            if (string.IsNullOrEmpty(extension) || !allowedExtensions.Contains(extension))
                throw new InvalidOperationException("Format d'image non supporté. Utilisez JPG, PNG, GIF ou WEBP.");

            if (image.Length > 5 * 1024 * 1024)
                throw new InvalidOperationException("L'image ne doit pas dépasser 5MB.");

            var allowedMimeTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
            if (!allowedMimeTypes.Contains(image.ContentType.ToLowerInvariant()))
                throw new InvalidOperationException("Type MIME invalide pour l'image.");

            var fileName = $"{Guid.NewGuid()}{extension}";
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "products");

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
                _logger.LogInformation($" Dossier créé: {uploadsFolder}");
            }

            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            return $"/uploads/products/{fileName}";
        }

      
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] ProductUpdateDto dto)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "ID invalide" });

                var user = await GetCurrentUser();
                if (user == null)
                    return Unauthorized(new { message = "Vous devez être connecté pour modifier un produit" });

                var existingProduct = await _service.GetByIdAsync(id);
                if (existingProduct == null)
                    return NotFound(new { message = $"Produit avec l'ID {id} introuvable" });

                //  Vérifier si l'utilisateur est le propriétaire du produit
                if (existingProduct.UserId != user.Id)
                    return Unauthorized(new { message = "Vous pouvez uniquement modifier vos propres produits" });

                //  Validation des données
                if (string.IsNullOrWhiteSpace(dto.Name))
                    return BadRequest(new { message = "Le nom du produit est requis" });

                if (dto.Name.Length > 200)
                    return BadRequest(new { message = "Le nom du produit ne doit pas dépasser 200 caractères" });

                if (dto.Price < 0)
                    return BadRequest(new { message = "Le prix ne peut pas être négatif" });

                if (dto.Price > 999999.99m)
                    return BadRequest(new { message = "Le prix ne peut pas dépasser 999,999.99" });

                if (dto.Stock < 0)
                    return BadRequest(new { message = "Le stock ne peut pas être négatif" });

                if (dto.Stock > 999999)
                    return BadRequest(new { message = "Le stock ne peut pas dépasser 999,999" });

                //  Validation de la description
                if (!string.IsNullOrWhiteSpace(dto.Description) && dto.Description.Length > 2000)
                    return BadRequest(new { message = "La description ne doit pas dépasser 2000 caractères" });

                existingProduct.Name = dto.Name.Trim();
                existingProduct.Price = dto.Price;
                existingProduct.Stock = dto.Stock;
                existingProduct.Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description.Trim();  //  Mise à jour de la description

                //  Mettre à jour l'image si une nouvelle est fournie
                if (dto.Image != null && dto.Image.Length > 0)
                {
                    try
                    {
                        if (!string.IsNullOrEmpty(existingProduct.ImageUrl))
                        {
                            DeleteImageFile(existingProduct.ImageUrl);
                        }

                        existingProduct.ImageUrl = await SaveImage(dto.Image);
                        _logger.LogInformation($" Image mise à jour: {existingProduct.ImageUrl}");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, " Erreur lors de l'upload de la nouvelle image");
                        return BadRequest(new { message = $"Erreur lors de l'upload de l'image: {ex.Message}" });
                    }
                }

                var updated = await _service.UpdateAsync(id, existingProduct);
                _logger.LogInformation($" Produit mis à jour: ID={id}");

                return Ok(new
                {
                    message = "Produit mis à jour avec succès",
                    product = updated
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $" Erreur lors de la mise à jour du produit {id}");
                return StatusCode(500, new { message = "Erreur serveur lors de la mise à jour", error = ex.Message });
            }
        }

      
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "ID invalide" });

                var user = await GetCurrentUser();
                if (user == null)
                    return Unauthorized(new { message = "Vous devez être connecté pour supprimer un produit" });

                var product = await _service.GetByIdAsync(id);
                if (product == null)
                    return NotFound(new { message = $"Produit avec l'ID {id} introuvable" });

                //  Vérifier si l'utilisateur est le propriétaire du produit
                if (product.UserId != user.Id)
                    return Unauthorized(new { message = "Vous pouvez uniquement supprimer vos propres produits" });

                if (!string.IsNullOrEmpty(product.ImageUrl))
                {
                    DeleteImageFile(product.ImageUrl);
                }

                var deleted = await _service.DeleteAsync(id);
                if (!deleted)
                    return NotFound(new { message = "Produit introuvable" });

                _logger.LogInformation($" Produit supprimé: ID={id}");

                return Ok(new { message = "Produit supprimé avec succès" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $" Erreur lors de la suppression du produit {id}");
                return StatusCode(500, new { message = "Erreur serveur lors de la suppression", error = ex.Message });
            }
        }

        private void DeleteImageFile(string imageUrl)
        {
            try
            {
                if (string.IsNullOrEmpty(imageUrl))
                    return;

                var fileName = Path.GetFileName(imageUrl);
                var imagePath = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "Uploads",
                    "products",
                    fileName
                );

                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                    _logger.LogInformation($" Image supprimée: {fileName}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, $" Impossible de supprimer l'image: {imageUrl}");
            }
        }

       
        private async Task<User?> GetCurrentUser()
        {
            try
            {
                var authHeader = Request.Headers["Authorization"].ToString();

                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    _logger.LogWarning(" Header Authorization manquant ou invalide");
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
                    _logger.LogWarning($" Aucun utilisateur trouvé pour le token");
                }
                else
                {
                    _logger.LogInformation($" Utilisateur trouvé: ID={user.Id}, Username={user.Username}");
                }

                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, " Erreur lors de la récupération de l'utilisateur");
                return null;
            }
        }

        [HttpGet("test-connection")]
        public IActionResult TestConnection()
        {
            try
            {
                return Ok(new
                {
                    message = " API  fonctionne correctement",
                    timestamp = DateTime.Now,
                    version = "1.0.0"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur serveur", error = ex.Message });
            }
        }
    }


    public class ProductCreateDto
    {
        [Required(ErrorMessage = "Le nom du produit est requis")]
        [StringLength(200, ErrorMessage = "Le nom ne doit pas dépasser 200 caractères")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le prix est requis")]
        [Range(0, 999999.99, ErrorMessage = "Le prix doit être entre 0 et 999,999.99")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Le stock est requis")]
        [Range(0, 999999, ErrorMessage = "Le stock doit être entre 0 et 999,999")]
        public int Stock { get; set; }

        [StringLength(2000, ErrorMessage = "La description ne doit pas dépasser 2000 caractères")]
        public string? Description { get; set; }  

        public IFormFile? Image { get; set; }
    }

    public class ProductUpdateDto
    {
        [Required(ErrorMessage = "Le nom du produit est requis")]
        [StringLength(200, ErrorMessage = "Le nom ne doit pas dépasser 200 caractères")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le prix est requis")]
        [Range(0, 999999.99, ErrorMessage = "Le prix doit être entre 0 et 999,999.99")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Le stock est requis")]
        [Range(0, 999999, ErrorMessage = "Le stock doit être entre 0 et 999,999")]
        public int Stock { get; set; }

        [StringLength(2000, ErrorMessage = "La description ne doit pas dépasser 2000 caractères")]
        public string? Description { get; set; }  

        public IFormFile? Image { get; set; }
    }
}