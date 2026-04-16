using AddisMesobKMS.API.DTOs;
using AddisMesobKMS.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AddisMesobKMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ApiExplorerSettings(GroupName = "Auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var result = await _authService.AuthenticateAsync(loginDto);

            if (result == null)
                return Unauthorized(new { message = "Invalid Employee ID or Password" });

            return Ok(result);
        }
    }

}
