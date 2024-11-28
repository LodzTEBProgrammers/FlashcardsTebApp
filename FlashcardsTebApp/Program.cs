using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.Azure.KeyVault;
using Microsoft.Azure.Services.AppAuthentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.AzureKeyVault;

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

WebApplication app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Configure the HTTP request pipeline.
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
