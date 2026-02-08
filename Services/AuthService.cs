using Microsoft.EntityFrameworkCore;
using shopstore.Data;
using shopstore.DTOs.Auth;
using shopstore.Models;
using shopstore.Utils;

namespace shopstore.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;

        public AuthService(AppDbContext context)
        {
            _context = context;
        }

      
        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            // Vérifier si le username existe déjà
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
                throw new Exception("Username already exists");

            // Créer le nouvel utilisateur
            var user = new User
            {
                Username = request.Username,
                PasswordHash = PasswordHasher.HashPassword(request.Password),
                
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Générer un token unique
            user.Token = Guid.NewGuid().ToString();
            await _context.SaveChangesAsync();

            return new AuthResponse
            {
                UserId = user.Id,
                Username = user.Username,
                Token = user.Token
              
            };
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            // Rechercher l'utilisateur par username
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            // Vérifier les identifiants
            if (user == null || !PasswordHasher.VerifyPassword(request.Password, user.PasswordHash))
                throw new Exception("Invalid credentials");

            // Générer un nouveau token
            user.Token = Guid.NewGuid().ToString();
            await _context.SaveChangesAsync();

            return new AuthResponse
            {
                UserId = user.Id,
                Username = user.Username,
                Token = user.Token
               
            };
        }

        public async Task<User?> GetUserByToken(string token)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Token == token);
        }

        public async Task UpdateProfileAsync(int userId, string newUsername)
        {
            // Vérifier si le nouveau username n'est pas déjà pris par un autre utilisateur
            var existing = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == newUsername && u.Id != userId);

            if (existing != null)
                throw new Exception("Ce nom d'utilisateur est déjà utilisé.");

            // Récupérer l'utilisateur à modifier
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new Exception("Utilisateur introuvable.");

            // Mettre à jour le username
            user.Username = newUsername;
            await _context.SaveChangesAsync();
        }

        public async Task UpdatePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            // Récupérer l'utilisateur
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new Exception("Utilisateur introuvable.");

            // Vérifier le mot de passe actuel
            if (!PasswordHasher.VerifyPassword(currentPassword, user.PasswordHash))
                throw new Exception("Mot de passe actuel incorrect.");

            // Mettre à jour avec le nouveau mot de passe haché
            user.PasswordHash = PasswordHasher.HashPassword(newPassword);
            await _context.SaveChangesAsync();
        }
    }
}