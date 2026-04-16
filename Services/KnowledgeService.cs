using AddisMesobKMS.API.Data;
using AddisMesobKMS.API.DTOs;
using AddisMesobKMS.API.Models;
using Microsoft.EntityFrameworkCore;
namespace AddisMesobKMS.API.Services
{
    public class KnowledgeService : IKnowledgeService
    {
        private readonly ApplicationDbContext _context;

        public KnowledgeService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ArticleResponseDto> CreateArticleAsync(CreateArticleDto dto, int employeeId)
        {
            var article = new KnowledgeArticle
            {
                Title = dto.Title,
                Content = dto.Content,
                Category = dto.Category,
                CreatedById = employeeId,
                CreatedAt = DateTime.UtcNow
            };

            _context.KnowledgeArticles.Add(article);
            await _context.SaveChangesAsync();

            return await MapToDto(article);
        }

        public async Task<IEnumerable<ArticleResponseDto>> GetAllArticlesAsync()
        {
            var articles = await _context.KnowledgeArticles
                .Include(a => a.CreatedBy)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();

            return articles.Select(a => MapToDto(a).Result);
        }

        public async Task<ArticleResponseDto?> GetArticleByIdAsync(int id)
        {
            var article = await _context.KnowledgeArticles
                .Include(a => a.CreatedBy)
                .FirstOrDefaultAsync(a => a.Id == id);

            return article == null ? null : await MapToDto(article);
        }

        private async Task<ArticleResponseDto> MapToDto(KnowledgeArticle article)
        {
            return new ArticleResponseDto
            {
                Id = article.Id,
                Title = article.Title,
                Content = article.Content,
                Category = article.Category,
                CreatedByName = article.CreatedBy?.Name ?? "Unknown",
                CreatedAt = article.CreatedAt
            };
        }
    }
}
