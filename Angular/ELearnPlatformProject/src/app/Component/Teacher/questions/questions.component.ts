import { Component, OnInit, ViewChild } from '@angular/core';
import { TeacherService } from '../../../Services/Teacher/teacher.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCheckboxModule , MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  dataSource = new MatTableDataSource<any>(); // استخدام MatTableDataSource
  selectedQuestions: any[] = []; // Array to store selected questions
  displayedColumns: string[] = ['gradeLevel', 'lessonTitle', 'question', 'reply', 'selected']; // Define the columns to display
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator; // ViewChild to access paginator

  constructor(private myserv: TeacherService) {}

  ngOnInit(): void {
    this.myserv.GetAllQuestionsAndRepliesonForCommanQuestion().subscribe({
      next: (data: any) => {
        this.dataSource.data = data; // تعيين البيانات إلى dataSource
        console.log(this.dataSource.data);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // Handle paginator changes
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // تعيين paginator إلى dataSource
    this.dataSource.sort = this.sort;
  }

  sendSelectedQuestions(): void {
    this.selectedQuestions = this.dataSource.data
      .filter(question => question.selected)
      .map(question => ({
        gradeLevel: question.gradeLevel,
        lessonName: question.lessonTitle,
        question: question.question,
        reply: question.reply
      }));

    // استدعاء الخدمة لإرسال الأسئلة المحددة
    this.myserv.saveCommonQuestionChosen(this.selectedQuestions).subscribe({
      next: (data: any) => {
        // بعد إرسال الأسئلة، قم بإزالة الأسئلة المحددة من المصفوفة
        this.dataSource.data = this.dataSource.data.filter(question => !question.selected);
        console.log('Selected questions sent:', this.selectedQuestions);
      },
      error: (err) => {
        console.error(err);
      }
    });

    console.log(this.selectedQuestions);
  }
}
