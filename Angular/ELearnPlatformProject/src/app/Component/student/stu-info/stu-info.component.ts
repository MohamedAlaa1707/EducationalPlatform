import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { UserAuthService } from '../../../Services/User/user-auth.service';
import { TeacherService } from '../../../Services/Teacher/teacher.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stu-info',
  standalone: true,
  imports: [ RouterLink,CommonModule,RouterModule],
  templateUrl: './stu-info.component.html',
  styleUrl: './stu-info.component.css'
})
export class StuInfoComponent  implements OnInit{

  Name:string="Mohamed"
  Number:number=15;
  StudenntHomeWork : any; //Api GetStudentsWithSubmittedHomeworks
  constructor(
    private service:UserAuthService ,
    public MyServ:TeacherService){


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
    next:(data)=> {
      this.StudenntHomeWork=data;
    },
    error:(err)=> {
      console.log("Error is");    
    },
   });
  }
}
