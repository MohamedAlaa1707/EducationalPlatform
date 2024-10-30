using System;
using System.Collections.Generic;

namespace EduPlatformAPI.Models;

public partial class Teacher
{
    public int TeacherId { get; set; }

    public virtual ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();

    public virtual User TeacherNavigation { get; set; } = null!;
}
