import { Routes } from '@angular/router';
import { teacherGuard } from './Guards/teacher.guard';
import { adminGuard } from './Guards/admin.guard';
import { studentGuard } from './Guards/student.guard';
import { NotFoundComponent } from './Component/NotFound/not-found/not-found.component';

import LoginComponent from './Component/Login/login/login.component';
import { RegistrationComponent } from './Component/Registration/registration.component';
import { TeacherComponent } from './Component/Teacher/teacher.component';

import { StuInfoComponent } from './Component/Teacher/stu-info/stu-info.component';
import { LectureComponent } from './Component/Teacher/lecture/lecture.component';


import { AdminComponent } from './Component/Admin/admin.component';
import { UploadComponent } from './Component/Teacher/Upload_lesson/upload/upload.component';
import { StudentComponent } from './Component/student/student.component';
import { HomeworkComponent } from './Component/Teacher/homework/homework.component';
import { ChatComponent } from './Component/Teacher/chat/chat.component';
import { LecturesStudentComponent } from './Component/student/lectures-student/lectures-student.component';
import { SubmittedhomeworkDetailComponent } from './Component/Teacher/homework/submittedhomework-detail/submittedhomework-detail.component';
import { ReceiptComponent } from './Component/Admin/receipt/receipt.component';
import { ManageAccountsComponent } from './Component/Admin/manage-accounts/manage-accounts.component';
import { WatchVedioComponent } from './Component/student/Watching/watch-vedio/watch-vedio.component';
import { ReceiptStudentComponent } from './Component/student/receipt/receipt-student/receipt-student.component';
import { HomeWorksAcceptedComponent } from './Component/Teacher/AcceptedAndRejected/home-works-accepted/home-works-accepted.component';
import { DetailsComponent } from './Component/Teacher/Details/details/details.component';
import { LessonIncomeComponent } from './Component/Teacher/lesson-income/lesson-income.component';
import { WishlistComponent } from './Component/student/wishlist/wishlist.component';
import { ReceiptCardComponent } from './Component/Admin/receipt-card/receipt-card.component';
import { MyLessonsComponent } from './Component/student/my-lessons/my-lessons.component';
import { MyProfileComponent } from './Component/Teacher/my-profile/my-profile.component';
import { ManageUserAccountsComponent } from './Component/Teacher/manage-user-accounts/manage-user-accounts.component';
import { MyProfileSTUComponent } from './Component/student/my-profile-stu/my-profile-stu.component';
import { QuestationAndAnswerStuComponent } from './Component/student/questation-and-answer-stu/questation-and-answer-stu.component';
import { AllQuestionComponent } from './Component/Teacher/all-question/all-question.component';
import { QuestionsComponent } from './Component/Teacher/questions/questions.component';
import { PaypalComponent } from './Component/student/PayPalPage/paypal/paypal.component';
import { TeacherLiveSessionComponent } from './Component/Teacher/teacher-live-session/teacher-live-session.component';
import { StudentLiveSessionComponent } from './Component/student/student-live-session/student-live-session.component';
import { ForgotPasswordComponent } from './Component/Login/forgot-password/forgot-password.component';
import { NewPasswordComponent } from './Component/Login/SetNewPassword/newPassword';

export const routes: Routes = [
  {
    path: "",
    redirectTo: "Login",
    pathMatch: "full"
  },
  {
    path: "Login",
    component: LoginComponent
  },
  {
    path: "forgotpassword",
    component: ForgotPasswordComponent
  }
  ,
  {
    path: "forgotpassword/NewPassword",
    component: NewPasswordComponent
  },

  {
    path: "Registration",
    component: RegistrationComponent
  },
  {
    path: "student",
    component: StudentComponent,
    canActivate: [studentGuard] , children: [
      {
        path: "",
        component: LecturesStudentComponent
      },

      {
        path: "Lectures",
        component: LecturesStudentComponent
      } ,
      {
        path: "receipt",
        component: ReceiptStudentComponent
      },
      {
        path:"WatchVedio",
        component: WatchVedioComponent
      } ,
      {
        path:"Wishlist",
        component: WishlistComponent
      }
      ,
      {
        path:"MyLessons",
        component: MyLessonsComponent
      }
      ,
      {
        path:"MyProfile",
        component: MyProfileSTUComponent
      }
      ,
      {
        path:"commonquestions",
        component: QuestationAndAnswerStuComponent
      }
      ,
      {
        path:"PayPal",
        component: PaypalComponent
      }
      ,
      {
        path:"livesession",
        component:StudentLiveSessionComponent
      }

    ]
  },
  {
    path: "admin",
    component: AdminComponent,
    canActivate: [adminGuard] ,children:[
      {
        path: "Receipt",
        component: ReceiptComponent

      },

      {
        path: "",
        component: ReceiptComponent
      },

      {
        path: "Receipt/:id",
        component: ReceiptCardComponent
      },

      {
        path: "ManageAccounts",
        component: ManageAccountsComponent
      }




    ]
  },
  {
    path: "teacher",
    component: TeacherComponent,
    canActivate: [teacherGuard],
    children: [
      {
        path: "",
        component: StuInfoComponent
      },
      {
        path: "level/:id",
        component: LectureComponent
      },
      {
        path: "upload",
        component: UploadComponent
      } ,
      {
        path: "homework",
        component: HomeworkComponent
      },
      {
        path: "homework/:id",
        component: SubmittedhomeworkDetailComponent
      }
      ,
      {
        path: "chat",
        component: ChatComponent
      } , {
        path:"AcceptAndReject",
        component:HomeWorksAcceptedComponent
      }
      ,
      {
        path:"Details",
        component:DetailsComponent
      } ,
      {
        path:"Income",
        component:LessonIncomeComponent
      }
      ,
      {
        path:"myprofile",
        component: MyProfileComponent
      }
      ,
      {
        path:"ManageAccountAdmin",
        component: ManageUserAccountsComponent
      }
      ,
      {
        path: "AllQuestions",
        component:AllQuestionComponent
      }

      ,
      {
        path:"Questions",
        component:QuestionsComponent
      }
      ,
      {
        path:"livesession",
        component:TeacherLiveSessionComponent
      }





    ]
  },
  {
    path: "**",
    component: NotFoundComponent
  }
];
