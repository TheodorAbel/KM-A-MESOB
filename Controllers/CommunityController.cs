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
    [ApiExplorerSettings(GroupName = "Community")]
    public class CommunityController : ControllerBase
    {
        private readonly ICommunityService _communityService;

        public CommunityController(ICommunityService communityService)
        {
            _communityService = communityService;
        }

        [HttpPost("posts")]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostDto dto)
        {
            var employeeId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var post = await _communityService.CreatePostAsync(dto, employeeId);
            return Ok(post);
        }

        [HttpGet("posts")]
        public async Task<IActionResult> GetAllPosts()
        {
            var posts = await _communityService.GetAllPostsAsync();
            return Ok(posts);
        }
    }
}
