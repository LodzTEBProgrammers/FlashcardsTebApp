using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using FlashcardsServer.DTO;
using FlashcardsServer.Identity;
using FlashcardsServer.ServiceContracts;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames =
    System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames;

namespace FlashcardsServer.Services;

public class JwtService : IJwtService
{
    private readonly IConfiguration _configuration;
    private readonly SecretClient _secretClient;

    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
        _secretClient = new SecretClient(
            new Uri(_configuration["KeyVault:KeyVaultURL"]),
            new DefaultAzureCredential());
    }

    public AuthenticationResponse CreateJwtToken(ApplicationUser user)
    {
        DateTime expiration = DateTime.UtcNow.AddMinutes(
            Convert.ToDouble(_configuration["Jwt:EXPIRATION_MINUTES"]));

        Claim[] claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub,
                user.Id.ToString()), // Subject (user ID)
            new Claim(JwtRegisteredClaimNames.Jti,
                Guid.NewGuid().ToString()), // JWT unique ID
            new Claim(JwtRegisteredClaimNames.Iat,
                DateTime.UtcNow
                    .ToString()), // Issued at (date and time of token generation)
            new Claim(ClaimTypes.NameIdentifier,
                user.Id
                    .ToString()), // Unique name identifier of the user (Email)
            new Claim(ClaimTypes.Name, user.PersonName) // Name of the user
        };

        // Retrieve the symmetric key from Azure Key Vault
        KeyVaultSecret secret = _secretClient.GetSecret("JwtSymmetricKey");
        SymmetricSecurityKey securityKey =
            new(Convert.FromBase64String(secret.Value));

        SigningCredentials signingCredentials =
            new(securityKey, SecurityAlgorithms.HmacSha256);

        JwtSecurityToken tokenGenerator = new(
            _configuration["Jwt:Issuer"],
            _configuration["Jwt:Audience"],
            claims,
            expires : expiration,
            signingCredentials : signingCredentials
        );

        string token = new JwtSecurityTokenHandler()
            .WriteToken(tokenGenerator);

        return new AuthenticationResponse()
        {
            Token = token,
            Email = user.Email,
            PersonName = user.PersonName,
            Expiration = expiration
        };
    }
}
