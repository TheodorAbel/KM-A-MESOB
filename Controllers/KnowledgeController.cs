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
    [ApiExplorerSettings(GroupName = "Knowledge")]
    public class KnowledgeController : ControllerBase
    {
        private readonly IKnowledgeService _knowledgeService;

        public KnowledgeController(IKnowledgeService knowledgeService)
        {
            _knowledgeService = knowledgeService;
        }

        [HttpPost("articles")]
        public async Task<IActionResult> CreateArticle([FromBody] CreateArticleDto dto)
        {
            var employeeId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var article = await _knowledgeService.CreateArticleAsync(dto, employeeId);
            return Ok(article);
        }

        [HttpGet("articles")]
        public async Task<IActionResult> GetAllArticles()
        {
            var articles = await _knowledgeService.GetAllArticlesAsync();
            return Ok(articles);
        }

        [HttpGet("articles/{id}")]
        public async Task<IActionResult> GetArticleById(int id)
        {
            var article = await _knowledgeService.GetArticleByIdAsync(id);
            if (article == null)
                return NotFound(new { message = "Article not found" });

            return Ok(article);
        }
    }
}
