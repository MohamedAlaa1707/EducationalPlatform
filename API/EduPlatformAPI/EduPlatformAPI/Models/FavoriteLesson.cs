using System;
using System.Collections.Generic;

namespace EduPlatformAPI.Models;

public partial class FavoriteLesson
{
    public int FavoriteLessonId { get; set; }

    public int StudentId { get; set; }

    public int LessonId { get; set; }

    public DateOnly DateAdded { get; set; }

    public virtual Lesson Lesson { get; set; } = null!;

    public virtual Student Student { get; set; } = null!;
}
