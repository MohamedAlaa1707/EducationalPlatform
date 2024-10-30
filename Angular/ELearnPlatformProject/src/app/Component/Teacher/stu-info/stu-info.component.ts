import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { UserAuthService } from '../../../Services/User/user-auth.service';
import { TeacherService } from '../../../Services/Teacher/teacher.service';
import { CommonModule } from '@angular/common';
import { CountOfVideoLevels } from '../../../Models/Teacher/count-of-video-levels';
import { SumHomeService } from '../../../Services/Teacher/sum-home.service';
import { StudentsWithSubmittedHomeworks } from '../../../Models/Teacher/students-with-submitted-homeworks';
import { LessonIncomeComponent } from '../lesson-income/lesson-income.component';


@Component({
  selector: 'app-stu-info',
  standalone: true,
  imports: [ RouterLink,CommonModule,RouterModule ,LessonIncomeComponent],
  templateUrl: './stu-info.component.html',
  styleUrl: './stu-info.component.css'
})
export class StuInfoComponent  implements OnInit{


  Name:string="Mohamed"
  CountOfVideoLevels: CountOfVideoLevels;
  allStudents: StudentsWithSubmittedHomeworks[]=[]
  constructor(
    private service:UserAuthService ,
    public MyServ:TeacherService ,private sumser:SumHomeService , private rou:Router ){
      this.CountOfVideoLevels = {
        level1: '',
        level2: '',
        level3: ''
      };

  }

  ngOnInit(): void {
    if (localStorage.getItem("token")) {
    this.service.getRoleAndName().subscribe({
     next: (d) => {
        this.Name= d.username
     },
     error: (e: any) => {

     }
   });

   }

   ///
   this.MyServ.GetStudentsWithSubmittedHomeworks().subscribe({
    next:(data:any)=> {
      this.allStudents= data
    },
    error:(err)=> {
      console.log("Error is");
    },
   });


  //jjjjjjjjjjjjjjjjjjjjjjjjjj

  this.MyServ.GetNumberOfVideosByLevel().subscribe({
    next:(data)=> {
      this.CountOfVideoLevels.level1=data.f;
      this.CountOfVideoLevels.level2=data.s;
      this.CountOfVideoLevels.level3=data.t;
    },
    error:(err)=> {
      console.log("Error is");
    },
   });
  }


  onclick(data: StudentsWithSubmittedHomeworks): void {
    this.sumser.SetAlldetails(data);
    this.rou.navigate([`/teacher/homework/${data.studentId}`]);
  }

  trackByStudentId(index: number, student: StudentsWithSubmittedHomeworks): number {
    return student.studentId;
  }




}
