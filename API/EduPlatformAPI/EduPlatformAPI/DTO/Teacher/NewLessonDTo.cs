using static System.Runtime.InteropServices.JavaScript.JSType;

namespace EduPlatformAPI.DTO.Teacher
{
    public class NewLessonDTo
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Level { get; set; }
        public int Price { get; set; }
        public int AccessPeriod { get; set; }
        public string UploadDate { get; set; }
        public IFormFile FileVideo { get; set; }
        public IFormFile FileAttach { get; set; }
        public IFormFile HomeWork { get; set; }
    }
}
