using System.ComponentModel.DataAnnotations;

namespace FlashcardsServer.Models;

public class User
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Username is required.")]
    [StringLength(30,
        ErrorMessage = "Username cannot be longer than 30 characters.")]
    public string Username { get; set; }

    [Required(ErrorMessage = "Password is required.")]
    [StringLength(100, MinimumLength = 8,
        ErrorMessage = "Password must be at least 8 characters long.")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$",
        ErrorMessage =
            "Password must contain at least one uppercase letter, one lowercase letter, and one number.")]
    public string Password { get; set; }
}
