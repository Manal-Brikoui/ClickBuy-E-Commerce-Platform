
using shopstore.Services;

namespace shopstore.Middleware
{
    public class TokenAuthenticationMiddleware
    {
        private readonly RequestDelegate _next;

        public TokenAuthenticationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IAuthService authService)
        {
            // Récupérer le token depuis le header Authorization
            var authHeader = context.Request.Headers["Authorization"].ToString();

            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
            {
                var token = authHeader.Replace("Bearer ", "").Trim();

                try
                {
                    // Valider le token et récupérer l'utilisateur
                    var user = await authService.GetUserByToken(token);

                    if (user != null)
                    {
                   
                        context.Items["User"] = user;
                        context.Items["UserId"] = user.Id;
                        context.Items["Username"] = user.Username;

                        Console.WriteLine($" Token validé pour l'utilisateur: {user.Username} (ID: {user.Id})");
                    }
                    else
                    {
                        Console.WriteLine($" Token invalide ou utilisateur introuvable: {token.Substring(0, Math.Min(8, token.Length))}...");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($" Erreur lors de la validation du token: {ex.Message}");
                }
            }

            await _next(context);
        }
    }
}