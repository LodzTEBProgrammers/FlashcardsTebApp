using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace FlashcardsServer.DTO;

public class RegisterDTO
{
    [Required(ErrorMessage = "Nazwa użytkownika nie może być pusta")]
    public string PersonName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Hasło nie może być puste")]
    [EmailAddress(ErrorMessage = "E-mail musi być w odpowiednim formacie.")]
    [Remote("IsEmailAlreadyRegister", "Account",
        ErrorMessage = "Ten E-mail jest już zajęty!")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Hasło nie może być puste")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Hasło Potwierdzające nie może być puste")]
    [Compare("Password", ErrorMessage = "Hasła nie są takie same")]
    public string ConfirmPassword { get; set; } = string.Empty;
}
