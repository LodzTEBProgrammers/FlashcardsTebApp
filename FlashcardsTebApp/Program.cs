using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using FlashcardsServer.Identity;
using FlashcardsServer.ServiceContracts;
using FlashcardsServer.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Azure.KeyVault;
using Microsoft.Azure.Services.AppAuthentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.AzureKeyVault;
using Microsoft.IdentityModel.Tokens;

try
{
    WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

    // Add services to the container.
    builder.Services.AddControllers();

    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    builder.Services.AddTransient<IJwtService, JwtService>();

    IConfigurationSection keyVaultURL =
        builder.Configuration.GetSection("KeyVault:KeyVaultURL");

    KeyVaultClient keyVaultClient = new(
        new KeyVaultClient.AuthenticationCallback(
            new AzureServiceTokenProvider().KeyVaultTokenCallback));

    builder.Configuration.AddAzureKeyVault(keyVaultURL.Value!.ToString(),
        new DefaultKeyVaultSecretManager());

    SecretClient client = new(
        new Uri(keyVaultURL.Value!.ToString()),
        new DefaultAzureCredential());

    // Add DbContext with connection string
    builder.Services.AddDbContext<SampleDatabaseContext>(options =>
        options.UseSqlServer(
            client.GetSecret("ProdConnection").Value.Value.ToString()));

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("CorsPolicy",
            builder => builder.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader());
    });

    // Configure logging
    builder.Logging.ClearProviders();
    builder.Logging.AddConsole();
    builder.Logging.AddDebug();

    // Identity
    builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
        {
            options.Password.RequiredLength = 8;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireLowercase = true;
            options.Password.RequireDigit = true;
        })
        .AddEntityFrameworkStores<SampleDatabaseContext>()
        .AddDefaultTokenProviders()
        .AddUserStore<UserStore<ApplicationUser, ApplicationRole,
            SampleDatabaseContext, Guid>>()
        .AddRoleStore<
            RoleStore<ApplicationRole, SampleDatabaseContext, Guid>>();

    // Set the Issuer based on the environment
    if (builder.Environment.IsDevelopment())
    {
        builder.Configuration["Jwt:Issuer"] = "https://localhost:7285";
        builder.Configuration["Jwt:Audience"] = "http://localhost:4200";
    } else
    {
        builder.Configuration["Jwt:Issuer"] =
            "https://flashcardstebapp.azurewebsites.net";
        builder.Configuration["Jwt:Audience"] =
            "https://flashcardstebappclient.azurewebsites.net";
    }

    // Configure JWT authentication
    builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme =
                JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme =
                JwtBearerDefaults.AuthenticationScheme;
        }) // Configure the JWT Bearer authentication
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = builder.Configuration["Jwt:Issuer"]
                // Other token validation parameters
            };
        });

    WebApplication app = builder.Build();

    // Configure the HTTP request pipeline.
    app.UseStaticFiles();

    app.UseSwagger();
    app.UseSwaggerUI();

    app.UseHttpsRedirection();

    app.UseRouting();
    // Apply the CORS policy
    app.UseCors("CorsPolicy");

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();

    app.Run();
}
catch (Exception ex)
{
    // Log the exception
    ILogger<Program> logger = LoggerFactory
        .Create(builder => builder.AddConsole()).CreateLogger<Program>();
    logger.LogError(ex, "An error occurred during application startup.");
    throw;
}
