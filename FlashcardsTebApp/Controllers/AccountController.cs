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
    private static List<User> users = new();
    private readonly PasswordHasher<User> _passwordHasher = new();

    [HttpPost("register")]
    public IActionResult Register([FromBody] User user)
    {
        if (users.Any(u => u.Username == user.Username))
            return BadRequest("Username already exists.");

        user.Id = users.Count + 1;
        user.Password = _passwordHasher.HashPassword(user, user.Password);
        users.Add(user);
        return Ok("User registered successfully.");
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] User login)
    {
        User? user = users.SingleOrDefault(u => u.Username == login.Username);
        if (user == null ||
            _passwordHasher.VerifyHashedPassword(user, user.Password,
                login.Password) == PasswordVerificationResult.Failed)
            return Unauthorized("Invalid username or password.");

        return Ok("Login successful.");
    }
}
