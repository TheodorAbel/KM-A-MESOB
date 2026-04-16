using AddisMesobKMS.API.DTOs;

namespace AddisMesobKMS.API.Services
{
    public interface ICommunityService
    {
        Task<PostResponseDto> CreatePostAsync(CreatePostDto dto, int employeeId);
        Task<IEnumerable<PostResponseDto>> GetAllPostsAsync();
    }

}
