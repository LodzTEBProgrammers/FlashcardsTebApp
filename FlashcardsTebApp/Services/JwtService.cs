using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
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

    /// <summary>
    /// Generates a JWT token using the given user's information and the configuration settings.
    /// </summary>
    /// <param name="user">ApplicationUser object</param>
    /// <returns>AuthenticationResponse that includes token</returns>
    public AuthenticationResponse CreateJwtToken(ApplicationUser user)
    {
        // Create a DateTime object representing the token expiration time by adding the number of minutes specified in the configuration to the current UTC time.
        DateTime expiration = DateTime.UtcNow.AddMinutes(
            Convert.ToDouble(_configuration["Jwt:EXPIRATION_MINUTES"]));

        // Create an array of Claim objects representing the user's claims, such as their ID, name, email, etc.
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
                user.Email), // Unique name identifier of the user (Email)
            new Claim(ClaimTypes.Name, user.PersonName), // Name of the user
            new Claim(ClaimTypes.Email, user.Email) // Name of the user
        };

        // Retrieve the symmetric key from Azure Key Vault
        SymmetricSecurityKey securityKey = GetSymmetricSecurityKey();

        // Create a SigningCredentials object with the security key and the HMACSHA256 algorithm.
        SigningCredentials signingCredentials =
            new(securityKey, SecurityAlgorithms.HmacSha256);

        // Create a JwtSecurityToken object with the given issuer, audience, claims, expiration, and signing credentials.
        JwtSecurityToken tokenGenerator = new(
            _configuration["Jwt:Issuer"],
            _configuration["Jwt:Audience"],
            claims,
            expires : expiration,
            signingCredentials : signingCredentials
        );

        // Create a JwtSecurityTokenHandler object and use it to write the token as a string.
        string token = new JwtSecurityTokenHandler().WriteToken(tokenGenerator);

        // Create and return an AuthenticationResponse object containing the token, user email, user name, and token expiration time.
        return new AuthenticationResponse()
        {
            Token = token,
            Email = user.Email,
            PersonName = user.PersonName,
            Expiration = expiration,
            RefreshToken = GenerateRefreshToken(),
            RefreshTokenExpirationDateTime = DateTime.Now.AddMinutes(
                Convert.ToInt32(
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

    public ClaimsPrincipal? GetPrincipalFromJwtToken(string? token)
    {
        // Retrieve the symmetric key from Azure Key Vault
        SymmetricSecurityKey securityKey = GetSymmetricSecurityKey();

        TokenValidationParameters tokenValidationParameters = new()
        {
            ValidateAudience = true,
            ValidAudience = _configuration["Jwt:Audience"],
            ValidateIssuer = true,
            ValidIssuer = _configuration["Jwt:Issuer"],
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = securityKey,
            ValidateLifetime = false // should be false
        };

        JwtSecurityTokenHandler jwtSecurityTokenHandler = new();

        ClaimsPrincipal principal = jwtSecurityTokenHandler.ValidateToken(token,
            tokenValidationParameters, out SecurityToken securityToken);

        if (securityToken is not JwtSecurityToken jwtSecurityToken ||
            !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256,
                StringComparison.InvariantCultureIgnoreCase))
            throw new SecurityTokenException("Invalid token");

        return principal;
    }

    private SymmetricSecurityKey GetSymmetricSecurityKey()
    {
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

        return new SymmetricSecurityKey(keyBytes);
    }
}
