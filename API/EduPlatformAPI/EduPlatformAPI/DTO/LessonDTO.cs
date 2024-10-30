namespace EduPlatformAPI.DTO
{
    public class LessonDTO
    {
        public int LessonId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string? VideoURL { get; set; }
        public string? PDFURL { get; set; }
        public string? islessonInWishlist { get; set; }
        public string? homeworkURL { get; set; }
        public string? HomeWorkEvaluation {  get; set; }
        public string? hasVideoAccess { get; set; }
        public string gradeLevel { get; set; }
        public int AccessPeriod { get; set; }
        public DateOnly UploadDate { get; set; }
        public decimal FeeAmount { get; set; }

    }
}
