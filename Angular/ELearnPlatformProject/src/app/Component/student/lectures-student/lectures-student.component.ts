import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { StudentService } from '../../../Services/Student/student.service';
import { RelationsService } from '../../../Services/Student/relations.service';
import test from 'node:test';

@Component({
  selector: 'app-lectures-student',
  standalone: true,
  imports: [CommonModule ,RouterModule ,CurrencyPipe],
  templateUrl: './lectures-student.component.html',
  styleUrl: './lectures-student.component.css'
})
export class LecturesStudentComponent implements OnInit  {
  isPaid:boolean=false
  public successMessage: string | null = null;
  public ErrorMessage: string | null = null;

  id:number=0
  WatchVedio(e:any)
  {
    this.router.navigate(['student/WatchVedio'])

    this.Test.setcurrentLesson(e)

  }

  constructor (private myserv:StudentService , private Test :RelationsService ,private router: Router){}
  goToReceipt(Test:any) {
   this.Test.setcurrentLesson(Test)


    this.router.navigate(['student/receipt']);
  }



  goToReceiptpaypal(Test:any) {


    this.Test.setcurrentLesson(Test)
     const total = Test.feeAmount;
     const description = `Payment for lesson: ${Test.title}`
     localStorage.setItem('isPaid', 'false');

     this.router.navigate(['student/PayPal'], { state: { total, description } });
  }



  checkPaymentStatus(): void {
    const paidStatus = localStorage.getItem('isPaid');
    if (paidStatus === 'false') {
      this.isPaid = true;
      localStorage.removeItem('isPaid');
    }
  }
  CardDetails:any;
  Lesson:any;
  ngOnInit(): void {
    this.Uploadpage()

  }



  Uploadpage(){


    this.myserv.GetInfoAboutStudentCard().subscribe({
      next:(data :any)=>{
        console.log(data)
        this.Lesson=data.lessons;
        this.Test.setLesson(data.lessons)
        this.Test.setStudentInfo(data.studentInfo)
        this.id = this.Test.GetStudentInfo().id;
        this.checkPaymentStatus();

      },
      error:()=>{
        console.log("Eror");
      },
    })

  }

  addToWishList(a: HTMLButtonElement ,item:any){



    this.myserv.addtoWishlist(this.id,item.lessonId).subscribe({
      next:(data :any)=>{
        this.successMessage=`${item.title} has been successfully added to your wishlist`

        this.ErrorMessage= null
        this.Uploadpage()
      },
      error:()=>{
        this.ErrorMessage= `${item.title} has already been added.`
          this.successMessage=null
      },
    })

  }

  remove(a: HTMLButtonElement ,item:any){



    this.myserv.removelessonfromWishList(this.id,item.lessonId).subscribe({
      next:(data :any)=>{
        this.successMessage=`${item.title} has been successfully Remove to your wishlist`
        this.Uploadpage()
        this.ErrorMessage= null
      },
      error:()=>{
        this.ErrorMessage= `${item.title} has already been added.`
          this.successMessage=null
      },
    })

  }
}
