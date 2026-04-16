using AddisMesobKMS.API.Data;
using AddisMesobKMS.API.DTOs;
using AddisMesobKMS.API.Enums;
using AddisMesobKMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AddisMesobKMS.API.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly ApplicationDbContext _context;

        public EmployeeService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<EmployeeResponseDto> CreateEmployeeAsync(CreateEmployeeDto dto)
        {
            // Check if EmployeeId already exists
            if (await _context.Employees.AnyAsync(e => e.EmployeeId == dto.EmployeeId))
                throw new Exception("Employee ID already exists");

            var employee = new Employee
            {
                EmployeeId = dto.EmployeeId,
                Name = dto.Name,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = Enum.Parse<Role>(dto.Role),
                Department = dto.Department,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return MapToDto(employee);
        }

        public async Task<EmployeeResponseDto?> UpdateEmployeeAsync(int id, UpdateEmployeeDto dto)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return null;

            employee.Name = dto.Name;
            employee.Department = dto.Department;

            if (!string.IsNullOrEmpty(dto.Password))
            {
                employee.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            }

            await _context.SaveChangesAsync();
            return MapToDto(employee);
        }

        public async Task<bool> ToggleEmployeeStatusAsync(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return false;

            employee.IsActive = !employee.IsActive;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<EmployeeResponseDto>> GetAllEmployeesAsync()
        {
            var employees = await _context.Employees
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();

            return employees.Select(MapToDto);
        }

        public async Task<EmployeeResponseDto?> GetEmployeeByIdAsync(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            return employee == null ? null : MapToDto(employee);
        }

        private EmployeeResponseDto MapToDto(Employee employee)
        {
            return new EmployeeResponseDto
            {
                Id = employee.Id,
                EmployeeId = employee.EmployeeId,
                Name = employee.Name,
                Role = employee.Role.ToString(),
                IsActive = employee.IsActive,
                Department = employee.Department,
                CreatedAt = employee.CreatedAt
            };
        }
    }
}
