using System;
using System.Collections.Generic;

namespace EduPlatformAPI.Models;

public partial class Material
{
    public int MaterialId { get; set; }

    public int LessonId { get; set; }

    public string MaterialType { get; set; } = null!;

    public string MaterialLink { get; set; } = null!;

    public string Name { get; set; } = null!;

    public virtual Lesson Lesson { get; set; } = null!;
}
