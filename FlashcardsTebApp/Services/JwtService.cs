using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
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
        string secretValue = secret.Value;

        // Validate the Base-64 string
        byte[] keyBytes;
        try
        {
            keyBytes = Convert.FromBase64String(secretValue);
        }
        catch (FormatException)
        {
            throw new InvalidOperationException(
                "The retrieved secret is not a valid Base-64 string.");
        }

        SymmetricSecurityKey securityKey = new(keyBytes);

        SigningCredentials signingCredentials =
            new(securityKey, SecurityAlgorithms.HmacSha256);

        JwtSecurityToken tokenGenerator = new(
            _configuration["Jwt:Issuer"],
            _configuration["Jwt:Audience"],
            claims,
            expires : expiration,
            signingCredentials : signingCredentials
        );

        string token = new JwtSecurityTokenHandler().WriteToken(tokenGenerator);

        return new AuthenticationResponse()
        {
            Token = token,
            Email = user.Email,
            PersonName = user.PersonName,
            Expiration = expiration,
            RefreshToken = GenerateRefreshToken(),
            RefreshTokenExpirationDateTime =
                DateTime.Now.AddMinutes(Convert.ToInt32(
                    _configuration["RefreshToken:EXPIRATION_MINUTES"]))
        };
    }

    // Creates a refresh token (base 64 string of random numbers)
    private string GenerateRefreshToken()
    {
        byte[] bytes = new byte[64];
        RandomNumberGenerator randomNumberGenerator =
            RandomNumberGenerator.Create();

        randomNumberGenerator.GetBytes(bytes);

        return Convert.ToBase64String(bytes);
    }
}
