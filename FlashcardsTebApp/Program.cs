using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.Azure.KeyVault;
using Microsoft.Azure.Services.AppAuthentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.AzureKeyVault;

try
{
    WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

    // Add services to the container.
    builder.Services.AddControllers();

    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

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

    WebApplication app = builder.Build();

    // Configure the HTTP request pipeline.

    app.UseSwagger();
    app.UseSwaggerUI();

    app.UseHttpsRedirection();

    // Apply the CORS policy
    app.UseCors("CorsPolicy");

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
