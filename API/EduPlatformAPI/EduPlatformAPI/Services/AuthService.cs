using EduPlatformAPI.DTO.User;
using EduPlatformAPI.Models;
using Microsoft.Data.SqlClient;
using System.Collections.Concurrent;
using System.Net.Mail;
using System.Net;
using Azure.Core;

namespace EduPlatformAPI.Services
{
    public class AuthService
    {
        private readonly EduPlatformDbContext context;
        //private static readonly ConcurrentDictionary<string, string> VerificationCodes = new ConcurrentDictionary<string, string>();
        //private static readonly Dictionary<string, string> Users = new Dictionary<string, string>();


        public AuthService(EduPlatformDbContext _context)
        {
            context = _context;
        }

        public User AuthenticateUser(UserDTO userDto)
        {

            var user = context.Users.SingleOrDefault(u => u.Email == userDto.Email && u.Password == userDto.Password);

            if (user != null)
            {

                return user;
            }


            return null;
        }





        private async Task SendVerificationEmail(string email, string verificationCode)
        {
            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential("mafmafmafma231@gmail.com", "wxay pyll ztqc vrdg"),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress("mafmafmafma231@gmail.com"),
                Subject = "Password Reset Verification Code",
                Body = $"Your verification code is {verificationCode}",
                IsBodyHtml = false,
            };
            mailMessage.To.Add(email);

            await smtpClient.SendMailAsync(mailMessage);
        }

        public async Task<bool> SendVerificationCode(string email)
        {
            var verificationCode = GenerateVerificationCode();

            var codeEntry = new VerificationCode
            {
                Email = email,
                VerificationCode1 = verificationCode,
                ExpiryDate = DateTime.Now.AddMinutes(10)
            };

            context.VerificationCodes.Add(codeEntry);
            await context.SaveChangesAsync();

            await SendVerificationEmail(email, verificationCode);

            return true;
        }

        private string GenerateVerificationCode()
        {
            return new Random().Next(100000, 999999).ToString();
        }

        public bool IsVerificationCodeValid(string email, string verificationCode)
        {
            var codeEntry = context.VerificationCodes
                .FirstOrDefault(vc => vc.Email == email && vc.VerificationCode1 == verificationCode && !vc.IsUsed);

            if (codeEntry != null && codeEntry.ExpiryDate > DateTime.Now)
            {
                return true;
            }

            return false;
        }

        public void UpdatePassword(string email, string newPassword ,string VerificationCode)
        {
            var user = context.Users.FirstOrDefault(u => u.Email == email);
            if (user != null)
            {
                user.Password = newPassword;
                context.SaveChanges();

                var userverfication = context.VerificationCodes.FirstOrDefault(u => u.Email == email && u.VerificationCode1 == VerificationCode);
                if (userverfication != null) {

                    userverfication.IsUsed = true;
                }
                var all = context.VerificationCodes.Where(u => u.Email == u.Email);
                context.VerificationCodes.RemoveRange(all);
                context.SaveChanges();
            }
        }






    }
}
