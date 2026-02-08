using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using shopstore.Data;
using shopstore.Services;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    )
);

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<ICommentService, CommentService>();

builder.Services.AddHttpContextAccessor();


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();

            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
            {
                var token = authHeader.Substring(7);
                context.Token = token;
            }

            return Task.CompletedTask;
        },

        OnTokenValidated = async context =>
        {
            try
            {
                var authService = context.HttpContext.RequestServices.GetRequiredService<IAuthService>();
                var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Substring(7);

                if (string.IsNullOrEmpty(token))
                {
                    context.Fail("Token manquant");
                    return;
                }

                var user = await authService.GetUserByToken(token);

                if (user == null)
                {
                    context.Fail("Token invalide");
                    return;
                }

                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim("Token", token)
                };

                var identity = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme);
                context.Principal = new ClaimsPrincipal(identity);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erreur validation token: {ex.Message}");
                context.Fail("Erreur de validation");
            }
        }
    };
});



builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();


var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
var productsPath = Path.Combine(uploadsPath, "products");

if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
    Console.WriteLine($"📁 Dossier créé : {uploadsPath}");
}

if (!Directory.Exists(productsPath))
{
    Directory.CreateDirectory(productsPath);
    Console.WriteLine($"📁 Dossier créé : {productsPath}");
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();


Console.WriteLine(" Serveur ShopStore démarré avec succès !");
Console.WriteLine($" Dossier des images produits : {productsPath}");
Console.WriteLine($" URL des images : http://localhost:5017/uploads/products/[nom-fichier]");
Console.WriteLine($" API disponible sur : http://localhost:5017");
Console.WriteLine($" Swagger UI : http://localhost:5017/swagger");
Console.WriteLine($" Authentification personnalisée activée (Tokens GUID)");


app.Run();