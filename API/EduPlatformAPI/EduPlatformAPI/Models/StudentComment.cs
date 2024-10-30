using System;
using System.Collections.Generic;

namespace EduPlatformAPI.Models;

public partial class StudentComment
{
    public int StudentCommentId { get; set; }

    public int CommentId { get; set; }

    public int LessonId { get; set; }

    public int StudentId { get; set; }

    public int EnrollmentId { get; set; }

    public virtual Comment Comment { get; set; } = null!;

    public virtual Enrollment Enrollment { get; set; } = null!;

    public virtual Lesson Lesson { get; set; } = null!;

    public virtual Student Student { get; set; } = null!;
}
