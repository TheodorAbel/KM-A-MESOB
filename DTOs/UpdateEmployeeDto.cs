namespace AddisMesobKMS.API.DTOs
{
    public class UpdateEmployeeDto
    {
        public string Name { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string? Password { get; set; }
    }
}
