import { Component, OnInit } from '@angular/core';
import { SumHomeService } from '../../../../Services/Teacher/sum-home.service';
import { TeacherService } from '../../../../Services/Teacher/teacher.service';
import { AcceptorrejectHomework } from '../../../../Models/Teacher/acceptorreject-homework';
import { Router } from '@angular/router';
import { StudentsWithSubmittedHomeworks } from '../../../../Models/Teacher/students-with-submitted-homeworks';

@Component({
  selector: 'app-submittedhomework-detail',
  templateUrl: './submittedhomework-detail.component.html',
  styleUrls: ['./submittedhomework-detail.component.css'],
})
export class SubmittedhomeworkDetailComponent implements OnInit {
  allde: StudentsWithSubmittedHomeworks = {
    gradeLevel: '',
    lessonId: 0,
    lessonTitle: '',
    studentId: 0,
    submissionDate: '',
    submissionLink: '',
    userName: '',
  };

  constructor(private sumser: SumHomeService, private teachserv: TeacherService, private rou: Router) {}

  ngOnInit(): void {


    this.allde = this.sumser.GetAlldetails();
    console.log(this.allde);
  }

  onaccept(lessonid: number, studentid: number): void {
    const data: AcceptorrejectHomework = { lessonid, studentid, state: 'accept' };

    this.teachserv.acceptorrejectHomework(data).subscribe({
      next: () => {
        this.rou.navigate(['/teacher/homework']);
      },
      error: (e: any) => {
        console.error(e);
      },
    });
  }

  onreject(lessonid: number, studentid: number): void {
    const data: AcceptorrejectHomework = { lessonid, studentid, state: 'reject' };

    this.teachserv.acceptorrejectHomework(data).subscribe({
      next: () => {
        this.rou.navigate(['/teacher']);
      },
      error: (e: any) => {
        console.error(e);
      },
    });
  }


}
