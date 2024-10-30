namespace EduPlatformAPI.DTO.Teacher
{
    public class QuestionAndReplyDTO
    {
        public int CommentId { get; set; }
        public string Question { get; set; } = null!;
        public string Reply { get; set; } = null!;

    }
}
