using EduPlatformAPI.DTO.User;
using EduPlatformAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduPlatformAPI.Services
{
    public class GenerateUserAndPass
    {
        private readonly EduPlatformDbContext context;

        public GenerateUserAndPass(EduPlatformDbContext context)
        {
            this.context = context;
        }
        private string GenerateRandomString(int length, Char IsOnlyNumber)
        {
            var random = new Random();
            string chars;
            string[] dataset = new string[] {
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            "0123456789"
            };
            chars = IsOnlyNumber == 'Y' ? dataset[1] : dataset[0];

            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        private string GenerateUsername()
        {
            string username = GenerateRandomString(8, 'N');
            return username;
        }
        private string GeneratePassword()
        {
            string pass = GenerateRandomString(10, 'Y');
            return pass;
        }


        private bool IsUsernameExists(string username)
        {
            return context.Enrollments.Any(u => u.UserName == username);
        }

        private bool IsPasswordExists(string password)
        {
            return context.Enrollments.Any(u => u.Password == password);
        }

        public UserDTO GenerateRandomUserAndPassForStuden()
        {

            string username;
            string password;

            do
            {
                username = GenerateUsername();
                password = GeneratePassword();
            } while (IsUsernameExists(username) || IsPasswordExists(password));


            var newUser = new UserDTO
            {

                Email = username,
                Password = password

            };

            

            return newUser;
        }



    }
}
