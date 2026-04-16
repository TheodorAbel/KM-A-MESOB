namespace AddisMesobKMS.API.Models
{
    public class QMSFeedback
    {
        public int Id { get; set; }
        public string Source { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
