namespace EduPlatformAPI.DTO.Teacher
{
    public class StudentCommentDTO
    {

        public int CommentId { get; set; }
        public int userid { get; set; }
        public string StudentName { get; set; }
        public string GradeLevel { get; set; }
        public string Question { get; set; }
        public string TitleLesson { get; set; }
        public DateTime? QuestionDate { get; set; }

    }
}
