

import { Component,OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserAuthService } from '../../../../Services/User/user-auth.service';
import { TeacherService } from '../../../../Services/Teacher/teacher.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-nav-par',
  standalone: true,
  imports: [ RouterLink ,CommonModule],
  templateUrl: './nav-par.component.html',
  styleUrl: './nav-par.component.css',

})
export class NavParComponent implements OnInit , OnChanges {
  Name:any=""
  QuestionNotReplying:any=''
  constructor(private service:UserAuthService , private teacherService:TeacherService , private rou: Router){


  }

  isDropdownOpen = false;

    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    }
  ngOnChanges(changes: SimpleChanges): void {
    this.updateQuestionCount()
  }
  logout(){

    localStorage.removeItem("token")
     this.rou.navigate(['\Login'])

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

  this.updateQuestionCount()

  this.teacherService.currentCount.subscribe(count => {
    this.QuestionNotReplying = count;
  });

   }


   updateQuestionCount(): void {
    this.teacherService.GetCountOfQuestionNotReplying().subscribe({
      next: (ed) => {
        this.QuestionNotReplying = ed.count;
        this.teacherService.updateCount(this.QuestionNotReplying);
      },
      error: (e: any) => { }
    });
  }




}
