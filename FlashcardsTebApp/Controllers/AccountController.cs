using FlashcardsServer.DTO;
using FlashcardsServer.Identity;
using FlashcardsServer.ServiceContracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using IApplicationLifetime = Microsoft.AspNetCore.Hosting.IApplicationLifetime;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace FlashcardsTebApp.Controllers;

[AllowAnonymous]
[ApiController]
[Route("[controller]/[action]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly IJwtService _jwtService;

    public AccountController(UserManager<ApplicationUser> userManager,
                             SignInManager<ApplicationUser> signInManager,
                             RoleManager<ApplicationRole> roleManager,
                             IJwtService jwtService
    )
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _roleManager = roleManager;
        _jwtService = jwtService;
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

            AuthenticationResponse authenticationResponse =
                _jwtService.CreateJwtToken(user);

            return Ok(authenticationResponse);
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

    [HttpPost]
    public async Task<ActionResult<ApplicationUser>> PostLogin(LoginDTO loginDTO
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

        // Sign in
        SignInResult result = await _signInManager.PasswordSignInAsync(
            loginDTO.Email,
            loginDTO.Password,
            false, false);

        if (result.Succeeded)
        {
            ApplicationUser? user =
                await _userManager.FindByEmailAsync(loginDTO.Email);

            if (user == null)
                return NoContent();

            // Sign in
            await _signInManager.SignInAsync(user, false);

            AuthenticationResponse authenticationResponse =
                _jwtService.CreateJwtToken(user);

            return Ok(authenticationResponse);
        }

        return BadRequest("Niepoprawne dane logowania");
    }

    [HttpGet]
    public async Task<IActionResult> GetLogout()
    {
        await _signInManager.SignOutAsync();

        return NoContent();
    }
}
