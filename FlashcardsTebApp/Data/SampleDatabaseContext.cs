using Microsoft.EntityFrameworkCore;

public class SampleDatabaseContext : DbContext
{
    public SampleDatabaseContext(DbContextOptions<SampleDatabaseContext> options
    )
        : base(options)
    {
    }

    // Define your DbSets here
    // public DbSet<YourEntity> YourEntities { get; set; }
}
