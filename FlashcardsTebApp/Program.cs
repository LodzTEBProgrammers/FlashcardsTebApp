using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.Azure.KeyVault;
using Microsoft.Azure.Services.AppAuthentication;
using Microsoft.Extensions.Configuration.AzureKeyVault;
using Microsoft.EntityFrameworkCore;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

if (builder.Environment.IsProduction())
{
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

    builder.Services.AddDbContext<SampleDatabaseContext>(
        options =>
        {
            options.UseSqlServer(client.GetSecret("ProdConnection").Value.Value
                .ToString());
        });
}


if (builder.Environment.IsDevelopment())
    builder.Services.AddDbContext<SampleDatabaseContext>(
        options =>
        {
            options.UseSqlServer(
                builder.Configuration.GetConnectionString("DefaultConnection"));
        });

WebApplication app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
