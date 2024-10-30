using EduPlatformAPI.DTO.Teacher;
using EduPlatformAPI.DTO;
using EduPlatformAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using EduPlatformAPI.Services;
using Microsoft.EntityFrameworkCore;
using EduPlatformAPI.DTO.Admin;
using EduPlatformAPI.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace EduPlatformAPI.Controllers
{
   // [Authorize(Policy = "TeacherOnly")]
    [Route("api/[controller]")]
    [ApiController]
    public class TeacherController : ControllerBase
    {
        private readonly IHubContext<ClassroomHub> _hubContext;
        private readonly EduPlatformDbContext context;
        private readonly LessonService vidSer;
        private readonly MediaController videos;
        public TeacherController(EduPlatformDbContext context , LessonService vidSer , MediaController videos , IHubContext<ClassroomHub> hubContext)
        {
            this.context = context;
            this.vidSer = vidSer;
            this.videos = videos;
            _hubContext = hubContext;
        }
    
        [HttpGet("GetLevelsWithLessonCount")]
        public IActionResult GetLevelsWithLessonCount()
        {

            var levelsWithLessonCount = context.Lessons
                .GroupBy(l => l.GradeLevel)
                .Select(g => new LevelAndLessonsInsideDTO
                {
                    GradeLevel = g.Key,
                    NumberOfLessons = g.Count(),
                    //Lessons = g.Select(l => new LessonDTO
                    //{
                       
                    //    LessonId = l.LessonId,
                    //    Title = l.Title,

         
                    //  Description= l.Description, 
                    // UploadDate  =l.UploadDate,
                    // FeeAmount  = l.FeeAmount,

                    //}).ToList()
                })
                .ToList();

            return Ok(levelsWithLessonCount);
        }

        [HttpGet("GetLessonsWithDescriptions")]
        public IActionResult GetLessonsWithDescriptions()
        {
            var lessonsWithDescriptions = context.Lessons
                .Select(l => new LessonDTO
                {
                    LessonId = l.LessonId,
                    Title = l.Title,
                    Description = l.Description,
                    UploadDate = l.UploadDate,
                    FeeAmount = l.FeeAmount
                })
                .ToList();

            return Ok(lessonsWithDescriptions);
        }

        [HttpGet("GetStudentsWithSubmittedHomeworks")]
        public IActionResult GetStudentsWithSubmittedHomeworks()
        {
           
            var homeworksWithPendingEvaluation = context.Students
                .SelectMany(s => s.Enrollments
                    .Where(e => e.SubmissionDate != null && e.HomeWorkEvaluation == "pending")
                    .Select(e => new
                    {
                        StudentId = s.StudentId,
                        GradeLevel = s.GradeLevel,
                        UserName = context.Users.Where(d => d.UserId == s.StudentId).Select(u => u.Name).FirstOrDefault(),
                        LessonId = e.LessonId,
                        LessonTitle = e.Lesson.Title,
                        HomeWorkEvaluation = e.HomeWorkEvaluation,
                        SubmissionDate = e.SubmissionDate.Value,
                        SubmissionLink = e.SubmissionLink
                    })
                )
                .ToList(); 

          
            var result = homeworksWithPendingEvaluation.Select(hw => new HomeworkSubmissionDTO
            {
                StudentId = hw.StudentId,
                GradeLevel = hw.GradeLevel,
                UserName = hw.UserName,
                LessonId = hw.LessonId,
                LessonTitle = hw.LessonTitle,
                HomeWorkEvaluation = hw.HomeWorkEvaluation,
                SubmissionDate = hw.SubmissionDate,
                SubmissionLink = vidSer.GetMediaURL(HttpContext, newlevel(hw.GradeLevel), "PDFHomework", hw.SubmissionLink),
            }).ToList();

            return Ok(result);
        }

        [HttpGet("GetOLD10StudentsWithSubmittedHomeworks")]
        public IActionResult GetOLD10StudentsWithSubmittedHomeworks()
        {
            // Step 1: Fetch the data from the database
            var homeworksWithPendingEvaluation = context.Students
                .SelectMany(s => s.Enrollments
                    .Where(e => e.SubmissionDate != null && e.HomeWorkEvaluation == "pending")
                    .Select(e => new
                    {
                        StudentId = s.StudentId,
                        GradeLevel = s.GradeLevel,
                        UserName = context.Users.Where(d => d.UserId == s.StudentId).Select(u => u.Name).FirstOrDefault(),
                        LessonId = e.LessonId,
                        LessonTitle = e.Lesson.Title,
                        HomeWorkEvaluation = e.HomeWorkEvaluation,
                        SubmissionDate = e.SubmissionDate.Value,
                        SubmissionLink = e.SubmissionLink
                    })
                )
                .Take(10)
                .ToList(); 

                       var result = homeworksWithPendingEvaluation.Select(hw => new HomeworkSubmissionDTO
            {
                StudentId = hw.StudentId,
                GradeLevel = hw.GradeLevel,
                UserName = hw.UserName,
                LessonId = hw.LessonId,
                LessonTitle = hw.LessonTitle,
                HomeWorkEvaluation = hw.HomeWorkEvaluation,
                SubmissionDate = hw.SubmissionDate,
                SubmissionLink = vidSer.GetMediaURL(HttpContext, newlevel(hw.GradeLevel), "PDFHomework", hw.SubmissionLink),
            }).ToList();

            return Ok(result);
        }


        private string newlevel(string gradeLevel)
        {

            var NewLevel = gradeLevel switch
            {
                "F" or "f" => "One",
                "S" or "s" => "Two",
                "T" or "t" => "Three",
                _ => ""
            };

            return NewLevel;


        }


        [HttpGet("GetLessonsByGradeLevel/{gradeLevel}")]
        public IActionResult GetLessonsByGradeLevel(string gradeLevel)
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
                    var lessons = context.Lessons
                .Where(l => l.GradeLevel.ToLower()==gradeLevel.ToLower())
                .Select(l => new LessonDTO
                {
                    LessonId = l.LessonId,
                    Title = l.Title,
                    Description = l.Description,
                    VideoURL= vidSer.GetMediaURL(HttpContext, NewLevel, "Video", context.Materials.Where(s => s.LessonId == l.LessonId && s.MaterialType == "Video").Select(w => w.MaterialLink).FirstOrDefault() ?? ""),
                     homeworkURL = vidSer.GetMediaURL(HttpContext, NewLevel, "PDF", context.Materials.Where(s => s.LessonId == l.LessonId && s.MaterialType == "PDF" && s.Name == "Homework").Select(w => w.MaterialLink).FirstOrDefault() ?? ""),

                    PDFURL = vidSer.GetMediaURL(HttpContext, NewLevel, "PDF", context.Materials.Where(s => s.LessonId == l.LessonId && s.MaterialType == "PDF" && s.Name == "").Select(w => w.MaterialLink).FirstOrDefault() ?? ""),
                    gradeLevel= l.GradeLevel,
                    UploadDate = l.UploadDate,
                    FeeAmount = l.FeeAmount 
                           
                })
                .ToList();

            if (!lessons.Any())
            {
                return NotFound($"No lessons found for grade level: {gradeLevel}");
            }

            return Ok(lessons);
        }

        [HttpGet("QuestionAndCountOfNotReplyFromTeacher")]
        public IActionResult CountOfQuestionNotReplying()
        {
            var count = context.Comments.Count(i => string.IsNullOrEmpty(i.Reply));
            return Ok(new { Count = count });
        }

        [HttpGet("GradeLevelQuestionsAndReplies")]
        public IActionResult GetGradeLevelQuestionsAndReplies(string gradeLevel)
        {
            var questionsAndReplies = context.StudentComments
                .Where(sc => sc.Student.GradeLevel == gradeLevel)
                .Select(sc => new LessonQuestionReplyDTO
                {
                    StudentName = sc.Student.StudentNavigation.Name,
                    Question = sc.Comment.Question,
                    Reply = sc.Comment.Reply
                })
                .ToList();
            return Ok(questionsAndReplies);
        }


      

        [HttpGet("GetNumberOfVideosByLevel")]
        public IActionResult GetNumberOfVideosByLevel()
        {
            //var videoCounts = new
            //{
            //    F = context.Materials
            //        .Where(m => m.MaterialType == "video" && m.Lesson.GradeLevel == "F")
            //        .Count(),

            //    S = context.Materials
            //        .Where(m => m.MaterialType == "video" && m.Lesson.GradeLevel == "S")
            //        .Count(),

            //    T = context.Materials
            //        .Where(m => m.MaterialType == "video" && m.Lesson.GradeLevel == "T")
            //        .Count()
            //};

            //return Ok(videoCounts);




            var videoCounts = new
            {
                F = context.Lessons
                   .Where(m =>  m.GradeLevel == "F")
                   .Count(),

                S = context.Lessons
                   .Where(m =>  m.GradeLevel == "S")
                   .Count(),

                T = context.Lessons
                   .Where(m => m.GradeLevel == "T")
                   .Count()
            };

            return Ok(videoCounts);











        }


        [HttpPost("Uploadlesson")]
        public IActionResult Uploadlesson( [FromForm]  NewLessonDTo newLesson)
        {
            if (ModelState.IsValid)
            {
                var lesson = new Lesson
                {
                    Title = newLesson.Title,
                    Description = newLesson.Description,
                    GradeLevel = newLesson.Level,
                    TeacherId = 4,
                    FeeAmount = newLesson.Price,
                    AccessPeriod = newLesson.AccessPeriod,
                    UploadDate = DateOnly.Parse(newLesson.UploadDate)
                };

                context.Lessons.Add(lesson);
                context.SaveChanges();


                if (newLesson.FileVideo != null)
                {
                    var videoMaterial = new Material
                    {
                        LessonId = lesson.LessonId,
                        MaterialType = "Video",
                        MaterialLink = newLesson.FileVideo.FileName,
                        Name = ""
                    };
                    var videoUploadResult = videos.UploadVideo(newLesson.FileVideo, newLesson.Level, videoMaterial.MaterialType); 

                    context.Materials.Add(videoMaterial);
                }



                if (newLesson.HomeWork!= null)
                {
                    var videoMaterial = new Material
                    {
                        LessonId = lesson.LessonId,
                        MaterialType = "PDF" ,
                        MaterialLink = newLesson.HomeWork.FileName,
                        Name = "Homework"
                    };
                    var videoUploadResult = videos.UploadVideo(newLesson.HomeWork, newLesson.Level, videoMaterial.MaterialType);

                    context.Materials.Add(videoMaterial);
                }


                if (newLesson.FileAttach != null)
                {
                    var pdfMaterial = new Material
                    {
                        LessonId = lesson.LessonId,
                        MaterialType = "PDF",
                        MaterialLink = newLesson.FileAttach.FileName,
                        Name = ""
                    };
                    var attachmentUploadResult = videos.UploadVideo(newLesson.FileAttach, newLesson.Level, pdfMaterial.MaterialType); 

                    context.Materials.Add(pdfMaterial);
                }

                context.SaveChanges();
                return Ok();
            }

            return BadRequest(ModelState);
        }

        [HttpGet]
        [Route("unansweredByLesson")]
        public async Task<IActionResult> GetUnansweredQuestionsByLesson()
        {
            var unansweredQuestions = await (from sc in context.StudentComments
                                             join c in context.Comments on sc.CommentId equals c.CommentId
                                             join s in context.Students on sc.StudentId equals s.StudentId
                                             join u in context.Users on s.StudentId equals u.UserId
                                             join l in context.Lessons on sc.LessonId equals l.LessonId
                                             where string.IsNullOrEmpty(c.Reply)
                                             select new StudentCommentDTO
                                             {
                                                 CommentId = c.CommentId,        
                                                 StudentName = u.Name,            
                                                 GradeLevel = s.GradeLevel,       
                                                 Question = c.Question,  
                                                 TitleLesson= l.Title,
                                                 userid= u.UserId,  

                                                 QuestionDate = c.QuestionDate
                                             }).OrderByDescending(s=>s.CommentId).ToListAsync();

            if (unansweredQuestions == null || unansweredQuestions.Count == 0)
            {
                return Ok(new { Message = "No unanswered questions found." });
            }

            return Ok(unansweredQuestions);
        }
        [HttpPost]
        [HttpPost("replyToQuestion")]
        public async Task<IActionResult> ReplyToQuestion(ReplyToQuestionDTO teacReplyDTo)
        {
            var comment = await context.Comments.FirstOrDefaultAsync(c => c.CommentId == teacReplyDTo.commentId);

            if (comment == null)
            {
                return NotFound(new { Message = "Comment not found." });
            }

            comment.Reply = teacReplyDTo.teacherReply;
            comment.ReplyDate = DateTime.Now;
            await context.SaveChangesAsync();

        
            await _hubContext.Clients.All.SendAsync("SendTeacherMessage", "mohamed Sayed", comment.Reply, teacReplyDTo.commentId ,teacReplyDTo.userid);

            return Ok(new { Message = "Reply saved successfully." });
        }



        [HttpPut("UpdateLesson/{id}")]
        public IActionResult UpdateLesson(int id, [FromForm] updateLessonDTO updatedLesson)
        {
           
            var lesson = context.Lessons.FirstOrDefault(l => l.LessonId == id);
            if (lesson == null)
            {
                return NotFound(new { message = $"Lesson with ID {id} not found." });
            }

            
            lesson.Title = updatedLesson.Title;
            lesson.Description = updatedLesson.Description;
            lesson.UploadDate = updatedLesson.UploadDate; 
            lesson.FeeAmount = updatedLesson.FeeAmount;

            
            if (updatedLesson.VideoURL != null)
            {
                var videoMaterial = context.Materials.FirstOrDefault(m => m.LessonId == id && m.MaterialType == "Video");
                if (videoMaterial != null)
                {
                    // Assuming UploadVideo returns a valid path or filename for the uploaded video
                    var videoUploadResult = videos.UploadVideo(updatedLesson.VideoURL, updatedLesson.GradeLevel, videoMaterial.MaterialType);
                    videoMaterial.MaterialLink = updatedLesson.VideoURL.FileName; // Update the material link
                }
            }

            // Check if a new PDF is uploaded
            if (updatedLesson.PDFURL != null)
            {
                var pdfMaterial = context.Materials.FirstOrDefault(m => m.LessonId == id && m.MaterialType == "PDF" && m.Name == "");
                if (pdfMaterial != null)
                {
                    pdfMaterial.MaterialLink = updatedLesson.PDFURL.FileName; // Update the material link

                    // Assuming UploadVideo returns a valid path or filename for the uploaded PDF
                    var attachmentUploadResult = videos.UploadVideo(updatedLesson.PDFURL, updatedLesson.GradeLevel, pdfMaterial.MaterialType);
                        }
            }

            if (updatedLesson.HomeWork!= null)
            {
                var pdfMaterial = context.Materials.FirstOrDefault(m => m.LessonId == id && m.MaterialType == "PDF" && m.Name == "Homework");
                if (pdfMaterial != null)
                {
                    pdfMaterial.MaterialLink = updatedLesson.HomeWork.FileName; // Update the material link

                    // Assuming UploadVideo returns a valid path or filename for the uploaded PDF
                    var attachmentUploadResult = videos.UploadVideo(updatedLesson.HomeWork, updatedLesson.GradeLevel, pdfMaterial.MaterialType);
                         }
            }

            // Save changes to the database
            context.SaveChanges();

            return Ok(new { message = "Lesson updated successfully." });
        }


        [HttpPost("acceptorrejectHomework")]

        public IActionResult acceptorrejectHomework(acceptorrejectHomeworkDTO homdto) {


            if (!(homdto.state.ToLower() == "accept" || homdto.state.ToLower() == "reject"))
            {
                return BadRequest();
            }
            if (homdto.studentid <0|| homdto.lessonid < 0)
            {
               return  BadRequest();
            }
            var enro = context.Enrollments.FirstOrDefault(e => e.LessonId == homdto.lessonid && e.StudentId == homdto.studentid);

            if (enro== null)
            {
                return NotFound();
            }
            enro.HomeWorkEvaluation = homdto.state;
            context.SaveChanges();
            return Ok();
        }

        [HttpGet("CountsAllStudentAccpetAndRejectOnLesson")]
        public IActionResult AllStudentAccpetAndRejectOnLesson()
        {
            var allCounts = from l in context.Lessons
                            join e in context.Enrollments on l.LessonId equals e.LessonId into enrollmentGroup
                            from eg in enrollmentGroup.DefaultIfEmpty() // استخدم Left Join
                            group eg by new { l.GradeLevel, l.Title , l.LessonId } into g
                            select new ALLStudentAccept_AndRejectDTO
                            {
                                id= g.Key.LessonId,
                               level=  g.Key.GradeLevel,
                                lessonName=     g.Key.Title,
                               countOfAccept= g.Count(x => x != null && x.HomeWorkEvaluation == "accept"),
                              countOfreject=  g.Count(x => x != null && x.HomeWorkEvaluation == "reject")
                            };

            var result = allCounts.ToList();

            return Ok(result);
        }

        [HttpGet("AllStudentAccpetAndRejectOnLesson/{lessonid}")]
        public IActionResult GetSAlltudentsAccpetAndRejectBYLessonID(int lessonid)
        {
            // إعداد القوائم للأسماء المقبولة والرافضة
            var studentNames = new ALLStudentNameRejectsAndAccept();

            // استعلام لجلب أسماء الطلاب المقبولين والرافضين
            var allCounts = from l in context.Lessons
                            join e in context.Enrollments on l.LessonId equals e.LessonId
                            join u in context.Users on e.StudentId equals u.UserId
                            where l.LessonId == lessonid
                            select new
                            {
                                StudentName = u.Name,
                                HomeWorkEvaluation = e.HomeWorkEvaluation
                            };

           
            foreach (var item in allCounts)
            {
                if (item.HomeWorkEvaluation == "accept")
                {
                    studentNames.NameAccept.Add(item.StudentName);
                }
                else if (item.HomeWorkEvaluation == "reject")
                {
                    studentNames.NameRejects.Add(item.StudentName);
                }
            }

            return Ok(studentNames);
        }


            [HttpGet("GetLessonStatsLast14Days")]
            public IActionResult GetLessonStatsLast14Days()
            {
                var twoWeeksAgo = DateTime.Now.AddDays(-14);

                var lessonStats = context.Lessons
                    .Where(l => l.UploadDate >= DateOnly.FromDateTime(twoWeeksAgo))
                    .Select(l => new LessonStatsDto
                    {
                        LessonId = l.LessonId,
                        Title = l.Title,
                        NumberOfStudents = l.Enrollments.Count,
                        TotalFeeCollected = l.Enrollments.Count * l.FeeAmount  ,

                        level= l.GradeLevel
                    })
                    .ToList();

                return Ok(lessonStats);
            }


      
        [HttpPut("ChangeAnyUserPassword")]
        public async Task<IActionResult> ChangeAnyUserPassword([FromBody] ChangePasswordDto request)
        {
            
            var userToChange = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (userToChange == null)
            {
                return NotFound("User not found.");
            }

          
            if (string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return BadRequest("New password cannot be empty.");
            }

          
            userToChange.Password = request.NewPassword;

            await context.SaveChangesAsync();

            return Ok();
        }




        [HttpGet("GetAllQuestionsAndRepliesonForCommanQuestion")]
        public IActionResult GetAllQuestionsAndRepliesonForCommanQuestion()
        {
            var existingQuestions = context.SelectedQuestions
                .Select(q => q.QuestionText)
                .ToList();

            var questionsAndReplies = context.StudentComments
                .Where(sc => !string.IsNullOrEmpty(sc.Comment.Reply))
                .Select(sc => new CommonQuestionAndReplyDTO
                {
                  
                    Question = sc.Comment.Question,
                    Reply = sc.Comment.Reply,
                    LessonTitle = sc.Lesson.Title,
                    GradeLevel = sc.Student.GradeLevel
                })
                .ToList();

            var uniqueEntries = new List<CommonQuestionAndReplyDTO>();

            foreach (var entry in questionsAndReplies)
            {
                if (!existingQuestions.Contains(entry.Question))
                {
                    bool exists = uniqueEntries.Any(e =>
                       
                        e.Question == entry.Question &&
                        e.Reply == entry.Reply &&
                        e.LessonTitle == entry.LessonTitle &&
                        e.GradeLevel == entry.GradeLevel);

                    if (!exists)
                    {
                        uniqueEntries.Add(entry);
                    }
                }
            }

            if (!uniqueEntries.Any())
            {
                return NotFound("No new questions and replies found.");
            }

            return Ok(uniqueEntries);
        }


        //
        [HttpPost("saveSelectedQuestions")]
        public async Task<IActionResult> SaveSelectedQuestions([FromBody] List<QuestionModel> questions)
        {
            if (questions == null || !questions.Any())
                return BadRequest("No Question Selected");

            foreach (var question in questions)
            {
                context.SelectedQuestions.Add(new SelectedQuestion
                {
                    GradeLevel = question.GradeLevel,
                    LessonName = question.LessonName,
                    QuestionText = question.Question,
                    ReplyText = question.Reply
                });
            }

            await context.SaveChangesAsync();
            return Ok();
        }

        //

        [HttpGet("AllQuestionAndReplyFromSelectedQuestion")]
        public IActionResult AllQuestionAndReplyFromSelectedQuestion()
        {
            var questionsAndReplies = context.SelectedQuestions
                
                .Select(sc => new CommonQuestionAndReplyDTO
                {
                    QuestionID = sc.Id,
                    Question = sc.QuestionText,
                    Reply = sc.ReplyText,
                    LessonTitle = sc.LessonName,
                    GradeLevel = sc.GradeLevel
                })
                .OrderBy(qr => qr.GradeLevel)
                .ToList();

            if (!questionsAndReplies.Any())
            {
                return NotFound();
            }

            return Ok(questionsAndReplies);
        }

        [HttpDelete("RemoveQuestion/{id}")]
        public IActionResult AllQuestionAndReplyFromSelectedQuestion(int id)
        {
            var questionsAndReplies = context.SelectedQuestions.FirstOrDefault(i => i.Id == id);
            if (questionsAndReplies == null) {

                return BadRequest();
            
            }

                             
              context.SelectedQuestions.Remove(questionsAndReplies);
            context.SaveChanges();

            return Ok();
        }



    }

}
