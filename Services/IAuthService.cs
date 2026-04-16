using AddisMesobKMS.API.DTOs;

namespace AddisMesobKMS.API.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDto?> AuthenticateAsync(LoginDto loginDto);
    }
}
