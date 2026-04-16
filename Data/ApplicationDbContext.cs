using AddisMesobKMS.API.Models;
using AddisMesobKMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AddisMesobKMS.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<KnowledgeArticle> KnowledgeArticles { get; set; }
        public DbSet<IssueTicket> IssueTickets { get; set; }
        public DbSet<CommunityPost> CommunityPosts { get; set; }
        public DbSet<OffboardingRecord> OffboardingRecords { get; set; }
        public DbSet<QMSFeedback> QMSFeedbacks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Employee - KnowledgeArticle relationship (One-to-Many)
            modelBuilder.Entity<KnowledgeArticle>()
                .HasOne(k => k.CreatedBy)
                .WithMany(e => e.KnowledgeArticles)
                .HasForeignKey(k => k.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

            // Employee - IssueTicket relationship (One-to-Many)
            modelBuilder.Entity<IssueTicket>()
                .HasOne(i => i.CreatedBy)
                .WithMany(e => e.IssueTickets)
                .HasForeignKey(i => i.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

            // Employee - CommunityPost relationship (One-to-Many)
            modelBuilder.Entity<CommunityPost>()
                .HasOne(c => c.CreatedBy)
                .WithMany(e => e.CommunityPosts)
                .HasForeignKey(c => c.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

            // Make EmployeeId unique
            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.EmployeeId)
                .IsUnique();
        }
    }
}