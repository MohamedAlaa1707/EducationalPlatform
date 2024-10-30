using Microsoft.AspNetCore.Authentication.JwtBearer;
using EduPlatformAPI.Models;
using EduPlatformAPI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using EduPlatformAPI.Controllers;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.DependencyInjection;
using EduPlatformAPI.Hubs;

namespace EduPlatformAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the DB.
            builder.Services.AddDbContext<EduPlatformDbContext>(op => {
                op.UseSqlServer(builder.Configuration.GetConnectionString("Default"));
            });

            builder.Services.AddScoped<AuthService>();
            builder.Services.AddScoped<GenerateUserAndPass>();
            builder.Services.AddScoped<LessonService>();
            builder.Services.AddScoped<MediaController>();
            builder.Services.AddScoped<PayPalService>();

            builder.Services.AddScoped<TeacherController>();
            builder.Services.AddSignalR();

            // Add services to the Cors.
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowMultipleOrigins", policy =>
                {
                    policy.WithOrigins("http://localhost:4200", "http://localhost:53043")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });

            // to search about word Bearer in header 
            builder.Services.AddAuthentication(options => {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(op =>
            {
                op.SaveToken = true;
                op.RequireHttpsMetadata = false;
                op.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("AdminOnly", policy => policy.RequireRole("A"));
                options.AddPolicy("TeacherOnly", policy => policy.RequireRole("T"));
                options.AddPolicy("StudentOnly", policy => policy.RequireRole("S"));
            });

            // Add services to the container.
            builder.Services.AddControllers()
                .AddNewtonsoftJson(); // Add this line

            // Configure form options to increase the max request body size
            builder.Services.Configure<FormOptions>(options =>
            {
                options.MultipartBodyLengthLimit = 104857600; // Set your desired limit here
            });

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Configure server options to increase the max request body size
            builder.WebHost.ConfigureKestrel(serverOptions =>
            {
                serverOptions.Limits.MaxRequestBodySize = 1000 * 1024 * 1024;
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            
            app.UseCors("AllowMultipleOrigins");

            app.UseStaticFiles();
            app.UseHttpsRedirection();
            app.UseAuthorization();

            app.MapControllers();
            app.MapHub<ClassroomHub>("/classroomHub");

            app.Run();
        }
    }
}
