using AddisMesobKMS.API.DTOs;

namespace AddisMesobKMS.API.Services
{
    public interface IKnowledgeService
    {
        Task<ArticleResponseDto> CreateArticleAsync(CreateArticleDto dto, int employeeId);
        Task<IEnumerable<ArticleResponseDto>> GetAllArticlesAsync();
        Task<ArticleResponseDto?> GetArticleByIdAsync(int id);
    }
}
