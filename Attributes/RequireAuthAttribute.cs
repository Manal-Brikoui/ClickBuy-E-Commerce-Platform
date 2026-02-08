
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace shopstore.Attributes
{
    public class RequireAuthAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            // Vérifier si l'utilisateur est présent dans les Items du contexte
            var user = context.HttpContext.Items["User"];

            if (user == null)
            {
         
                context.Result = new UnauthorizedObjectResult(new
                {
                    message = "Authentification requise. Veuillez vous connecter."
                });
            }
        }
    }
}