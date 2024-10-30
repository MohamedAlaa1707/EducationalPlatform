using System;
using System.Collections.Generic;

namespace EduPlatformAPI.Models;

public partial class Lesson
{
    public int LessonId { get; set; }

    public int TeacherId { get; set; }

    public string GradeLevel { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string Title { get; set; } = null!;

    public DateOnly UploadDate { get; set; }

    public decimal FeeAmount { get; set; }

    public int AccessPeriod { get; set; }

    public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();

    public virtual ICollection<FavoriteLesson> FavoriteLessons { get; set; } = new List<FavoriteLesson>();

    public virtual ICollection<Material> Materials { get; set; } = new List<Material>();

    public virtual ICollection<StudentComment> StudentComments { get; set; } = new List<StudentComment>();

    public virtual Teacher Teacher { get; set; } = null!;
}
