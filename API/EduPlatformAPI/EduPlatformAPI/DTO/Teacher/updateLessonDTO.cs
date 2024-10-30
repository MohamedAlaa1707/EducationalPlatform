namespace EduPlatformAPI.DTO.Teacher
{
    public class updateLessonDTO
    {

        public int LessonId { get; set; }
        public string GradeLevel { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public IFormFile? VideoURL { get; set; }
        public IFormFile? PDFURL { get; set; }
        public IFormFile? HomeWork { get; set; }
        public string? hasVideoAccess { get; set; }
        public int AccessPeriod { get; set; }
        public DateOnly UploadDate { get; set; }
        public decimal FeeAmount { get; set; }
    }
}
