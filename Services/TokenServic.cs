using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using shopstore.Models;

namespace shopstore.Services
{
    public class TokenService
    {
        private readonly IConfiguration _configuration;

        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username)
            };

            // Récupérer la clé secrète depuis appsettings.json
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "SuperSecretKey123456789012345678901234567890")
            );

            // Créer les credentials de signature
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Créer le token JWT
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? "ShopStore",
                audience: _configuration["Jwt:Audience"] ?? "ShopStoreUsers",
                claims: claims,
                expires: DateTime.Now.AddDays(7), // Token valide 7 jours
                signingCredentials: creds
            );

            // Retourner le token sous forme de string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public ClaimsPrincipal? ValidateToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "SuperSecretKey123456789012345678901234567890");

            try
            {
                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _configuration["Jwt:Issuer"] ?? "ShopStore",
                    ValidateAudience = true,
                    ValidAudience = _configuration["Jwt:Audience"] ?? "ShopStoreUsers",
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return principal;
            }
            catch
            {
                return null;
            }
        }

        public int? GetUserIdFromToken(string token)
        {
            var principal = ValidateToken(token);
            if (principal == null)
                return null;

            var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return null;

            return userId;
        }
    }
}