using AddisMesobKMS.API.DTOs;
using AddisMesobKMS.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AddisMesobKMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [ApiExplorerSettings(GroupName = "Issues")]
    public class IssuesController : ControllerBase
    {
        private readonly IIssueService _issueService;

        public IssuesController(IIssueService issueService)
        {
            _issueService = issueService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateIssue([FromBody] CreateIssueDto dto)
        {
            var employeeId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var issue = await _issueService.CreateIssueAsync(dto, employeeId);
            return Ok(issue);
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateIssueStatus(int id, [FromBody] UpdateIssueStatusDto dto)
        {
            var issue = await _issueService.UpdateIssueStatusAsync(id, dto);
            if (issue == null)
                return NotFound(new { message = "Issue not found" });

            return Ok(issue);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllIssues()
        {
            var issues = await _issueService.GetAllIssuesAsync();
            return Ok(issues);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetIssueById(int id)
        {
            var issue = await _issueService.GetIssueByIdAsync(id);
            if (issue == null)
                return NotFound(new { message = "Issue not found" });

            return Ok(issue);
        }
    }
}
