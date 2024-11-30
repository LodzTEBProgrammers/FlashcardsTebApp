using System.Security.Claims;
using FlashcardsServer.DTO;
using FlashcardsServer.Identity;

namespace FlashcardsServer.ServiceContracts;

public interface IJwtService
{
    AuthenticationResponse CreateJwtToken(ApplicationUser user);

    ClaimsPrincipal? GetPrincipalFromJwtToken(string? token);
}
