using AddisMesobKMS.API.Enums;

namespace AddisMesobKMS.API.Models
{
    public class IssueTicket
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public IssueStatus Status { get; set; } = IssueStatus.Open;
        public Priority Priority { get; set; } = Priority.Medium;
        public int CreatedById { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public Employee CreatedBy { get; set; } = null!;
    }
}
