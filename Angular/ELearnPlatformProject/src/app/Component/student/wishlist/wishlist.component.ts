import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LessonWishList } from '../../../Models/Student/lesson-wish-list';
import { StudentService } from '../../../Services/Student/student.service';
import { RelationsService } from '../../../Services/Student/relations.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {

  wishlist: LessonWishList[] = [];

  constructor(private wishlistService:StudentService ,private Test:RelationsService , private rou:Router) {}
  studinf: any;
  lesson: any;
  id: number = 0;
  level: string = '';
  lessonid: number = 0;

  ngOnInit(): void {

    this.studinf = this.Test.GetStudentInfo();
    this.lesson = this.Test.getcurrentLesson();
    if (this.studinf) {
      this.id = this.studinf.id;
      this.level = this.studinf.gradeLevel;
    }
    if (this.lesson) {
      this.lessonid = this.lesson.lessonId;
    }


    this.fetchWishlist();
  }

  fetchWishlist(): void {
    console.log(this.id)
    this.wishlistService.getWishlist(this.id).subscribe({
      next: (lessons) => {
        this.wishlist = lessons;
        console.log( this.wishlist)
      },
      error: (error) => {
        console.error('Failed to fetch wishlist', error);
      }
    });
  }
  getlesson(lesson:any){
    this.Test.setcurrentLesson(lesson)


    this.rou.navigate(['student/receipt']);


  }

  getPaypal(lesson:any){
    this.Test.setcurrentLesson(lesson)
    const total = lesson.feeAmount;
    const description = `Payment for lesson: ${lesson.title}`
    localStorage.setItem('isPaid', 'false');

    this.rou.navigate(['student/PayPal'], { state: { total, description } });
  }

  removeFromWishlist(lesson: LessonWishList): void {

    this.wishlistService.removelessonfromWishList(this.id, lesson.lessonId).subscribe({
      next: () => {
        this.fetchWishlist();
      },
      error: (error) => {
        this.wishlist.length =0
        console.error('Failed to remove lesson from wishlist', error);
      }
    });


  }

}
