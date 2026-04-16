using AddisMesobKMS.API.DTOs;
using AddisMesobKMS.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AddisMesobKMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    [ApiExplorerSettings(GroupName = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public AdminController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpPost("employees")]
        public async Task<IActionResult> CreateEmployee([FromBody] CreateEmployeeDto dto)
        {
            try
            {
                var employee = await _employeeService.CreateEmployeeAsync(dto);
                return Ok(employee);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("employees/{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] UpdateEmployeeDto dto)
        {
            var employee = await _employeeService.UpdateEmployeeAsync(id, dto);
            if (employee == null)
                return NotFound(new { message = "Employee not found" });

            return Ok(employee);
        }

        [HttpPatch("employees/{id}/toggle-status")]
        public async Task<IActionResult> ToggleEmployeeStatus(int id)
        {
            var result = await _employeeService.ToggleEmployeeStatusAsync(id);
            if (!result)
                return NotFound(new { message = "Employee not found" });

            return Ok(new { message = "Employee status updated successfully" });
        }

        [HttpGet("employees")]
        public async Task<IActionResult> GetAllEmployees()
        {
            var employees = await _employeeService.GetAllEmployeesAsync();
            return Ok(employees);
        }

        [HttpGet("employees/{id}")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            var employee = await _employeeService.GetEmployeeByIdAsync(id);
            if (employee == null)
                return NotFound(new { message = "Employee not found" });

            return Ok(employee);
        }
    }
}
