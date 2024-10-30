import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TeacherService } from '../../../../Services/Teacher/teacher.service';
import { ALLStudentAcceptAndRejectDTO } from '../../../../Models/Teacher/allstudent-accept-and-reject-dto';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-home-works-accepted',
  standalone: true,
  imports: [RouterLink, CommonModule, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './home-works-accepted.component.html',
  styleUrls: ['./home-works-accepted.component.css']
})
export class HomeWorksAcceptedComponent implements OnInit {
  allcount: ALLStudentAcceptAndRejectDTO[] = [];
  displayedColumns: string[] = ['level', 'lessonName', 'countOfAccept', 'countOfreject', 'actions'];
  dataSource = new MatTableDataSource<ALLStudentAcceptAndRejectDTO>(this.allcount);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private teacherservice: TeacherService, private rou: Router) {}

  ngOnInit(): void {
    this.teacherservice.CountsAllStudentAccpetAndRejectOnLesson().subscribe({
      next: (data: ALLStudentAcceptAndRejectDTO[]) => {
        this.allcount = data;
        this.dataSource.data = this.allcount; // Assign the fetched data to the data source
        console.log(this.allcount);
      },
      error: (e: any) => {
        console.error(e); // Consider logging the error for debugging
      },
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Assign paginator
    this.dataSource.sort = this.sort; // Assign sorter
  }

  gotodetails(idlesson: number) {
    console.log(idlesson);
    this.teacherservice.setid(idlesson);
    this.rou.navigate(['/teacher/Details']);
  }
}
