import { Component } from '@angular/core';
import { TeacherService } from '../../../Services/Teacher/teacher.service';
import { LessonStats } from '../../../Models/Teacher/lesson-stats';
import { CommonModule } from '@angular/common';
import { Console } from 'console';
import { LessonStatusChartComponent } from '../lesson-status-chart/lesson-status-chart.component';

@Component({
  selector: 'app-lesson-income',
  standalone: true,
  imports: [CommonModule ,LessonStatusChartComponent],
  templateUrl: './lesson-income.component.html',
  styleUrl: './lesson-income.component.css'
})
export class LessonIncomeComponent {
  lessonStats: LessonStats[] = [];
  level1: LessonStats[] = [];
  level2: LessonStats[] = [];
  level3: LessonStats[] = [];
  errorMessage: string = '';
  totalIncome1: number = 0;
  totalIncome2: number = 0;
  totalIncome3: number = 0;

  constructor(private lessonIncomService: TeacherService) { }

  ngOnInit(): void {
    this.getLessonStatistics();
  }

  getLessonStatistics(): void {
    this.lessonIncomService.getLessonStats().subscribe({
      next: (data: LessonStats[]) => {
        this.lessonStats = data;
        //عرض إحسائيات كل ليفل
        this.level1 = data.filter(lesson => lesson.level === 'F');
        this.level2 = data.filter(lesson => lesson.level === 'S');
        this.level3 = data.filter(lesson => lesson.level === 'T');
        //حساب اجمالي كل ليفل
        this.totalIncome1 = this.calculateTotalIncome(this.level1);
        this.totalIncome2 = this.calculateTotalIncome(this.level2);
        this.totalIncome3 = this.calculateTotalIncome(this.level3);
      },
      error: (error: any) => {
        console.error('Error fetching lesson statistics', error);
        this.errorMessage = 'Failed to load lesson statistics. Please try again later.';
      }
    });
  }

  // Function to calculate total income for each level
  calculateTotalIncome(levelLessons: LessonStats[]): number {
    return levelLessons.reduce((total, lesson) => total + lesson.totalFeeCollected, 0);
  }
}
