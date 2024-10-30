namespace EduPlatformAPI.DTO.Teacher
{
    public class StudentSubmissionDTO
    {
        public int StudentId { get; set; }
        public string GradeLevel { get; set; }
       
       
        public string UserName { get; set; }

        public List<HomeworkSubmissionDTO> Homeworks { get; set; }
    }
}
