using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace EduPlatformAPI.Models;

public partial class EduPlatformDbContext : DbContext
{
    public EduPlatformDbContext()
    {
    }

    public EduPlatformDbContext(DbContextOptions<EduPlatformDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Admin> Admins { get; set; }

    public virtual DbSet<Comment> Comments { get; set; }

    public virtual DbSet<Enrollment> Enrollments { get; set; }

    public virtual DbSet<FavoriteLesson> FavoriteLessons { get; set; }

    public virtual DbSet<Lesson> Lessons { get; set; }

    public virtual DbSet<Material> Materials { get; set; }

    public virtual DbSet<Receipt> Receipts { get; set; }

    public virtual DbSet<SelectedQuestion> SelectedQuestions { get; set; }

    public virtual DbSet<Student> Students { get; set; }

    public virtual DbSet<StudentComment> StudentComments { get; set; }

    public virtual DbSet<Teacher> Teachers { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<VerificationCode> VerificationCodes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    { 
    
    
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Admin>(entity =>
        {
            entity.HasKey(e => e.AdminId).HasName("PK__Admin__719FE488244B336B");

            entity.ToTable("Admin");

            entity.Property(e => e.AdminId).ValueGeneratedNever();

            entity.HasOne(d => d.AdminNavigation).WithOne(p => p.Admin)
                .HasForeignKey<Admin>(d => d.AdminId)
                .HasConstraintName("FK__Admin__AdminId__3C69FB99");
        });

        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.CommentId).HasName("PK__Comment__C3B4DFAAA29DDCDF");

            entity.ToTable("Comment");

            entity.Property(e => e.CommentId).HasColumnName("CommentID");
            entity.Property(e => e.Question).HasColumnType("text");
            entity.Property(e => e.QuestionDate).HasColumnType("datetime");
            entity.Property(e => e.Reply).HasColumnType("text");
            entity.Property(e => e.ReplyDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<Enrollment>(entity =>
        {
            entity.HasKey(e => e.EnrollmentId).HasName("PK__Enrollme__7F68771BF56DB4C0");

            entity.ToTable("Enrollment");

            entity.Property(e => e.AccessEndDate).HasColumnType("datetime");
            entity.Property(e => e.AccessStartDate).HasColumnType("datetime");
            entity.Property(e => e.HomeWorkEvaluation).HasMaxLength(25);
            entity.Property(e => e.Password)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.ReceiptStatus)
                .HasMaxLength(20)
                .HasDefaultValue("Pending");
            entity.Property(e => e.SubmissionDate).HasColumnType("datetime");
            entity.Property(e => e.SubmissionLink).HasDefaultValue("");
            entity.Property(e => e.UserName)
                .HasMaxLength(25)
                .IsUnicode(false);

            entity.HasOne(d => d.Lesson).WithMany(p => p.Enrollments)
                .HasForeignKey(d => d.LessonId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Enrollmen__Lesso__534D60F1");

            entity.HasOne(d => d.Receipt).WithMany(p => p.Enrollments)
                .HasForeignKey(d => d.ReceiptId)
                .HasConstraintName("FK__Enrollmen__Recei__5535A963");

            entity.HasOne(d => d.Student).WithMany(p => p.Enrollments)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK__Enrollmen__Stude__5441852A");
        });

        modelBuilder.Entity<FavoriteLesson>(entity =>
        {
            entity.HasKey(e => e.FavoriteLessonId).HasName("PK__Favorite__ADA5AA76F147B44C");

            entity.Property(e => e.DateAdded).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Lesson).WithMany(p => p.FavoriteLessons)
                .HasForeignKey(d => d.LessonId)
                .HasConstraintName("FK__FavoriteL__Lesso__04E4BC85");

            entity.HasOne(d => d.Student).WithMany(p => p.FavoriteLessons)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK__FavoriteL__Stude__03F0984C");
        });

        modelBuilder.Entity<Lesson>(entity =>
        {
            entity.HasKey(e => e.LessonId).HasName("PK__Lesson__B084ACD0C952D50D");

            entity.ToTable("Lesson");

            entity.Property(e => e.AccessPeriod).HasDefaultValue(14);
            entity.Property(e => e.Description).HasMaxLength(50);
            entity.Property(e => e.FeeAmount).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.GradeLevel).HasMaxLength(2);
            entity.Property(e => e.Title).HasMaxLength(50);

            entity.HasOne(d => d.Teacher).WithMany(p => p.Lessons)
                .HasForeignKey(d => d.TeacherId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Lesson__TeacherI__46E78A0C");
        });

        modelBuilder.Entity<Material>(entity =>
        {
            entity.HasKey(e => e.MaterialId).HasName("PK__Material__C50610F7C9D16183");

            entity.ToTable("Material");

            entity.Property(e => e.MaterialType).HasMaxLength(20);
            entity.Property(e => e.Name).HasMaxLength(50);

            entity.HasOne(d => d.Lesson).WithMany(p => p.Materials)
                .HasForeignKey(d => d.LessonId)
                .HasConstraintName("FK__Material__Name__4AB81AF0");
        });

        modelBuilder.Entity<Receipt>(entity =>
        {
            entity.HasKey(e => e.ReceiptId).HasName("PK__Receipt__CC08C4204E64E4BC");

            entity.ToTable("Receipt");

            entity.Property(e => e.AdminReviewed).HasMaxLength(20);
            entity.Property(e => e.UploadDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<SelectedQuestion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Selected__3214EC07D381C0CD");

            entity.Property(e => e.GradeLevel).HasMaxLength(2);
            entity.Property(e => e.LessonName).HasMaxLength(50);
        });

        modelBuilder.Entity<Student>(entity =>
        {
            entity.HasKey(e => e.StudentId).HasName("PK__Student__32C52B9942991DF7");

            entity.ToTable("Student");

            entity.Property(e => e.StudentId).ValueGeneratedNever();
            entity.Property(e => e.Governorate).HasMaxLength(15);
            entity.Property(e => e.GradeLevel).HasMaxLength(2);
            entity.Property(e => e.ParentPhone).HasMaxLength(11);

            entity.HasOne(d => d.StudentNavigation).WithOne(p => p.Student)
                .HasForeignKey<Student>(d => d.StudentId)
                .HasConstraintName("FK__Student__ParentP__403A8C7D");
        });

        modelBuilder.Entity<StudentComment>(entity =>
        {
            entity.HasKey(e => e.StudentCommentId).HasName("PK__Student___860BBCDB3BC034F6");

            entity.ToTable("Student_Comment");

            entity.Property(e => e.StudentCommentId).HasColumnName("Student_CommentId");
            entity.Property(e => e.CommentId).HasColumnName("CommentID");
            entity.Property(e => e.EnrollmentId).HasColumnName("EnrollmentID");
            entity.Property(e => e.LessonId).HasColumnName("LessonID");

            entity.HasOne(d => d.Comment).WithMany(p => p.StudentComments)
                .HasForeignKey(d => d.CommentId)
                .HasConstraintName("FK__Student_C__Comme__2739D489");

            entity.HasOne(d => d.Enrollment).WithMany(p => p.StudentComments)
                .HasForeignKey(d => d.EnrollmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Student_C__Enrol__245D67DE");

            entity.HasOne(d => d.Lesson).WithMany(p => p.StudentComments)
                .HasForeignKey(d => d.LessonId)
                .HasConstraintName("FK__Student_C__Lesso__2645B050");

            entity.HasOne(d => d.Student).WithMany(p => p.StudentComments)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK__Student_C__Stude__25518C17");
        });

        modelBuilder.Entity<Teacher>(entity =>
        {
            entity.HasKey(e => e.TeacherId).HasName("PK__Teacher__EDF2596475CE4CDB");

            entity.ToTable("Teacher");

            entity.Property(e => e.TeacherId).ValueGeneratedNever();

            entity.HasOne(d => d.TeacherNavigation).WithOne(p => p.Teacher)
                .HasForeignKey<Teacher>(d => d.TeacherId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Teacher__Teacher__4316F928");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__User__1788CCAC886E8853");

            entity.ToTable("User");

            entity.HasIndex(e => e.Email, "UQ__User__A9D10534F3C3D9D4").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Email).HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Password).HasMaxLength(50);
            entity.Property(e => e.Phone).HasMaxLength(11);
            entity.Property(e => e.Role).HasMaxLength(2);
        });

        modelBuilder.Entity<VerificationCode>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Verifica__3214EC0711258B27");

            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.ExpiryDate).HasColumnType("datetime");
            entity.Property(e => e.VerificationCode1)
                .HasMaxLength(6)
                .HasColumnName("VerificationCode");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
