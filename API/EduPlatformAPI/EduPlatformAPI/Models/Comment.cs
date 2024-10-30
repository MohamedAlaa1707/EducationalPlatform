using System;
using System.Collections.Generic;

namespace EduPlatformAPI.Models;

public partial class Comment
{
    public int CommentId { get; set; }

    public string Question { get; set; } = null!;

    public string Reply { get; set; } = null!;

    public DateTime? QuestionDate { get; set; }

    public DateTime? ReplyDate { get; set; }

    public virtual ICollection<StudentComment> StudentComments { get; set; } = new List<StudentComment>();
}
