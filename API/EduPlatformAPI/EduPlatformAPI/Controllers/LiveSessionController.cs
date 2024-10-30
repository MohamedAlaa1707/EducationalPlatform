using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EduPlatformAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LiveSessionController : ControllerBase
    {
        [HttpPost("start")]
        public IActionResult StartSession([FromBody] SessionRequest request)
        {
            // Logic to start a session (e.g., store session info in DB)
            return Ok(new { sessionId = "12345" }); // Return a session ID
        }

        // Method to join a session
        [HttpPost("join/{sessionId}")]
        public IActionResult JoinSession(string sessionId, [FromBody] StudentRequest request)
        {
            // Logic to join a session
            return Ok();
        }

        // Method to leave a session
        [HttpPost("leave/{sessionId}")]
        public IActionResult LeaveSession(string sessionId, [FromBody] StudentRequest request)
        {
            // Logic to leave a session
            return Ok();
        }
    }

    public class SessionRequest
    {
        public string TeacherId { get; set; }
    }

    public class StudentRequest
    {
        public string StudentId { get; set; }
    }

}
