using Microsoft.EntityFrameworkCore;
using shopstore.Data;
using shopstore.Models;

namespace shopstore.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _db;

        public UserService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<User?> GetUserByIdAsync(int userId)
        {
            return await _db.Users
                .Include(u => u.CartItems)
                .Include(u => u.Orders)
                .Include(u => u.Products)  
                .FirstOrDefaultAsync(u => u.Id == userId);
        }

     
        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _db.Users
                .Include(u => u.CartItems)
                .Include(u => u.Orders)
                .Include(u => u.Products)  
                .FirstOrDefaultAsync(u => u.Username == username);
        }

     
        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _db.Users
                .Include(u => u.CartItems)
                .Include(u => u.Orders)
                .Include(u => u.Products) 
                .ToListAsync();
        }

     
        public async Task UpdateUserAsync(User user)
        {
            _db.Users.Update(user);
            await _db.SaveChangesAsync();
        }

       
        public async Task DeleteUserAsync(int userId)
        {
            var user = await _db.Users.FindAsync(userId);
            if (user != null)
            {
                _db.Users.Remove(user);
                await _db.SaveChangesAsync();
            }
        }

    }
}