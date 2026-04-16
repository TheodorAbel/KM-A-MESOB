using AddisMesobKMS.API.Data;
using AddisMesobKMS.API.DTOs;
using AddisMesobKMS.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AddisMesobKMS.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<LoginResponseDto?> AuthenticateAsync(LoginDto loginDto)
        {
            // Find employee by EmployeeId
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.EmployeeId == loginDto.EmployeeId && e.IsActive);

            if (employee == null)
                return null;

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, employee.PasswordHash))
                return null;

            // Generate JWT token
            var token = GenerateJwtToken(employee);

            return new LoginResponseDto
            {
                Token = token,
                EmployeeId = employee.EmployeeId,
                Name = employee.Name,
                Role = employee.Role.ToString()
            };
        }

        private string GenerateJwtToken(Employee employee)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? throw new Exception("JWT Key not found"));

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, employee.Id.ToString()),
                new Claim(ClaimTypes.Name, employee.Name),
                new Claim(ClaimTypes.Role, employee.Role.ToString()),
                new Claim("EmployeeId", employee.EmployeeId)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(double.Parse(_configuration["Jwt:ExpiryInMinutes"] ?? "60")),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
