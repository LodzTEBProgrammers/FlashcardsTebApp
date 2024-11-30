using System.Security.Claims;
using FlashcardsServer.DTO;
using FlashcardsServer.Identity;
using FlashcardsServer.ServiceContracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

    /// <summary>
    /// 
    /// </summary>
    /// <param name="userManager"></param>
    /// <param name="signInManager"></param>
    /// <param name="roleManager"></param>
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

    /// <summary>
    /// 
    /// </summary>
    /// <param name="registerDto"></param>
    /// <returns></returns>
    [HttpPost]
    public async Task<ActionResult<ApplicationUser>> PostRegister(
        RegisterDTO registerDto
    )
    {
        // Validation
        if (ModelState.IsValid == false)
        {
            string errorMessage = string.Join(" | ", ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage));

            return Problem(errorMessage);
        }

        // Create User
        ApplicationUser user = new()
        {
            Email = registerDto.Email,
            UserName = registerDto.Email,
            PersonName = registerDto.PersonName
        };

        IdentityResult result =
            await _userManager.CreateAsync(user, registerDto.Password);

        if (result.Succeeded)
        {
            // Sign-in 
            await _signInManager.SignInAsync(user, false);

            AuthenticationResponse authenticationResponse =
                _jwtService.CreateJwtToken(user);

            user.RefreshToken = authenticationResponse.RefreshToken;
            user.RefreshTokenExpirationDateTime = authenticationResponse
                .RefreshTokenExpirationDateTime;
            await _userManager.UpdateAsync(user);

            return Ok(authenticationResponse);
        } else
        {
            string errorMessage = string.Join(" | ",
                result.Errors.Select(e => e.Description));
            return Problem(errorMessage);
        }
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="email"></param>
    /// <returns></returns>
    [HttpGet]
    public async Task<IActionResult> IsEmailAlreadyRegistered(string email)
    {
        ApplicationUser? user = await _userManager.FindByEmailAsync(email);

        if (user == null) return Ok(true);

        return Ok($"Email {email} is already in use");
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="loginDto"></param>
    /// <returns></returns>
    [HttpPost]
    public async Task<ActionResult<ApplicationUser>> PostLogin(LoginDTO loginDto
    )
    {
        // Validation
        if (ModelState.IsValid == false)
        {
            string errorMessage = string.Join(" | ", ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage));

            return Problem(errorMessage);
        }

        SignInResult result = await _signInManager.PasswordSignInAsync(
            loginDto.Email,
            loginDto.Password, false, false);

        if (result.Succeeded)
        {
            ApplicationUser? user =
                await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null) return NotFound();

            // Sign-in 
            await _signInManager.SignInAsync(user, false);

            AuthenticationResponse authenticationResponse =
                _jwtService.CreateJwtToken(user);

            // Ensure refresh token is created and saved
            user.RefreshToken = authenticationResponse.RefreshToken;
            user.RefreshTokenExpirationDateTime = authenticationResponse
                .RefreshTokenExpirationDateTime;
            IdentityResult updateResult = await _userManager.UpdateAsync(user);

            if (!updateResult.Succeeded)
            {
                string errorMessage = string.Join(" | ",
                    updateResult.Errors.Select(e => e.Description));
                return Problem(errorMessage);
            }

            return Ok(authenticationResponse);
        }

        return Problem("Invalid email or password.");
    }

    /// <summary>
    /// 
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public async Task<ActionResult<ApplicationUser>> GetLogout()
    {
        await _signInManager.SignOutAsync();

        return NoContent();
    }

    [HttpPost("generate-new-jwt-token")]
    public async Task<IActionResult> GenerateNewAccessToken(
        TokenModel tokenModel
    )
    {
        if (tokenModel == null) return BadRequest("Invalid client request");

        ClaimsPrincipal? principal =
            _jwtService.GetPrincipalFromJwtToken(tokenModel.Token);
        if (principal == null) return BadRequest("Invalid jwt access token");

        string? email = principal.FindFirstValue(ClaimTypes.Email);

        ApplicationUser? user = await _userManager.FindByEmailAsync(email);

        if (user == null || user.RefreshToken != tokenModel.RefreshToken ||
            user.RefreshTokenExpirationDateTime <= DateTime.Now)
            return BadRequest("Invalid refresh token");

        AuthenticationResponse authenticationResponse =
            _jwtService.CreateJwtToken(user);

        user.RefreshToken = authenticationResponse.RefreshToken;
        user.RefreshTokenExpirationDateTime =
            authenticationResponse.RefreshTokenExpirationDateTime;

        await _userManager.UpdateAsync(user);

        return Ok(authenticationResponse);
    }

    // LIST OF USERS
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ApplicationUser>>> GetUsers()
    {
        // If Users are not found
        if (_userManager.Users.Count() == 0) return NotFound();


        List<ApplicationUser> users = await _userManager.Users.ToListAsync();

        return Ok(users);
    }
}
