using AddisMesobKMS.API.Enums;
namespace AddisMesobKMS.API.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string EmployeeId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public Role Role { get; set; }
        public bool IsActive { get; set; } = true;
        public string Department { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<KnowledgeArticle> KnowledgeArticles { get; set; } = new List<KnowledgeArticle>();
        public ICollection<IssueTicket> IssueTickets { get; set; } = new List<IssueTicket>();
        public ICollection<CommunityPost> CommunityPosts { get; set; } = new List<CommunityPost>();
    }
}
