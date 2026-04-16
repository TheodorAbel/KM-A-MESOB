using AddisMesobKMS.API.DTOs;

namespace AddisMesobKMS.API.Services
{
    public interface IOffboardingService
    {
        Task<OffboardingResponseDto> CreateOffboardingAsync(CreateOffboardingDto dto);
        Task<IEnumerable<OffboardingResponseDto>> GetAllOffboardingsAsync();
    }
}
