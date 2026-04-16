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
    public class QMSController : ControllerBase
    {
        private readonly IQMSFeedbackService _feedbackService;

        public QMSController(IQMSFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpPost("feedback")]
        public async Task<IActionResult> CreateFeedback([FromBody] CreateFeedbackDto dto)
        {
            var feedback = await _feedbackService.CreateFeedbackAsync(dto);
            return Ok(feedback);
        }

        [HttpGet("feedback")]
        public async Task<IActionResult> GetAllFeedbacks()
        {
            var feedbacks = await _feedbackService.GetAllFeedbacksAsync();
            return Ok(feedbacks);
        }
    }
}
