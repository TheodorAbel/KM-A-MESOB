using AddisMesobKMS.API.DTOs;

namespace AddisMesobKMS.API.Services
{
    public interface IIssueService
    {
        Task<IssueResponseDto> CreateIssueAsync(CreateIssueDto dto, int employeeId);
        Task<IssueResponseDto?> UpdateIssueStatusAsync(int id, UpdateIssueStatusDto dto);
        Task<IEnumerable<IssueResponseDto>> GetAllIssuesAsync();
        Task<IssueResponseDto?> GetIssueByIdAsync(int id);
    }
}
