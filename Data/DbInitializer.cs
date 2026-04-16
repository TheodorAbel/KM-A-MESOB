using AddisMesobKMS.API.Enums;
using AddisMesobKMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AddisMesobKMS.API.Data
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(ApplicationDbContext context)
        {
            await context.Database.EnsureCreatedAsync();

            // Check if we already have any employees
            if (await context.Employees.AnyAsync())
                return; // Database has been seeded

            // ========== CREATE EMPLOYEES ==========

            // Admin: Melat Mamushet (Only Admin)
            var admin = new Employee
            {
                EmployeeId = "ADMIN001",
                Name = "Melat Mamushet",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = Role.Admin,
                IsActive = true,
                Department = "Administration",
                CreatedAt = DateTime.UtcNow
            };

            // Employee 1: Abimael Getachew
            var employee1 = new Employee
            {
                EmployeeId = "EMP001",
                Name = "Abimael Getachew",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Employee@123"),
                Role = Role.Employee,
                IsActive = true,
                Department = "Software Development",
                CreatedAt = DateTime.UtcNow
            };

            // Employee 2: Abel Tewodros
            var employee2 = new Employee
            {
                EmployeeId = "EMP002",
                Name = "Abel Tewodros",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Employee@123"),
                Role = Role.Employee,
                IsActive = true,
                Department = "IT Infrastructure",
                CreatedAt = DateTime.UtcNow
            };

            // Employee 3: Hani Abesha
            var employee3 = new Employee
            {
                EmployeeId = "EMP003",
                Name = "Hani Abesha",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Employee@123"),
                Role = Role.Employee,
                IsActive = true,
                Department = "Human Resources",
                CreatedAt = DateTime.UtcNow
            };

            // Employee 4: Melkie Yilk
            var employee4 = new Employee
            {
                EmployeeId = "EMP004",
                Name = "Melkie Yilk",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Employee@123"),
                Role = Role.Employee,
                IsActive = true,
                Department = "Quality Assurance",
                CreatedAt = DateTime.UtcNow
            };

            await context.Employees.AddRangeAsync(admin, employee1, employee2, employee3, employee4);
            await context.SaveChangesAsync();

            // ========== SEED KNOWLEDGE ARTICLES ==========
            var articles = new List<KnowledgeArticle>
            {
                new KnowledgeArticle
                {
                    Title = "Welcome to Addis Mesob Knowledge Management System",
                    Content = "This comprehensive guide will help you understand how to use the KMS effectively. The system is designed to facilitate knowledge sharing, issue tracking, and community collaboration across all departments.",
                    Category = "Onboarding",
                    CreatedById = admin.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-30)
                },
                new KnowledgeArticle
                {
                    Title = "How to Submit and Track Issues",
                    Content = "Step-by-step guide to submitting issues:\n\n1. Navigate to Issues section\n2. Click 'Create New Issue'\n3. Fill in title, description, and priority\n4. Submit the issue\n5. Track status updates from the admin\n\nIssues can have statuses: Open, InProgress, Resolved",
                    Category = "Tutorials",
                    CreatedById = admin.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-25)
                },
                new KnowledgeArticle
                {
                    Title = "Company Remote Work Policy 2025",
                    Content = "All employees are required to work from the office at least 3 days per week. Remote work requests must be submitted 24 hours in advance. VPN access is provided for all remote workers.",
                    Category = "Policies",
                    CreatedById = admin.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-20)
                },
                new KnowledgeArticle
                {
                    Title = "Software Development Best Practices",
                    Content = "Follow these best practices:\n- Write unit tests for all features\n- Use meaningful variable names\n- Follow the SOLID principles\n- Conduct code reviews before merging\n- Document all API endpoints",
                    Category = "Development",
                    CreatedById = employee1.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-15)
                },
                new KnowledgeArticle
                {
                    Title = "Database Backup and Recovery Procedures",
                    Content = "Daily backups are performed at 2 AM. In case of data loss, contact IT department immediately. Recovery time objective (RTO) is 4 hours.",
                    Category = "IT Operations",
                    CreatedById = employee2.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-10)
                },
                new KnowledgeArticle
                {
                    Title = "Employee Onboarding Checklist",
                    Content = "New employee checklist:\n✓ Set up email account\n✓ Provide laptop and equipment\n✓ Grant system access\n✓ Schedule orientation\n✓ Assign mentor\n✓ Complete HR paperwork",
                    Category = "HR",
                    CreatedById = employee3.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-8)
                },
                new KnowledgeArticle
                {
                    Title = "Quality Assurance Testing Guidelines",
                    Content = "All features must pass QA before deployment. Testing types:\n- Unit Testing\n- Integration Testing\n- System Testing\n- User Acceptance Testing (UAT)",
                    Category = "Quality",
                    CreatedById = employee4.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-5)
                },
                new KnowledgeArticle
                {
                    Title = "Security Best Practices for Employees",
                    Content = "Important security guidelines:\n- Never share passwords\n- Enable 2-factor authentication\n- Report suspicious emails\n- Lock computer when away\n- Use company VPN for remote access",
                    Category = "Security",
                    CreatedById = admin.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-3)
                }
            };

            await context.KnowledgeArticles.AddRangeAsync(articles);
            await context.SaveChangesAsync();

            // ========== SEED ISSUE TICKETS ==========
            var issues = new List<IssueTicket>
            {
                new IssueTicket
                {
                    Title = "Cannot access shared network drive",
                    Description = "I'm unable to access the S: drive from my workstation. Error message: 'Access denied'. I need this for my daily work.",
                    Status = IssueStatus.Resolved,
                    Priority = Priority.High,
                    CreatedById = employee1.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-14)
                },
                new IssueTicket
                {
                    Title = "Email synchronization issue",
                    Description = "Outlook is not syncing with the Exchange server. New emails are not appearing for the past 2 hours.",
                    Status = IssueStatus.Resolved,
                    Priority = Priority.High,
                    CreatedById = employee2.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-12)
                },
                new IssueTicket
                {
                    Title = "VPN connection dropping frequently",
                    Description = "The VPN connection disconnects every 30 minutes, disrupting my work. This started happening after the latest Windows update.",
                    Status = IssueStatus.InProgress,
                    Priority = Priority.High,
                    CreatedById = employee3.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-10)
                },
                new IssueTicket
                {
                    Title = "Printers not working on 3rd floor",
                    Description = "All printers on the 3rd floor are showing offline status. IT support has been notified but no response yet.",
                    Status = IssueStatus.InProgress,
                    Priority = Priority.Medium,
                    CreatedById = employee4.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-8)
                },
                new IssueTicket
                {
                    Title = "Slack notifications not working",
                    Description = "Not receiving push notifications on mobile device. Already tried reinstalling the app.",
                    Status = IssueStatus.Open,
                    Priority = Priority.Medium,
                    CreatedById = employee1.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-5)
                },
                new IssueTicket
                {
                    Title = "Request for additional software license",
                    Description = "Need Adobe Creative Cloud license for design work. Current license expires next week.",
                    Status = IssueStatus.Open,
                    Priority = Priority.Low,
                    CreatedById = employee2.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-3)
                },
                new IssueTicket
                {
                    Title = "Meeting room booking system error",
                    Description = "The meeting room booking system shows rooms as available but they are already occupied.",
                    Status = IssueStatus.InProgress,
                    Priority = Priority.Medium,
                    CreatedById = employee3.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-2)
                },
                new IssueTicket
                {
                    Title = "Database connection timeout",
                    Description = "Application showing timeout errors when connecting to production database during peak hours.",
                    Status = IssueStatus.Open,
                    Priority = Priority.High,
                    CreatedById = employee4.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-1)
                }
            };

            await context.IssueTickets.AddRangeAsync(issues);
            await context.SaveChangesAsync();

            // ========== SEED COMMUNITY POSTS ==========
            var posts = new List<CommunityPost>
            {
                new CommunityPost
                {
                    Type = PostType.Announcement,
                    Content = "🎉 Welcome to the Addis Mesob Community Forum! This is your space to share ideas, ask questions, and collaborate with colleagues. Feel free to introduce yourself!",
                    CreatedById = admin.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-20)
                },
                new CommunityPost
                {
                    Type = PostType.Announcement,
                    Content = "📢 New cafeteria menu available! Check out the Ethiopian traditional dishes being served this week. Special: Doro Wat on Thursday!",
                    CreatedById = admin.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-15)
                },
                new CommunityPost
                {
                    Type = PostType.Discussion,
                    Content = "What improvements would you like to see in our development process? I'm particularly interested in hearing about automation opportunities.",
                    CreatedById = employee1.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-12)
                },
                new CommunityPost
                {
                    Type = PostType.Question,
                    Content = "Has anyone implemented CI/CD pipelines for .NET 8 applications? Looking for recommendations on best practices and tools.",
                    CreatedById = employee2.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-10)
                },
                new CommunityPost
                {
                    Type = PostType.Discussion,
                    Content = "Let's discuss work-life balance initiatives. What programs would help improve employee satisfaction?",
                    CreatedById = employee3.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-8)
                },
                new CommunityPost
                {
                    Type = PostType.Announcement,
                    Content = "🏆 Employee of the Month - March 2025: Congratulations to Abimael Getachew for outstanding contribution to the software development team!",
                    CreatedById = admin.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-6)
                },
                new CommunityPost
                {
                    Type = PostType.Question,
                    Content = "How do you handle technical debt in agile sprints? Looking for strategies to balance feature development with code quality.",
                    CreatedById = employee4.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-4)
                },
                new CommunityPost
                {
                    Type = PostType.Discussion,
                    Content = "Team building event next Friday! We're planning a cultural day with traditional Ethiopian coffee ceremony. Please confirm your attendance.",
                    CreatedById = employee1.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-2)
                },
                new CommunityPost
                {
                    Type = PostType.Announcement,
                    Content = "New learning platform launched! All employees have access to online courses for professional development. Check your email for login details.",
                    CreatedById = admin.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-1)
                }
            };

            await context.CommunityPosts.AddRangeAsync(posts);
            await context.SaveChangesAsync();

            // ========== SEED OFFBOARDING RECORDS ==========
            var offboardings = new List<OffboardingRecord>
            {
                new OffboardingRecord
                {
                    EmployeeName = "Tigist Mamo",
                    Department = "Sales",
                    Notes = "Exit interview completed. All company assets returned (laptop, badge, access cards). Final settlement processed.",
                    CreatedAt = DateTime.UtcNow.AddDays(-45)
                },
                new OffboardingRecord
                {
                    EmployeeName = "Dawit Solomon",
                    Department = "Marketing",
                    Notes = "Resigned for better opportunity. Handed over all projects to team lead. Knowledge transfer completed.",
                    CreatedAt = DateTime.UtcNow.AddDays(-30)
                },
                new OffboardingRecord
                {
                    EmployeeName = "Bruktawit Alemu",
                    Department = "Finance",
                    Notes = "Contract ended. All financial documents handed over. Access revoked from all systems.",
                    CreatedAt = DateTime.UtcNow.AddDays(-20)
                },
                new OffboardingRecord
                {
                    EmployeeName = "Samuel Tekle",
                    Department = "IT Support",
                    Notes = "Moving abroad. Completed exit checklist. Returned all hardware including backup drives.",
                    CreatedAt = DateTime.UtcNow.AddDays(-10)
                }
            };

            await context.OffboardingRecords.AddRangeAsync(offboardings);
            await context.SaveChangesAsync();

            // ========== SEED QMS FEEDBACK ==========
            var feedbacks = new List<QMSFeedback>
            {
                new QMSFeedback
                {
                    Source = "Customer Survey - March 2025",
                    Description = "Excellent customer service! The support team resolved our issue within 2 hours. Very professional and knowledgeable staff.",
                    CreatedAt = DateTime.UtcNow.AddDays(-25)
                },
                new QMSFeedback
                {
                    Source = "Internal Audit - Q1 2025",
                    Description = "Documentation needs improvement. Found several processes without proper documentation. Recommended implementing a document management system.",
                    CreatedAt = DateTime.UtcNow.AddDays(-20)
                },
                new QMSFeedback
                {
                    Source = "Employee Satisfaction Survey",
                    Description = "Positive feedback about the new KMS system. Employees find it useful for knowledge sharing. Suggested adding more training materials.",
                    CreatedAt = DateTime.UtcNow.AddDays(-18)
                },
                new QMSFeedback
                {
                    Source = "Customer Support Ticket",
                    Description = "Customer reported that response times have improved significantly. Appreciated the proactive communication.",
                    CreatedAt = DateTime.UtcNow.AddDays(-15)
                },
                new QMSFeedback
                {
                    Source = "Quality Review Meeting",
                    Description = "Identified need for automated testing in deployment pipeline. Will reduce production issues by 40%.",
                    CreatedAt = DateTime.UtcNow.AddDays(-12)
                },
                new QMSFeedback
                {
                    Source = "Client Feedback - ABC Corp",
                    Description = "Very satisfied with the software quality. Requesting additional features for reporting module.",
                    CreatedAt = DateTime.UtcNow.AddDays(-8)
                },
                new QMSFeedback
                {
                    Source = "Internal Process Audit",
                    Description = "Found gaps in change management process. Recommended implementing formal change request system.",
                    CreatedAt = DateTime.UtcNow.AddDays(-5)
                },
                new QMSFeedback
                {
                    Source = "Customer Survey - April 2025",
                    Description = "Rating: 4.8/5. Customers love the new UI. Suggested adding dark mode option.",
                    CreatedAt = DateTime.UtcNow.AddDays(-3)
                },
                new QMSFeedback
                {
                    Source = "Team Retrospective",
                    Description = "Team suggested weekly knowledge sharing sessions. Will improve cross-team collaboration.",
                    CreatedAt = DateTime.UtcNow.AddDays(-1)
                }
            };

            await context.QMSFeedbacks.AddRangeAsync(feedbacks);
            await context.SaveChangesAsync();
        }
    }
}
