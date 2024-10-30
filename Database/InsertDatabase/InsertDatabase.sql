INSERT INTO [dbo].[User] 
VALUES ('MohamedAlaa', 'MohamedAlaa@gmail.com', '123456789','01099962058','S','2024-09-27','2024-09-07')
,      ('HatemMamdouh', 'HatemMamdouh@gmail.com', '123456789','01563248962','S','2024-09-27','2024-09-07')
,      ('MahmoudMokhtar', 'MahmoudMokhtar@gmail.com', '123456789','01156325789','S','2024-09-27','2024-09-07')
,      ('MakadySayed', 'MakadySayed@gmail.com', '123456789','01265832187','T','2024-09-27','2024-09-07')
,      ('MohamedAshraf', 'MohamedAshraf@gmail.com', '123456789','01265492483','A','2024-09-27','2024-09-07');
-------------------------------------------------------------------------------------------
INSERT INTO [dbo].[Admin]
VALUES (5);
-------------------------------------------------------------------------------------------
INSERT INTO [dbo].[Student]
VALUES (1,'T','Minya','01034896518')
,      (2,'F','Cairo','01134896518')
,      (3,'T','Aswan','01034896518');
-------------------------------------------------------------------------------------------
INSERT INTO [dbo].[Teacher]
VALUES (4);
select * from Lesson
--------------------------------------------------------------------------------------------
INSERT INTO [dbo].[Lesson]
VALUES (4,'F','First Lesson About Basic Grammer','Basic Grammer','2024-10-03',50,14)
,      (4,'S','Difference Between An , A ','A && An','2024-10-03',50,14)
,      (4,'S','First Lesson About Basic Grammer For Secondary','Basic Grammer','2024-10-03',50,14)
,      (4,'F','Lesson About Basic Grammer For Secondary','Basic Grammer','2024-10-03',50,14);
--------------------------------------------------------------------------------------------
INSERT INTO [dbo].[Material]
VALUES (1,'PDF','http: //LinkofPDF','HomeWorlLastVedioForFirst')
,      (2,'Word','http: //LinkofWord','AboutLecture1forFirst')
,      (3,'Video','http: //LinkofVedio','AboutLecture1forFirst')
,      (4,'Video','http: //LinkofVedio','AboutLecture1forReference');
--------------------------------------------------------------------------------------------
INSERT INTO [dbo].[Receipt]
VALUES ('ImageLinkInGoogleDrive','2024-10-10','N')
,      ('ImageLinkInGoogleDrive2','2024-10-11','N')
,      ('ImageLinkInGoogleDrive3','2024-10-15','Y');
--------------------------------------------------------------------------------------------
INSERT INTO [dbo].[Enrollment]
VALUES(1,1,1,'2024-10-11','2024-10-25','','','pending','hatem','123456789','active'),
(1,2,2,'2024-10-13','2024-10-27','','','pending','hany','123456789','notactive'),
(1,3,3,'2024-10-16','2024-10-30','','','pending','basma','123456789','active');
----------------------------------------------------------------------------------------------
INSERT INTO[dbo].[Comment]
VALUES('Why are you studying English?','','2024-10-11','2024-10-12'),
('What do you do in your free time','I study English','2024-10-15','2024-10-17'),
('How�s the weather?','rainy','2024-10-15','2024-10-17');
-----------------------------------------------------------------------------------------------------
INSERT INTO[dbo].[Student_Comment]
VALUES(1,1,1),
(2,3,1),
(3,4,1);
-----------------------------------------------------
INSERT INTO [dbo].[FavoriteLessons] (StudentId, LessonId)
VALUES (1, 4), 
       (2, 4), 
       (3, 4);