using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AddisMesobKMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [ApiExplorerSettings(GroupName = "Employee")]
    public class EmployeeController : ControllerBase
    {
        [HttpGet("profile")]
        public IActionResult GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var name = User.FindFirst(ClaimTypes.Name)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var employeeId = User.FindFirst("EmployeeId")?.Value;

            return Ok(new
            {
                UserId = userId,
                Name = name,
                Role = role,
                EmployeeId = employeeId
            });
        }
    }
}
