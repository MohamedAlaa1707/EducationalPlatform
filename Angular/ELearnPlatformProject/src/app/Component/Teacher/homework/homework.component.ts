import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TeacherService } from '../../../Services/Teacher/teacher.service';
import { StudentsWithSubmittedHomeworks } from '../../../Models/Teacher/students-with-submitted-homeworks';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { SumHomeService } from '../../../Services/Teacher/sum-home.service';

@Component({
  selector: 'app-homework',
  standalone: true,
  imports: [CommonModule, RouterLink, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.css'],
})
export class HomeworkComponent implements OnInit, AfterViewInit {
  allStudents: StudentsWithSubmittedHomeworks[] = [];
  displayedColumns: string[] = ['index', 'userName', 'lessonTitle', 'gradeLevel', 'action'];
  dataSource = new MatTableDataSource<StudentsWithSubmittedHomeworks>(this.allStudents);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private teacherService: TeacherService,
    private sumser: SumHomeService,
    private rou: Router
  ) {}

  ngOnInit(): void {
    this.teacherService.GetAllStudentsWithSubmittedHomeworks().subscribe({
      next: (data: any) => {
        this.allStudents = data;
        this.dataSource.data = data;  // Assign data to dataSource
        this.sumser.SetAlldetails(data);
        console.log(this.allStudents)
      },
      error: (e: any) => {
        console.error(e); // Consider logging the error for debugging
      },
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;  // Assign sort after the view initializes
  }

  onclick(data: StudentsWithSubmittedHomeworks): void {
    this.sumser.SetAlldetails(data);
    this.rou.navigate([`/teacher/homework/${data.studentId}`]);
  }

  trackByStudentId(index: number, student: StudentsWithSubmittedHomeworks): number {
    return student.studentId;
  }
}
