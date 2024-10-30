import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EditLectureComponent } from '../edit-lecture/edit-lecture.component';
import { Router } from '@angular/router';
import { LectureCardComponent } from '../lecture-card/lecture-card.component';

@Component({
  selector: 'Lessons',
  standalone: true,
  imports: [LectureCardComponent, EditLectureComponent],
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.css'],
})
export class LectureComponent implements OnInit {
  lectures: any[] = [];
  selectedLecture = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchLectures();
  }

  fetchLectures() {

    const level: string = '1';

    let gradeLevel = '';
    switch (level) {
      case '1':
        gradeLevel = 'F';
        break;
      case '2':
        gradeLevel = 'S';
        break;
      case '3':
        gradeLevel = 'T';
        break;
      default:
        console.error('Unknown level');
        return;
    }


    this.http.get<any[]>(`https://localhost:7217/api/Teacher/GetLessonsByGradeLevel`)
.subscribe(
    (data) => {
        this.lectures = data;
    },
    (error) => {
        console.error('Failed to fetch lessons', error);
    }
);


  }

  onEditLecture(lecture: any) {
    this.selectedLecture = lecture;
  }

  onSaveLecture(updatedLecture: any) {
    this.lectures = this.lectures.map((lec) =>
      lec.id === updatedLecture.id ? updatedLecture : lec
    );
    this.selectedLecture = null;
  }

  onCloseModal() {
    this.selectedLecture = null;
  }
}
