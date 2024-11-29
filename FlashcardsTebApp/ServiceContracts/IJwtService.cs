using FlashcardsServer.DTO;
using FlashcardsServer.Identity;

namespace FlashcardsServer.ServiceContracts;

public interface IJwtService
{
    AuthenticationResponse CreateJwtToken(ApplicationUser user);
}
