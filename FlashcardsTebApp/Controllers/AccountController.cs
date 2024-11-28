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

    public AccountController(SampleDatabaseContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] User user)
    {
        if (_context.Users.Any(u => u.Username == user.Username))
            return BadRequest("Username already exists.");

        user.Password = _passwordHasher.HashPassword(user, user.Password);
        _context.Users.Add(user);
        _context.SaveChanges();
        return Ok("User registered successfully.");
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] User login)
    {
        User? user =
            _context.Users.SingleOrDefault(u => u.Username == login.Username);
        if (user == null ||
            _passwordHasher.VerifyHashedPassword(user, user.Password,
                login.Password) == PasswordVerificationResult.Failed)
            return Unauthorized("Invalid username or password.");

        return Ok("Login successful.");
    }
}
