
using shopstore.DTOs.Auth;
using shopstore.Models;

namespace shopstore.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<User> GetUserByToken(string token);

        
        Task UpdateProfileAsync(int userId, string newUsername);
        Task UpdatePasswordAsync(int userId, string currentPassword, string newPassword);
    }
}