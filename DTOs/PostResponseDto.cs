namespace AddisMesobKMS.API.DTOs
{
    public class PostResponseDto
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string CreatedByName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
