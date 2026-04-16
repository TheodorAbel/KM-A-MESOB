using AddisMesobKMS.API.DTOs;

namespace AddisMesobKMS.API.Services
{
    public interface IEmployeeService
    {
        Task<EmployeeResponseDto> CreateEmployeeAsync(CreateEmployeeDto dto);
        Task<EmployeeResponseDto?> UpdateEmployeeAsync(int id, UpdateEmployeeDto dto);
        Task<bool> ToggleEmployeeStatusAsync(int id);
        Task<IEnumerable<EmployeeResponseDto>> GetAllEmployeesAsync();
        Task<EmployeeResponseDto?> GetEmployeeByIdAsync(int id);
    }
}
