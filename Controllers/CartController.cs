using Microsoft.AspNetCore.Mvc;
using shopstore.DTOs.Cart;
using shopstore.Services;

namespace shopstore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

   
        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var cart = await _cartService.GetCartAsync();
            return Ok(cart);
        }

     
        [HttpPost("add")]
        public async Task<IActionResult> AddToCart(AddToCartRequest request)
        {
            await _cartService.AddToCartAsync(request);
            return Ok(new { message = "Product added to cart" });
        }

 
        [HttpPut("update")]
        public async Task<IActionResult> UpdateCart(UpdateCartRequest request)
        {
            await _cartService.UpdateCartAsync(request);
            return Ok(new { message = "Cart updated" });
        }

        [HttpDelete("{productId}")]
        public async Task<IActionResult> Remove(int productId)
        {
            await _cartService.RemoveFromCartAsync(productId);
            return Ok(new { message = "Product removed from cart" });
        }

      
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            await _cartService.ClearCartAsync();
            return Ok(new { message = "Cart cleared" });
        }
    }
}