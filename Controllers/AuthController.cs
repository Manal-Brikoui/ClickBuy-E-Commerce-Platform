using Microsoft.AspNetCore.Mvc;
using shopstore.Services;
using shopstore.DTOs.Auth;
using shopstore.DTOS.Auth;

namespace shopstore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

     
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new { message = "Username and password are required." });
            try
            {
                var response = await _authService.RegisterAsync(request);
                return Ok(new
                {
                    token = response.Token,
                    user = new
                    {
                        userId = response.UserId,
                        username = response.Username
                        
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Erreur lors de l'inscription: {ex.Message}" });
            }
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new { message = "Username and password are required." });
            try
            {
                var response = await _authService.LoginAsync(request);
                if (response == null)
                    return BadRequest(new { message = "Nom d'utilisateur ou mot de passe incorrect." });

                return Ok(new
                {
                    token = response.Token,
                    user = new
                    {
                        userId = response.UserId,
                        username = response.Username
                  
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Erreur lors de la connexion: {ex.Message}" });
            }
        }

       
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username))
                return BadRequest(new { message = "Username est requis." });

            try
            {
                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                if (string.IsNullOrEmpty(token))
                    return Unauthorized(new { message = "Token manquant." });

                var user = await _authService.GetUserByToken(token);
                if (user == null)
                    return Unauthorized(new { message = "Utilisateur non trouvé." });

                await _authService.UpdateProfileAsync(user.Id, request.Username);

                return Ok(new { message = "Profil mis à jour avec succès.", username = request.Username });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("password")]
        public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.CurrentPassword) || string.IsNullOrWhiteSpace(request.NewPassword))
                return BadRequest(new { message = "Mot de passe actuel et nouveau mot de passe sont requis." });

            if (request.NewPassword != request.ConfirmPassword)
                return BadRequest(new { message = "Les deux nouveaux mots de passe ne correspondent pas." });

            if (request.NewPassword.Length < 6)
                return BadRequest(new { message = "Le nouveau mot de passe doit avoir au moins 6 caractères." });

            try
            {
                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                if (string.IsNullOrEmpty(token))
                    return Unauthorized(new { message = "Token manquant." });

                var user = await _authService.GetUserByToken(token);
                if (user == null)
                    return Unauthorized(new { message = "Utilisateur non trouvé." });

                await _authService.UpdatePasswordAsync(user.Id, request.CurrentPassword, request.NewPassword);

                return Ok(new { message = "Mot de passe mis à jour avec succès." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}