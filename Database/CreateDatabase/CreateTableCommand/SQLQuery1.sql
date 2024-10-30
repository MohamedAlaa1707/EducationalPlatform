CREATE TABLE [User] (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(50) NOT NULL,
    Email NVARCHAR(50) NOT NULL UNIQUE,
    Password NVARCHAR(50) NOT NULL,
	Phone NVARCHAR(11) NOT NULL check(len(Phone)=11)
	,
    Role NVARCHAR(2) NOT NULL CHECK (Role IN ('T', 'A', 'S','t', 'a', 's' )), 
    RegistrationDate DATE NOT NULL,
    LastLoginDate DATE
);

CREATE TABLE Admin (
    AdminId INT PRIMARY KEY 
    FOREIGN KEY (AdminId) REFERENCES [User](UserID)ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TABLE Student (
    StudentId INT PRIMARY KEY ,
	 GradeLevel NVARCHAR(2) NOT NULL ,
	 Governorate NVARCHAR(15) NOT NULL,
	 ParentPhone NVARCHAR(11) NOT NULL check(len(ParentPhone)=11)
    FOREIGN KEY (StudentId) REFERENCES [User](UserID) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Teacher (
    TeacherId INT PRIMARY KEY,
   
    FOREIGN KEY (TeacherId) REFERENCES [User](UserID)
);

CREATE TABLE Lesson (
    LessonId INT PRIMARY KEY IDENTITY(1,1),
    TeacherId INT NOT NULL,
    GradeLevel NVARCHAR(2) NOT NULL,
	 Description NVARCHAR(50) NOT NULL,
    Title NVARCHAR(50) NOT NULL,
    UploadDate DATE NOT NULL,
    FeeAmount DECIMAL(10, 2) NOT NULL,
    AccessPeriod int NOT NULL default(14),
    FOREIGN KEY (TeacherId) REFERENCES Teacher(TeacherId)
);
CREATE TABLE Material (
    MaterialId INT PRIMARY KEY IDENTITY(1,1),
    LessonId INT NOT NULL,
    MaterialType NVARCHAR(20) CHECK (MaterialType IN ('PDF', 'Video', 'Word', 'Reference')) NOT NULL,
    MaterialLink NVARCHAR(max) NOT NULL,
	Name NVARCHAR(50) NOT NULL
    FOREIGN KEY (LessonId) REFERENCES Lesson(LessonId)
	ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE Receipt (
    ReceiptId INT PRIMARY KEY IDENTITY(1,1),
    ReceiptImageLink NVARCHAR(max) NOT NULL,
    UploadDate DATE NOT NULL,
	AdminReviewed  NVARCHAR(20) CHECK (AdminReviewed IN ('Y', 'N', 'y', 'n')) NOT NULL,
);

CREATE TABLE Enrollment (
    EnrollmentId INT PRIMARY KEY IDENTITY(1,1),
    LessonId INT NOT NULL, 
    StudentId INT NOT NULL, 
    ReceiptId INT NOT NULL, 
    AccessStartDate DATE NOT NULL,
	AccessEndDate DATE NOT NULL,
    SubmissionDate DATE,
    SubmissionLink NVARCHAR(max) default(''),
    HomeWorkEvaluation NVARCHAR(25) default('Pending'),
	UserName Varchar(25)  unique,
	Password Varchar(30) not null ,
    ReceiptStatus NVARCHAR(20) NOT NULL,
    FOREIGN KEY (LessonId) REFERENCES Lesson(LessonId)
	ON UPDATE CASCADE 
	,
    FOREIGN KEY (StudentId) REFERENCES Student(StudentId)
	ON UPDATE CASCADE ON DELETE CASCADE
	,

    FOREIGN KEY (ReceiptId) REFERENCES Receipt(ReceiptId)
	ON UPDATE CASCADE ON DELETE CASCADE
);



CREATE TABLE Comment (
    CommentID INT PRIMARY KEY IDENTITY(1,1),
     Question TEXT NOT NULL,
	 Reply TEXT NOT NULL,
    QuestionDate   date ,
	ReplyDate   date ,
    
);
CREATE TABLE Student_Comment (
    Student_CommentId INT PRIMARY KEY IDENTITY(1,1), 
    CommentID INT NOT NULL,
    LessonID INT NOT NULL,
    StudentId INT NOT NULL, 
    EnrollmentID INT NOT NULL,
    FOREIGN KEY (EnrollmentID) REFERENCES Enrollment(EnrollmentID) ON UPDATE NO ACTION ON DELETE NO ACTION,
    FOREIGN KEY (StudentId) REFERENCES Student(StudentId) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (LessonID) REFERENCES Lesson(LessonID) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (CommentID) REFERENCES Comment(CommentID) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE FavoriteLessons (
    FavoriteLessonId INT PRIMARY KEY IDENTITY(1,1),
    StudentId INT NOT NULL,
    LessonId INT NOT NULL,
    DateAdded DATE NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (StudentId) REFERENCES Student(StudentId)
        ON UPDATE CASCADE 
        ON DELETE CASCADE,
    FOREIGN KEY (LessonId) REFERENCES Lesson(LessonId)
        ON UPDATE CASCADE 
        ON DELETE CASCADE
);




CREATE TABLE SelectedQuestions (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    GradeLevel NVARCHAR(2),
    LessonName NVARCHAR(50),
    QuestionText NVARCHAR(MAX),
    ReplyText NVARCHAR(MAX)
);


CREATE TABLE SelectedQuestions (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    GradeLevel NVARCHAR(2),
    LessonName NVARCHAR(50),
    QuestionText NVARCHAR(MAX),
    ReplyText NVARCHAR(MAX)
);

CREATE TABLE VerificationCodes (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Email NVARCHAR(255) NOT NULL,
    VerificationCode NVARCHAR(6) NOT NULL,
    ExpiryDate DATETIME NOT NULL,
    IsUsed BIT NOT NULL DEFAULT 0
);





