using FlashcardsServer.Identity;
using FlashcardsServer.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class
    SampleDatabaseContext : IdentityDbContext<ApplicationUser, ApplicationRole,
    Guid>
{
    public SampleDatabaseContext(DbContextOptions<SampleDatabaseContext> options
    )
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
}
