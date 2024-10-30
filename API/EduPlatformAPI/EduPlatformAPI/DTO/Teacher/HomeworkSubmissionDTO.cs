namespace EduPlatformAPI.DTO.Teacher
{
    public class HomeworkSubmissionDTO
    {
        public int StudentId { get; set; }
        public string GradeLevel { get; set; }
        public string UserName { get; set; }
        public int LessonId { get; set; }
        public string LessonTitle { get; set; }
        public DateTime SubmissionDate { get; set; }
        public string SubmissionLink { get; set; }
        public string HomeWorkEvaluation { get; set; }
    }
}
