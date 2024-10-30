namespace EduPlatformAPI.DTO.Student
{
    public class UploadReceit
    {
        public IFormFile image { set; get; }
        public int id { set; get; }
        public int lessonid { set; get; }

        public string level { set; get; }

    }
}
