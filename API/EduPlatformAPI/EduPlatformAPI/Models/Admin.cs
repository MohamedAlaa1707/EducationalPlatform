using System;
using System.Collections.Generic;

namespace EduPlatformAPI.Models;

public partial class Admin
{
    public int AdminId { get; set; }

    public virtual User AdminNavigation { get; set; } = null!;
}
