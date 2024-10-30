using System;
using System.Collections.Generic;

namespace EduPlatformAPI.Models;

public partial class VerificationCode
{
    public int Id { get; set; }

    public string Email { get; set; } = null!;

    public string VerificationCode1 { get; set; } = null!;

    public DateTime ExpiryDate { get; set; }

    public bool IsUsed { get; set; }
}
