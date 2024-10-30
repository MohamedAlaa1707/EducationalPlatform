namespace EduPlatformAPI.DTO.Student
{
    public class FavoriteLessonDto
    {
        public int LessonId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal FeeAmount { get; set; }
        public DateOnly UploadDate { get; set; }
    }
}
