using System.Security.Cryptography;
using System.Text;

namespace shopstore.Utils
{
    public class PasswordHasher
    {
        // Hash password using SHA256
        public static string HashPassword(string password)
        {
            using (var sha = SHA256.Create())
            {
                var bytes = Encoding.UTF8.GetBytes(password);
                var hash = sha.ComputeHash(bytes);
                return Convert.ToBase64String(hash);
            }
        }

        // Compare entered password with stored hash
        public static bool VerifyPassword(string password, string storedHash)
        {
            string hashedInput = HashPassword(password);
            return hashedInput == storedHash;
        }
    }
}
