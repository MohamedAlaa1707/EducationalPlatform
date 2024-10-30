using System;
using System.Collections.Generic;

namespace EduPlatformAPI.Models;

public partial class User
{
    public int UserId { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public string Role { get; set; } = null!;

    public DateOnly RegistrationDate { get; set; }

    public DateOnly? LastLoginDate { get; set; }

    public virtual Admin? Admin { get; set; }

    public virtual Student? Student { get; set; }

    public virtual Teacher? Teacher { get; set; }
}
