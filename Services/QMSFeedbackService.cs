using AddisMesobKMS.API.Data;
using AddisMesobKMS.API.DTOs;
using AddisMesobKMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AddisMesobKMS.API.Services
{
    public class QMSFeedbackService : IQMSFeedbackService
    {
        private readonly ApplicationDbContext _context;

        public QMSFeedbackService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<FeedbackResponseDto> CreateFeedbackAsync(CreateFeedbackDto dto)
        {
            var feedback = new QMSFeedback
            {
                Source = dto.Source,
                Description = dto.Description,
                CreatedAt = DateTime.UtcNow
            };

            _context.QMSFeedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            return MapToDto(feedback);
        }

        public async Task<IEnumerable<FeedbackResponseDto>> GetAllFeedbacksAsync()
        {
            var feedbacks = await _context.QMSFeedbacks
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();

            return feedbacks.Select(MapToDto);
        }

        private FeedbackResponseDto MapToDto(QMSFeedback feedback)
        {
            return new FeedbackResponseDto
            {
                Id = feedback.Id,
                Source = feedback.Source,
                Description = feedback.Description,
                CreatedAt = feedback.CreatedAt
            };
        }
    }
}
