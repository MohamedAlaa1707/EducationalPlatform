using EduPlatformAPI.DTO;
using EduPlatformAPI.DTO.Student;
using EduPlatformAPI.DTO.Teacher;
using EduPlatformAPI.DTO.User;
using EduPlatformAPI.Hubs;
using EduPlatformAPI.Models;
using EduPlatformAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Security.Claims;

namespace EduPlatformAPI.Controllers
{
    //  [Authorize(Policy = "StudentOnly")]
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly EduPlatformDbContext context;
        private readonly LessonService vidSer;
        private readonly MediaController videos;
        private readonly IHubContext<ClassroomHub> _hubContext;

        public StudentController(EduPlatformDbContext context, LessonService vidSer, MediaController videos, IHubContext<ClassroomHub> hubContext)
        {
            this.context = context;
            this.vidSer = vidSer;
            this.videos = videos;
            _hubContext = hubContext;

        }


        [HttpGet("GetStudentInfo")]
        public IActionResult GetStudentInfo()
        {
            var username = User.Identity.Name;
            var id = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrWhiteSpace(id) || !int.TryParse(id, out var newID))
            {
                return BadRequest("Invalid student ID.");
            }

            var student = context.Students.FirstOrDefault(s => s.StudentId == newID);

            if (student == null)
            {
                return NotFound("Student not found.");
            }

            var gradeLevel = student.GradeLevel;
            var lessons = GetLessonsByGradeLevel(gradeLevel, int.Parse(id)) as OkObjectResult;

            if (lessons == null || lessons.Value == null)
            {
                return NotFound("No lessons found for the student's grade level.");
            }

