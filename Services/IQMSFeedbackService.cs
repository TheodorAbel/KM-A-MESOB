using AddisMesobKMS.API.DTOs;

namespace AddisMesobKMS.API.Services
{
    public interface IQMSFeedbackService
    {
        Task<FeedbackResponseDto> CreateFeedbackAsync(CreateFeedbackDto dto);
        Task<IEnumerable<FeedbackResponseDto>> GetAllFeedbacksAsync();
    }
}
