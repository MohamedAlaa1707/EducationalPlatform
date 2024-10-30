
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { log } from 'console';
import { EditLectureComponent } from '../edit-lecture/edit-lecture.component';
import { LectureService } from '../../../Services/Teacher/lecture.service';


@Component({
  selector: 'app-lecture-card',
  standalone: true,
  imports: [CommonModule, EditLectureComponent],
  templateUrl: './lecture-card.component.html',
  styleUrls: ['./lecture-card.component.css'],
})
export class LectureCardComponent implements OnInit{
  // @Input() lecture: any;
  @Output() edit = new EventEmitter<void>();
  @Output() Save = new EventEmitter<any>();


  ///
  levelId: string | null = null;
  grade: 'F' | 'S' | 'T' = 'F'
  lectures: any
  selectedLec: any


  constructor(private route: ActivatedRoute, private lectureService: LectureService) {}

  ngOnInit(): void {

    this.levelId = this.route.snapshot.paramMap.get('id');
    console.log('Level ID:', this.levelId);

    if(this.levelId=='1'){
      this.grade='F'
    }
    else if(this.levelId=='2'){
      this.grade='S'
    }
    else if(this.levelId=='3'){
      this.grade='T'
    }


    this.getLessonsByGradeLevel();

  }

  getLessonsByGradeLevel(){
    // debugger;
    this.lectureService.getLessonsByGradeLevel(this.grade).subscribe((response)=>{console.log(response);
      this.lectures=response
    })

  }

  showModal: boolean= false;

  onEdit(lec: any) {
    this.selectedLec = lec;
    this.edit.emit();
    console.log('test on edit button')
    this.showModal = true

  }

  onSave(updatedLecture: any) {
    const gradeLevel = updatedLecture.gradeLevel;

    this.lectureService.getLessonsByGradeLevel(gradeLevel).subscribe({
      next: (lessons) => {
        console.log('Updated lessons:', lessons);
        this.onClose();
      },
      error: (error) => {
        console.error('Error fetching updated lessons:', error);
      }
    });
    console.log('test on save')
  }


onClose(): void { this.showModal = false; console.log('close test') ; this.getLessonsByGradeLevel();}

}