            return Ok(new
            {
                StudentInfo = new
                {
                    username,
                    id = newID,
                    gradeLevel
                },
                lessons = lessons.Value
            });
        }


        [HttpGet("GetLessonsByGradeLevel/{gradeLevel}")]
        public IActionResult GetLessonsByGradeLevel(string gradeLevel, int id)
        {
            if (string.IsNullOrWhiteSpace(gradeLevel))
            {
                return BadRequest("Grade level cannot be null or empty.");
            }

            var NewLevel = gradeLevel switch
            {
                "F" or "f" => "One",
                "S" or "s" => "Two",
                "T" or "t" => "Three",
                _ => null
            };

            // Fetch all lesson IDs in the wishlist for the student
            var lessonIdsInWishlist = context.FavoriteLessons
                .Where(f => f.StudentId == id)
                .Select(f => f.LessonId)
                .ToList();

            var lessons = context.Lessons
                .Where(l => l.GradeLevel.ToLower() == gradeLevel.ToLower())
                .Select(l => new
                {
                    l.LessonId,
                    l.Title,
                    l.AccessPeriod,
                    l.Description,
                    VideoURL = vidSer.GetMediaURL(HttpContext, NewLevel, "Video",
                        context.Materials.Where(s => s.LessonId == l.LessonId && s.MaterialType == "Video")
                        .Select(w => w.MaterialLink)
                        .FirstOrDefault() ?? ""),
                    PDFURL = vidSer.GetMediaURL(HttpContext, NewLevel, "PDF",
                        context.Materials.Where(s => s.LessonId == l.LessonId && s.MaterialType == "PDF" && s.Name == "")
                        .Select(w => w.MaterialLink)
                        .FirstOrDefault() ?? ""),
                    homeworkURL = vidSer.GetMediaURL(HttpContext, NewLevel, "PDF",
                        context.Materials.Where(s => s.LessonId == l.LessonId && s.MaterialType == "PDF" && s.Name == "Homework")
                        .Select(w => w.MaterialLink)
                        .FirstOrDefault() ?? ""),
                    HomeWorkEvaluation = context.Enrollments
                        .Where(e => e.LessonId == l.LessonId && e.StudentId == id)
                        .Select(e => e.HomeWorkEvaluation).FirstOrDefault(),
                    l.UploadDate,
                    l.FeeAmount,
                    islessonInWishlist = lessonIdsInWishlist.Contains(l.LessonId) ? "Yes" : "NO"
                })
                .ToList();

            if (!lessons.Any())
            {
                return NotFound($"No lessons found for grade level: {gradeLevel}");
            }

            var lessonDTOs = lessons.Select(l => new LessonDTO
            {
                LessonId = l.LessonId,
                Title = l.Title,
                Description = l.Description,
                VideoURL = l.VideoURL,
                PDFURL = l.PDFURL,
                hasVideoAccess = HasVideoAccess(id, l.LessonId),
                UploadDate = l.UploadDate,
                FeeAmount = l.FeeAmount,
                AccessPeriod = l.AccessPeriod,
                homeworkURL = l.homeworkURL,
                HomeWorkEvaluation = l.HomeWorkEvaluation,
                islessonInWishlist = l.islessonInWishlist

            }).ToList();

            return Ok(lessonDTOs);
        }


        private string HasVideoAccess(int studentID, int lessonID)
        {
            var enrollment = context.Enrollments.FirstOrDefault(e => e.LessonId == lessonID && e.StudentId == studentID);
            var currentDate = DateTime.Now;



            if (enrollment == null || enrollment.AccessEndDate < currentDate || enrollment.ReceiptStatus == "reject")
            {
                return "NO";
            }

            if (enrollment.ReceiptStatus == "Pending")
            {
                return "Pending";
            }

            if (enrollment.AccessEndDate >= currentDate && enrollment.ReceiptStatus == "accept")
            {
                return "Yes";
            }

            return "NO";
        }


        private string islessonInWishlist(int studentID, int lessonID)
        {
            var lesson = context.FavoriteLessons.FirstOrDefault(e => e.LessonId == lessonID && e.StudentId == studentID);


            if (lesson == null)
            {
                return "NO";
            }

            return "Yes";

        }
        [HttpGet("GetFavoriteLessons/{studentId}")]
        public IActionResult GetFavoriteLessons(int studentId)
        {
            if (studentId <= 0)
            {
                return BadRequest("Invalid student ID.");
            }

            var favoriteLessons = context.FavoriteLessons
               .Where(e => e.StudentId == studentId).OrderByDescending(l => l.DateAdded)
               .Select(l => new FavoriteLessonDto
               {
                   LessonId = l.LessonId,
                   Title = l.Lesson.Title,
                   Description = l.Lesson.Description,
                   FeeAmount = l.Lesson.FeeAmount,
                   UploadDate = l.Lesson.UploadDate,
               }

                   )
               .ToList();



            if (!favoriteLessons.Any())
            {
                return NotFound("No favorite lessons found.");
            }

            return Ok(favoriteLessons);
        }



        [HttpPost("ChangePassword")]
        public IActionResult ChangePassword([FromBody] studentChangepasswordDTO changePasswordDto)
        {

            var user = context.Users.FirstOrDefault(u => u.Email == changePasswordDto.Email);

            if (user == null)
            {
                return NotFound("User not found.");
            }


            if (!user.Role.Equals("S", StringComparison.OrdinalIgnoreCase))
            {
                return Forbid("User is not a student.");
            }


            if (user.Password != changePasswordDto.OldPassword)
            {
                return BadRequest("Old password is incorrect.");
            }

            if (string.IsNullOrWhiteSpace(changePasswordDto.NewPassword) || changePasswordDto.NewPassword.Length < 6)
            {
                return BadRequest("New password must be at least 6 characters long.");
            }


            user.Password = changePasswordDto.NewPassword;
            context.SaveChanges();

            return Ok();
        }


        [HttpPost("UploadHomework")]
        public IActionResult UloadStudentHomework([FromForm] uploadStudentHomework newHomework)
        {
            if (ModelState.IsValid)
            {


                var enrr = context.Enrollments.Where(e => e.StudentId == newHomework.id && newHomework.lessonid == e.LessonId).FirstOrDefault();
                if (enrr == null)
                {
                    return BadRequest();
                }


                if (newHomework.homeworkpdf != null)
                {

                    var videoUploadResult = videos.UploadVideo(newHomework.homeworkpdf, newHomework.level, "PDFHomework");

                    enrr.SubmissionLink = newHomework.homeworkpdf.FileName;
                    enrr.SubmissionDate = DateTime.Now;
                    enrr.HomeWorkEvaluation = "Pending";
                    context.SaveChanges();
                }





                return Ok();
            }


            return BadRequest();


        }

        [HttpPost("setQuestionforStudentinlesson")]
        public async Task<IActionResult> setQuestionforStudentinlesson(getallquestionandreply g)
        {
            var enr = await context.Enrollments.FirstOrDefaultAsync(e => e.LessonId == g.lessonid && e.StudentId == g.studentid);
            if (enr == null)
            {
                return BadRequest(new { Message = "Student is not enrolled in this lesson." });
            }

            var comment = new Comment()
            {
                Question = g.question,
                Reply = "",
                QuestionDate = DateTime.Now
            };

            await context.Comments.AddAsync(comment);
            await context.SaveChangesAsync();

            var commentstudent = new StudentComment()
            {
                CommentId = comment.CommentId,
                EnrollmentId = enr.EnrollmentId,
                StudentId = g.studentid,
                LessonId = g.lessonid,
            };

            await context.StudentComments.AddAsync(commentstudent);
            await context.SaveChangesAsync();

            var username = context.Users.FirstOrDefault(s => s.UserId == g.studentid).Name;
            await _hubContext.Clients.All.SendAsync("SendStudentMessage", username, g.question, comment.CommentId);

            return Ok(new { Message = "Question submitted successfully." });
        }

        [HttpPost("getallquestionandreply")]

        public IActionResult getallquestionandreply(getallquestionandreply s)
        {
            var studentcoment = context.StudentComments.Where(e => e.LessonId == s.lessonid && e.StudentId == s.studentid).Select(s => s.Comment);

            return Ok(studentcoment);
        }





        [HttpGet("studentLessons/{studentId}")]
        public IActionResult GetStudentLessons(int studentId)
        {
            var currentDate = DateTime.Now.Date;

            var gradeLevel = context.Students.FirstOrDefault(s => s.StudentId == studentId).GradeLevel;

            var NewLevel = gradeLevel switch
            {
                "F" or "f" => "One",
                "S" or "s" => "Two",
                "T" or "t" => "Three",
                _ => null
            };

            var lessons = from enrollment in context.Enrollments
                          join lesson in context.Lessons on enrollment.LessonId equals lesson.LessonId
                          where lesson.GradeLevel == gradeLevel
                          join materialPdf in context.Materials on lesson.LessonId equals materialPdf.LessonId into pdfGroup
                          from pdfMaterial in pdfGroup.Where(m => m.MaterialType == "PDF").DefaultIfEmpty()
                          join homeworkMaterial in context.Materials on lesson.LessonId equals homeworkMaterial.LessonId into homeworkGroup
                          from homework in homeworkGroup.Where(m => m.MaterialType == "PDF" && m.Name == "Homework").DefaultIfEmpty()
                          join materialVideo in context.Materials on lesson.LessonId equals materialVideo.LessonId into videoGroup
                          from videoMaterial in videoGroup.Where(m => m.MaterialType == "Video").DefaultIfEmpty()
                          where enrollment.StudentId == studentId
                          select new
                          {
                              Enrollment = enrollment,
                              LessonId = lesson.LessonId,
                              Title = lesson.Title,
                              Description = lesson.Description,
                              FeeAmount = lesson.FeeAmount,
                              GradeLevel = lesson.GradeLevel,
                              VideoURL = vidSer.GetMediaURL(HttpContext, NewLevel, "Video",
                        context.Materials.Where(s => s.LessonId == lesson.LessonId && s.MaterialType == "Video")
                        .Select(w => w.MaterialLink)
                        .FirstOrDefault() ?? ""),
                              PDFURL = vidSer.GetMediaURL(HttpContext, NewLevel, "PDF",
                        context.Materials.Where(s => s.LessonId == lesson.LessonId && s.MaterialType == "PDF" && s.Name == "")
                        .Select(w => w.MaterialLink)
                        .FirstOrDefault() ?? ""),
                              homeworkURL = vidSer.GetMediaURL(HttpContext, NewLevel, "PDF",
                        context.Materials.Where(s => s.LessonId == lesson.LessonId && s.MaterialType == "PDF" && s.Name == "Homework")
                        .Select(w => w.MaterialLink)
                        .FirstOrDefault() ?? ""),

                              UploadDate = lesson.UploadDate,
                              acc = lesson.AccessPeriod,

                              HomeWorkEvaluation = context.Enrollments
                        .Where(e => e.LessonId == lesson.LessonId && e.StudentId == studentId)
                        .Select(e => e.HomeWorkEvaluation).FirstOrDefault()
                          };

            var filteredLessons = lessons
                .AsEnumerable()
                .Where(x => x.Enrollment.AccessStartDate.HasValue && (currentDate - x.Enrollment.AccessStartDate.Value).TotalDays <= x.acc)
                     .GroupBy(x => x.LessonId)
    .Select(g => g.First())
    .ToList();

            if (!filteredLessons.Any())
            {
                return Ok("You are not enrolled in any course.");
            }

            var result = filteredLessons.Select(x => new ShowStudentLessonsDTO
            {
                LessonId = x.LessonId,
                Title = x.Title,
                Description = x.Description,
                FeeAmount = x.FeeAmount,
                GradeLevel = x.GradeLevel,
                homeworkURL = x.homeworkURL,
                PDFURL = x.PDFURL,
                videoURL = x.VideoURL,
                UploadDate = x.UploadDate,
                HomeWorkEvaluation = x.HomeWorkEvaluation
            }).ToList();

            return Ok(result);
        }




        [HttpPost("UploadReceit")]
        public IActionResult UploadReceit([FromForm] UploadReceit newHomework)
        {
            if (ModelState.IsValid)
            {


                if (newHomework.image != null)
                {


                    var receit = new Receipt()
                    {

                        AdminReviewed = "N",
                        UploadDate = DateTime.Now,
                        ReceiptImageLink = newHomework.image.FileName,

                    };
                    context.Receipts.Add(receit);

                    context.SaveChanges();

                    var videoUploadResult = videos.UploadVideo(newHomework.image, newHomework.level, "ReceiptImages");

                    var enr = new Enrollment()
                    {
                        LessonId = newHomework.lessonid,
                        StudentId = newHomework.id,
                        ReceiptId = receit.ReceiptId,
                        AccessStartDate = null,
                        AccessEndDate = null,
                        SubmissionDate = null,
                        SubmissionLink = "",
                        HomeWorkEvaluation = "",
                        UserName = "",
                        Password = "",
                        ReceiptStatus = "Pending"



                    };
                    context.Enrollments.Add(enr);
                    context.SaveChanges();

                    var FavoriteLesson = context.FavoriteLessons.FirstOrDefault(i => i.StudentId == newHomework.id && i.LessonId == newHomework.lessonid);
                    if (FavoriteLesson != null)
                    {
                        RemoveWishlist(newHomework.id, newHomework.lessonid);


                    }



                }





                return Ok();
            }


            return BadRequest();


        }

        [HttpDelete("RemoveWishlist")]

        public IActionResult RemoveWishlist(int studentid, int lessonid)
        {


            var wish = context.FavoriteLessons.FirstOrDefault(i => i.StudentId == studentid && i.LessonId == lessonid);
            if (wish == null)
            {


                return NotFound();
            }
            context.FavoriteLessons.Remove(wish);
            context.SaveChanges();
            return Ok();


        }



        [HttpGet("addtoWishlist")]
        public IActionResult addtoWishlist(int studentid, int lessonid)
        {


            var wish = context.FavoriteLessons.FirstOrDefault(i => i.StudentId == studentid && i.LessonId == lessonid);
            if (wish == null)
            {

                var newwish = new FavoriteLesson
                {
                    LessonId = lessonid,
                    StudentId = studentid,
                    DateAdded = DateOnly.FromDateTime(DateTime.Now)
                };
                context.FavoriteLessons.Add(newwish);
                context.SaveChanges();

                return Ok();

            };


            return BadRequest(new { message = "The lesson has already been added." });
        }


        [HttpGet("commonQA/{gradeLevel}")]
        public async Task<IActionResult> GetQuestionsByGradeLevel(string gradeLevel)
        {

            if (string.IsNullOrEmpty(gradeLevel))
            {
                return BadRequest("Grade level is required.");
            }


            var questions = await context.SelectedQuestions
                .Where(q => q.GradeLevel.ToUpper() == gradeLevel)
                .Select(q => new QAStudent
                {
                    GradeLevel = q.GradeLevel,
                    LessonName = q.LessonName,
                    QuestionText = q.QuestionText,
                    ReplyText = q.ReplyText,

                    Id = q.Id
                })
                .ToListAsync();


            if (!questions.Any())
            {
                return NotFound("No questions found for the specified grade level.");
            }

            return Ok(questions);
        }



        [HttpGet("AddNewEnrollmen")]
        public IActionResult AddNewEnrollmen(int studentid, int lessonid)
        {

            if (lessonid == null || studentid == null)
            {
                return BadRequest();
            }

            var AccessPeriod = context.Lessons.FirstOrDefault(i => i.LessonId == lessonid).AccessPeriod;
            if (AccessPeriod == 0)
            {
                AccessPeriod = 14;

            }

            var enr = new Enrollment()
            {
                LessonId = lessonid,
                StudentId = studentid,
                ReceiptId = 1024,
                AccessStartDate = DateTime.Now,
                AccessEndDate = DateTime.Now.AddDays(AccessPeriod),
                SubmissionDate = null,
                SubmissionLink = "",
                HomeWorkEvaluation = "",
                UserName = "",
                Password = "",
                ReceiptStatus = "accept"



            };
            context.Enrollments.Add(enr);
            context.SaveChanges();
            return Ok();




        }






    }
}