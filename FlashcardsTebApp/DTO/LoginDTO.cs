using System.ComponentModel.DataAnnotations;

namespace FlashcardsServer.DTO;

public class LoginDTO
{
    [Required(ErrorMessage = "E-mail nie może być pusty")]
    [EmailAddress(ErrorMessage = "Niepoprawny format e-mail")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Hasło nie może być puste")]
    public string Password { get; set; } = string.Empty;
}
