using AddisMesobKMS.API.Data;
using AddisMesobKMS.API.DTOs;
using AddisMesobKMS.API.Enums;
using AddisMesobKMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AddisMesobKMS.API.Services
{
    public class CommunityService : ICommunityService
    {
        private readonly ApplicationDbContext _context;

        public CommunityService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PostResponseDto> CreatePostAsync(CreatePostDto dto, int employeeId)
        {
            var post = new CommunityPost
            {
                Type = Enum.Parse<PostType>(dto.Type),
                Content = dto.Content,
                CreatedById = employeeId,
                CreatedAt = DateTime.UtcNow
            };

            _context.CommunityPosts.Add(post);
            await _context.SaveChangesAsync();

            return await MapToDto(post);
        }

        public async Task<IEnumerable<PostResponseDto>> GetAllPostsAsync()
        {
            var posts = await _context.CommunityPosts
                .Include(p => p.CreatedBy)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return await Task.WhenAll(posts.Select(p => MapToDto(p)));
        }

        private async Task<PostResponseDto> MapToDto(CommunityPost post)
        {
            return new PostResponseDto
            {
                Id = post.Id,
                Type = post.Type.ToString(),
                Content = post.Content,
                CreatedByName = post.CreatedBy?.Name ?? "Unknown",
                CreatedAt = post.CreatedAt
            };
        }
    }
}
