using System;
using System.Collections.Generic;

namespace EduPlatformAPI.Models;

public partial class Student
{
    public int StudentId { get; set; }

    public string GradeLevel { get; set; } = null!;

    public string Governorate { get; set; } = null!;

    public string ParentPhone { get; set; } = null!;

    public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();

    public virtual ICollection<FavoriteLesson> FavoriteLessons { get; set; } = new List<FavoriteLesson>();

    public virtual ICollection<StudentComment> StudentComments { get; set; } = new List<StudentComment>();

    public virtual User StudentNavigation { get; set; } = null!;
}
