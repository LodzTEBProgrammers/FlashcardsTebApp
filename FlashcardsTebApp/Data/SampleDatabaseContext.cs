using FlashcardsServer.Models;
using Microsoft.EntityFrameworkCore;

public class SampleDatabaseContext : DbContext
{
    public SampleDatabaseContext(DbContextOptions<SampleDatabaseContext> options
    )
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
}
