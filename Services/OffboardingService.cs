using AddisMesobKMS.API.Data;
using AddisMesobKMS.API.DTOs;
using AddisMesobKMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AddisMesobKMS.API.Services
{
    public class OffboardingService : IOffboardingService
    {
        private readonly ApplicationDbContext _context;

        public OffboardingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<OffboardingResponseDto> CreateOffboardingAsync(CreateOffboardingDto dto)
        {
            var record = new OffboardingRecord
            {
                EmployeeName = dto.EmployeeName,
                Department = dto.Department,
                Notes = dto.Notes,
                CreatedAt = DateTime.UtcNow
            };

            _context.OffboardingRecords.Add(record);
            await _context.SaveChangesAsync();

            return MapToDto(record);
        }

        public async Task<IEnumerable<OffboardingResponseDto>> GetAllOffboardingsAsync()
        {
            var records = await _context.OffboardingRecords
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return records.Select(MapToDto);
        }

        private OffboardingResponseDto MapToDto(OffboardingRecord record)
        {
            return new OffboardingResponseDto
            {
                Id = record.Id,
                EmployeeName = record.EmployeeName,
                Department = record.Department,
                Notes = record.Notes,
                CreatedAt = record.CreatedAt
            };
        }
    }
}
