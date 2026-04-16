namespace AddisMesobKMS.API.DTOs
{
    public class FeedbackResponseDto
    {
        public int Id { get; set; }
        public string Source { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
