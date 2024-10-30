import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { LessonStats } from '../../../Models/Teacher/lesson-stats';

// Register the necessary components
Chart.register(...registerables);



@Component({
  selector: 'app-lesson-status-chart',
  standalone:true,

  templateUrl: './lesson-status-chart.component.html',
  styleUrls: ['./lesson-status-chart.component.css']
})
export class LessonStatusChartComponent implements OnInit {


  level1: LessonStats[] = [];
level2: LessonStats[] = [];
level3: LessonStats[] = [];
errorMessage: string = '';
totalIncome1: number = 0;
totalIncome2: number = 0;
totalIncome3: number = 0;
  @ViewChild('myChart') myChart!: ElementRef<HTMLCanvasElement>;
  lessonStats: any[] = [];

  chart: Chart | null = null;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getLessonStats();
  }

  getLessonStats() {
    this.http.get<any[]>('https://localhost:7217/api/Teacher/GetLessonStatsLast14Days').subscribe(
      (data) => {
        this.lessonStats = data;
        //عرض إحسائيات كل ليفل
        this.level1 = data.filter(lesson => lesson.level === 'F');
        this.level2 = data.filter(lesson => lesson.level === 'S');
        this.level3 = data.filter(lesson => lesson.level === 'T');
        //حساب اجمالي كل ليفل
        this.totalIncome1 = this.calculateTotalIncome(this.level1);
        this.totalIncome2 = this.calculateTotalIncome(this.level2);
        this.totalIncome3 = this.calculateTotalIncome(this.level3);
        this.prepareChartData();
      },
      (error) => {
        console.error('Error fetching lesson stats:', error);
      }
    );
  }

  calculateTotalIncome(levelLessons: LessonStats[]): number {
    return levelLessons.reduce((total, lesson) => total + lesson.totalFeeCollected, 0);
  }

  prepareChartData() {
    const totalFees = [this.totalIncome1,this.totalIncome2 , this.totalIncome3 ];
     const numbOfStudents = this.lessonStats.map(stat => stat.numberOfStudents);
    const labels = ['Level 1','Level 2','Level 3']

    // Destroy the previous chart instance if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    // Create a new chart instance
    this.chart = new Chart(this.myChart.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Fee Collected',
          data: totalFees,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const index = tooltipItem.dataIndex;
                const totalFee = tooltipItem.raw;
                const numberOfStudents = numbOfStudents[index];

                return `Total Fee: ${totalFee} - Number of Students: ${numberOfStudents}`;
              }
            }
          }
        }
      }
    });
  }
}
