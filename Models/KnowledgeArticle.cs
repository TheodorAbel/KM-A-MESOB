namespace AddisMesobKMS.API.Models
{
    public class KnowledgeArticle
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int CreatedById { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public Employee CreatedBy { get; set; } = null!;
    }
}
