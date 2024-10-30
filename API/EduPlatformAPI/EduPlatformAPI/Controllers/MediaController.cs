using EduPlatformAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Text.Json.Serialization;


namespace EduPlatformAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediaController : ControllerBase
    {
        private readonly IWebHostEnvironment env;
        private readonly EduPlatformDbContext context;
        private readonly FileExtensionContentTypeProvider _fileExtensionContentTypeProvider;

        public MediaController(IWebHostEnvironment env , EduPlatformDbContext context)
        {
            this.env = env;
            this.context = context;
            _fileExtensionContentTypeProvider = new FileExtensionContentTypeProvider();
        }
        [HttpGet("GetVideos/{level}")]
        public async Task<IActionResult> GetVideos(string level)
        {
            var NewLevel = level switch
            {
                "F" or "f" => "One",
                "S" or "s" => "Two",
                "T" or "t" => "Three",
                _ => null
            };
            if (NewLevel == null)
            {
                return BadRequest("Invalid grade level specified.");
            }

            var lessonIDs = await context.Lessons
                                  .Where(s => s.GradeLevel == level)
                                  .Select(s => s.LessonId)
                                  .ToListAsync();

            List<string> paths = new List<string>();
            foreach (var lessonId in lessonIDs)
            {
                var videoLinks = await context.Materials
                    .Where(s => s.MaterialType == "Video" && s.LessonId == lessonId)
                    .Select(w => w.MaterialLink)
                    .ToListAsync();

                foreach (var item in videoLinks)
                {
                    var filePath = Path.Combine(env.WebRootPath, "Levels", NewLevel, "Video", item);

                
                    if (System.IO.File.Exists(filePath)) 
                    {
                        var videoUrl = $"{Request.Scheme}://{Request.Host}/api/Media/Videos/{NewLevel}/{item}";
                        paths.Add(videoUrl);
                    }
                }
            }

           
            if (!paths.Any())
            {
                return NotFound("No video files found.");
            }

            return Ok(paths);
        }


        //[Authorize]
        [HttpGet("{level}/{TypeMedia}/{fileName}")]
        public IActionResult GetMedia(string level, string fileName, string TypeMedia)
        {
            if (!(TypeMedia == "ReceiptImages" || TypeMedia == "PDFHomework" || TypeMedia == "Video" || TypeMedia == "PDF"))
            {
                return BadRequest();
            }

            var filePath = Path.Combine(env.WebRootPath, "Levels", level, TypeMedia, fileName);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            if (!_fileExtensionContentTypeProvider.TryGetContentType(filePath, out var mimeType))
            {
                mimeType = "application/octet-stream";
            }

            return PhysicalFile(filePath, mimeType);
        }


        //[HttpGet("PDF/{level}/{fileName}")]
        //public IActionResult GetDocument(string level, string fileName)
        //{
        //    var filePath = Path.Combine(env.WebRootPath, "Levels", level, "PDF", fileName);
        //    if (!System.IO.File.Exists(filePath))
        //    {
        //        return NotFound();
        //    }
        //    var mimeType = "application/pdf";
        //    return PhysicalFile(filePath, mimeType);
        //}





        [HttpPost("Uploadlesson")]
        public async Task<IActionResult> UploadVideo([FromForm] IFormFile file, [FromForm] string level, [FromForm] string TypeLess)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var folder = level switch
            {
                "F" or "f" => "One",
                "S" or "s" => "Two",
                "T" or "t"  => "Three",
                _ => null
            };

            if (folder == null)
            {
                return BadRequest("Invalid level.");
            }

            var filePath = Path.Combine(env.WebRootPath, "Levels", folder, TypeLess, file.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new { filePath });
            }

       








    }
}
