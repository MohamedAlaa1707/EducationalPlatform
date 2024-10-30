using EduPlatformAPI.DTO;
using EduPlatformAPI.DTO.User;
using EduPlatformAPI.Models;
using EduPlatformAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace EduPlatformAPI.Controllers
{




    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AuthService authService;
        private readonly IConfiguration config;
        private readonly EduPlatformDbContext context;

        public AccountController(AuthService _authService, IConfiguration config , EduPlatformDbContext context)
        {
            authService = _authService;
            this.config = config;
            this.context = context;
        }
    


        // For registration
        [HttpPost("register")]
        public IActionResult RegisterStudent([FromBody] StudentDTO studentDTO)
        {
            if (ModelState.IsValid)
            {
                // Check for required User fields
                if (string.IsNullOrWhiteSpace(studentDTO.Name) ||
                    string.IsNullOrWhiteSpace(studentDTO.Email) ||
                    string.IsNullOrWhiteSpace(studentDTO.Password) ||
                    string.IsNullOrWhiteSpace(studentDTO.Phone))
                {
                    return BadRequest("All User fields (Name, Email, Password, Phone) are required.");
                }

                // Check for required Student fields
                if (string.IsNullOrWhiteSpace(studentDTO.GradeLevel) ||
                    string.IsNullOrWhiteSpace(studentDTO.Governorate) ||
                    string.IsNullOrWhiteSpace(studentDTO.ParentPhone))
                {
                    return BadRequest("All Student fields (GradeLevel, Governorate, ParentPhone) are required.");
                }

                var user = new User
                {
                    Name = studentDTO.Name,
                    Email = studentDTO.Email,
                    Password = studentDTO.Password,
                    Phone = studentDTO.Phone,
                    Role = "S",
                    RegistrationDate = DateOnly.FromDateTime(DateTime.Now),
                };

                // Add user to the database
                context.Users.Add(user);
                context.SaveChanges();

                var student = new Student
                {
                    StudentId = user.UserId,
                    GradeLevel = studentDTO.GradeLevel,
                    Governorate = studentDTO.Governorate,
                    ParentPhone = studentDTO.ParentPhone
                };

                // Add student to the database
                context.Students.Add(student);
                context.SaveChanges();

                return Ok(new { message = "Student registered successfully" });
            }

            return BadRequest(ModelState);
        }





        [HttpPost("login")]
        public IActionResult Login([FromBody] UserDTO us) {

            if (ModelState.IsValid) {
                var user = authService.AuthenticateUser(us);
                if (user == null)
                {
                    return Unauthorized();
                }

                var token = GenerateJwtToken(user);

                return Ok(new { token ,user.Role });



            }
            return BadRequest();
        }
        private string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
             new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.Role)
             };

            var token = new JwtSecurityToken(
                issuer: config["Jwt:Issuer"],
                audience: config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        [Authorize()]
        [HttpGet]
        
        [HttpGet("ISExpired")]
        public IActionResult ISExpired()
        {
            try
            {
                var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                if (string.IsNullOrEmpty(token))
                {
                    return Unauthorized("Token is missing.");
                }

                bool isExpired = IsTokenExpired(token, config["Jwt:Key"]);

                if (isExpired)
                {
                    return Unauthorized("Token has expired.");
                }

                var role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
                return Ok(new { role });
            }
            catch (Exception ex)
            {
               
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }


        private bool IsTokenExpired(string token, string secretKey)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(secretKey);

            try
            {
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
                return false;
            }
            catch (SecurityTokenExpiredException)
            {
                return true;
            }
            catch (Exception)
            {
                return true;
            }
        }
    



     [HttpGet("getuserinfo")]
        [Authorize]
        // extract name and role from token
        public IActionResult GetUserInfo()
        {
            var username = User.Identity.Name;
            var role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

            var userInfo = new UserInfoDto
            {
                Username = username,
                Role = role
            };


            return Ok(userInfo);


        }




        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var user = context.Users.FirstOrDefault(u => request.Email == u.Email);

            if (user == null)
            {
                return BadRequest("Email not found");
            }

            await authService.SendVerificationCode(request.Email);

            return Ok();
        }

        [HttpPost("reset-password")]
        public IActionResult ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (authService.IsVerificationCodeValid(request.Email, request.VerificationCode ))
            {
                authService.UpdatePassword(request.Email, request.NewPassword , request.VerificationCode);
                return Ok( new {message ="Password has been reset successfully" });
            }

            return BadRequest(new { message = "Invalid or already used verification code" });
        }








    }




    public class ForgotPasswordRequest
    {
        public string Email { get; set; }
    }

    public class ResetPasswordRequest
    {
        public string Email { get; set; }
        public string VerificationCode { get; set; }
        public string NewPassword { get; set; }
    }

}

