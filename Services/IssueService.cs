using AddisMesobKMS.API.Data;
using AddisMesobKMS.API.DTOs;
using AddisMesobKMS.API.Enums;
using AddisMesobKMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AddisMesobKMS.API.Services
{
    public class IssueService : IIssueService
    {
        private readonly ApplicationDbContext _context;

        public IssueService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IssueResponseDto> CreateIssueAsync(CreateIssueDto dto, int employeeId)
        {
            var issue = new IssueTicket
            {
                Title = dto.Title,
                Description = dto.Description,
                Status = IssueStatus.Open,
                Priority = Enum.Parse<Priority>(dto.Priority),
                CreatedById = employeeId,
                CreatedAt = DateTime.UtcNow
            };

            _context.IssueTickets.Add(issue);
            await _context.SaveChangesAsync();

            return await MapToDto(issue);
        }

        public async Task<IssueResponseDto?> UpdateIssueStatusAsync(int id, UpdateIssueStatusDto dto)
        {
            var issue = await _context.IssueTickets
                .Include(i => i.CreatedBy)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (issue == null) return null;

            issue.Status = Enum.Parse<IssueStatus>(dto.Status);
            await _context.SaveChangesAsync();

            return await MapToDto(issue);
        }

        public async Task<IEnumerable<IssueResponseDto>> GetAllIssuesAsync()
        {
            var issues = await _context.IssueTickets
                .Include(i => i.CreatedBy)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();

            return await Task.WhenAll(issues.Select(i => MapToDto(i)));
        }

        public async Task<IssueResponseDto?> GetIssueByIdAsync(int id)
        {
            var issue = await _context.IssueTickets
                .Include(i => i.CreatedBy)
                .FirstOrDefaultAsync(i => i.Id == id);

            return issue == null ? null : await MapToDto(issue);
        }

        private async Task<IssueResponseDto> MapToDto(IssueTicket issue)
        {
            return new IssueResponseDto
            {
                Id = issue.Id,
                Title = issue.Title,
                Description = issue.Description,
                Status = issue.Status.ToString(),
                Priority = issue.Priority.ToString(),
                CreatedByName = issue.CreatedBy?.Name ?? "Unknown",
                CreatedAt = issue.CreatedAt
            };
        }
    }
}
