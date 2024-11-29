using Microsoft.AspNetCore.Identity;

namespace FlashcardsServer.Identity;

public class ApplicationUser : IdentityUser<Guid>
{
    public string? PersonName { get; set; }
}
