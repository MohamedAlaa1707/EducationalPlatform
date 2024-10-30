namespace EduPlatformAPI.DTO.Student
{
    public class uploadStudentHomework
    {
        public int id { get; set; }
        public int lessonid { get; set; }
        public string level { get; set; }
        public IFormFile homeworkpdf { get; set; }
    }
}
