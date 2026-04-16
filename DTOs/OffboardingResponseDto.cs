namespace AddisMesobKMS.API.DTOs
{
    public class OffboardingResponseDto
    {
        public int Id { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
