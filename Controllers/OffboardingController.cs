using AddisMesobKMS.API.DTOs;
using AddisMesobKMS.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AddisMesobKMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [ApiExplorerSettings(GroupName = "Employee")]
    public class OffboardingController : ControllerBase
    {
        private readonly IOffboardingService _offboardingService;

        public OffboardingController(IOffboardingService offboardingService)
        {
            _offboardingService = offboardingService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOffboarding([FromBody] CreateOffboardingDto dto)
        {
            var record = await _offboardingService.CreateOffboardingAsync(dto);
            return Ok(record);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOffboardings()
        {
            var records = await _offboardingService.GetAllOffboardingsAsync();
            return Ok(records);
        }
    }
}
