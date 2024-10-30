import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { TeacherService } from '../../../Services/Teacher/teacher.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-all-question',
  standalone: true,
  imports:  [CommonModule, RouterModule, MatPaginatorModule, MatSortModule ,RouterModule ,MatTableModule],
  templateUrl: './all-question.component.html',
  styleUrls: ['./all-question.component.css']
})
export class AllQuestionComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['gradeLevel', 'lessonTitle', 'question', 'reply', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private myserv: TeacherService) {}

  ngOnInit(): void {
    this.uploadQuestion();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  uploadQuestion() {
    this.myserv.AllQuestionAndReplyFromSelectedQuestion().subscribe({
      next: (data: any) => {
        this.dataSource.data = data; // Set data for the table
        console.log(this.dataSource.data);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  deleteQuestion(questionID: any) {
    this.myserv.RemoveQuestion(questionID).subscribe({
      next: (data: any) => {
        this.uploadQuestion();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
