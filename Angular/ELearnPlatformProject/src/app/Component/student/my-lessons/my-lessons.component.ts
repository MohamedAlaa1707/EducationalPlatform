import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../Services/Student/student.service';
import { Lesson } from '../../../Models/Student/lesson';
import { CommonModule } from '@angular/common';
import { RelationsService } from '../../../Services/Student/relations.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-lessons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-lessons.component.html',
  styleUrl: './my-lessons.component.css'
})
export class MyLessonsComponent implements OnInit {

  stuid:number=0;
  paidLessons: Lesson[] = [];
  errorMessage: string = '';
  constructor(private studentLessonService: StudentService , private res:RelationsService , private rou:Router){}

  ngOnInit(): void {

     var stuinf =  this.res.GetStudentInfo()
     this.stuid= stuinf.id


    this.getPaidLessons();
  }


  getPaidLessons() {
    this.studentLessonService.getmylessonS(this.stuid).subscribe({
      next: (data: Lesson[]) => {
        this.paidLessons = data;

        console.log(this.paidLessons)
      },
      error: (error: any) => {
        console.error('Error fetching paid lessons', error);
        this.errorMessage = 'Failed to load your lessons. Please try again later.';
      }
    });
  }


  watchLesson(lesson: any): void {

    this.res.setcurrentLesson(lesson) ;
    this.rou.navigate(['student/WatchVedio/'])

  }


}
