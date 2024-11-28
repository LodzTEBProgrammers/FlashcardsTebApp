using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using FlashcardsServer.Models;
using System.Collections.Generic;
using System.Linq;

namespace FlashcardsTebApp.Controllers;

[ApiController]
[Route("[controller]")]
public class AccountController : ControllerBase
{
    private readonly SampleDatabaseContext _context;
    private readonly PasswordHasher<User> _passwordHasher = new();
    private readonly ILogger<AccountController> _logger;

    public AccountController(SampleDatabaseContext context,
                             ILogger<AccountController> logger
    )
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] User user)
    {
        _logger.LogInformation("Register attempt for username: {Username}",
            user.Username);

        if (_context.Users.Any(u => u.Username == user.Username))
        {
            _logger.LogWarning("Username already exists: {Username}",
                user.Username);
            return BadRequest(new { message = "Username already exists." });
        }

        user.Password = _passwordHasher.HashPassword(user, user.Password);
        _context.Users.Add(user);
        _context.SaveChanges();
        _logger.LogInformation("User registered successfully: {Username}",
            user.Username);
        return Ok(new { message = "User registered successfully." });
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] User login)
    {
        _logger.LogInformation("Login attempt for username: {Username}",
            login.Username);

        User? user =
            _context.Users.SingleOrDefault(u => u.Username == login.Username);
        if (user == null ||
            _passwordHasher.VerifyHashedPassword(user, user.Password,
                login.Password) == PasswordVerificationResult.Failed)
        {
            _logger.LogWarning("Invalid login attempt for username: {Username}",
                login.Username);
            return Unauthorized(new
                { message = "Invalid username or password." });
        }

        _logger.LogInformation("Login successful for username: {Username}",
            login.Username);
        return Ok(new { message = "Login successful." });
    }
}
