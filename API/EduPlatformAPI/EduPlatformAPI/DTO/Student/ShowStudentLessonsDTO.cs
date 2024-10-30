namespace EduPlatformAPI.DTO.Student
{
    public class ShowStudentLessonsDTO
    {
        public int LessonId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal FeeAmount { get; set; }
        public string GradeLevel { get; set; }
        public string homeworkURL { get; set; }
        public string PDFURL { get; set; }
        public string videoURL { get; set; }
        public DateOnly UploadDate { get; set; }
        public string HomeWorkEvaluation { get; set; }
    }
}
