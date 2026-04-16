using AddisMesobKMS.API.Enums;

namespace AddisMesobKMS.API.Models
{
    public class CommunityPost
    {
        public int Id { get; set; }
        public PostType Type { get; set; }
        public string Content { get; set; } = string.Empty;
        public int CreatedById { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public Employee CreatedBy { get; set; } = null!;
    }
}
