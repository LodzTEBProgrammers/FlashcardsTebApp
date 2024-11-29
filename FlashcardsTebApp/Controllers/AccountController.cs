using FlashcardsServer.DTO;
using FlashcardsServer.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FlashcardsTebApp.Controllers;

[AllowAnonymous]
[ApiController]
[Route("[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly RoleManager<ApplicationRole> _roleManager;

    public AccountController(UserManager<ApplicationUser> userManager,
                             SignInManager<ApplicationUser> signInManager,
                             RoleManager<ApplicationRole> roleManager
    )
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _roleManager = roleManager;
    }

    [HttpPost]
    public async Task<ActionResult<ApplicationUser>> PostRegister(
        RegisterDTO registerDTO
    )
    {
        // Validation 
        if (ModelState.IsValid == false)
        {
            string errorMessage = string.Join(" | ", ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage));

            return BadRequest(errorMessage);
        }

        // Create  user 
        ApplicationUser user = new()
        {
            Email = registerDTO.Email,
            UserName = registerDTO.Email,
            PersonName = registerDTO.PersonName
        };

        IdentityResult result =
            await _userManager.CreateAsync(user, registerDTO.Password);

        if (result.Succeeded)
        {
            // Sign in
            await _signInManager.SignInAsync(user, false);

            return Ok(user);
        } else
        {
            string errorMessage = string.Join(" | ",
                result.Errors.Select(e => e.Description)); // Error1 | Error2

            return BadRequest(errorMessage);
        }
    }

    [HttpGet]
    public async Task<IActionResult> IsEmailAlreadyRegister(string email)
    {
        ApplicationUser user = await _userManager.FindByEmailAsync(email);

        if (user == null)
            return Ok(true);
        else
            return Ok(false);
    }
}
