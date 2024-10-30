namespace EduPlatformAPI.DTO.Teacher
{
    public class LessonStatsDto
    {
        public int LessonId { get; set; }
        public string Title { get; set; }
        public string level { get; set; }
        public int NumberOfStudents { get; set; }
        public decimal TotalFeeCollected { get; set; }
    }
}
