using System;
using System.Collections.Generic;

namespace EduPlatformAPI.Models;

public partial class SelectedQuestion
{
    public int Id { get; set; }

    public string? GradeLevel { get; set; }

    public string? LessonName { get; set; }

    public string? QuestionText { get; set; }

    public string? ReplyText { get; set; }
}
