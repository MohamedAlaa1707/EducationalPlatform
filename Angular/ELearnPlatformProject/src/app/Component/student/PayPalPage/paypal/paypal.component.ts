import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaymentRequest, PaymentRequestService } from '../../../../Services/PayPal/payment-request.service';
import { RelationsService } from '../../../../Services/Student/relations.service';
import { StudentService } from '../../../../Services/Student/student.service';

@Component({
  selector: 'app-paypal',
  standalone: true,
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css'],
  imports: [FormsModule, CommonModule]
})
export class PaypalComponent implements OnInit {
  paymentId: string | null = null;
  approvalUrl: string | null = null;
  paymentRequest!: PaymentRequest;
  lesson: any;
  state: any;
  lessonid:number=0
  userid:number=0
  studeninfo:any

  constructor(private paypalService: PaymentRequestService, private router: Router, private mylesson: RelationsService , private studentser:StudentService) {
    const navigation = this.router.getCurrentNavigation();
  }

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    this.paymentId = urlParams.get('paymentId');
    this.lesson = this.mylesson.getcurrentLesson();
    this.studeninfo = this.mylesson.GetStudentInfo()



    if (this.lesson && this.studeninfo) {
      this.lessonid = this.lesson.lessonId;
      this.userid = this.studeninfo.id;
    }
  
    this.state = { total: this.lesson.feeAmount, description: `Payment for lesson: ${this.lesson.title}` };
    console.log(this.state);
    this.checkPaymentStatus();
  }

  createPayment(): void {
    console.log(this.state);
    const paidStatus = localStorage.getItem('isPaid');
    if (paidStatus === 'true') {
      return;
    }

    let total = this.state.total;
    let description = this.state.description;
    this.paymentRequest = {
      total: total,
      currency: 'USD',
      description: description,
      returnUrl: 'http://localhost:4200/student/PayPal',
      cancelUrl: 'http://localhost:4200/student/errors'
    };

    this.paypalService.addPayment(this.paymentRequest).subscribe(
      (response: { approvalUrl: string }) => {
        this.approvalUrl = response.approvalUrl;
        if (this.approvalUrl) {
          window.location.href = this.approvalUrl;
        } else {
          console.error('Approval URL not found in response.');
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Payment creation failed', error.message);
      }
    );
  }

  checkPaymentStatus(): void {
    console.log("check");
    const paidStatus = localStorage.getItem('isPaid');
    if (paidStatus === 'true') {
      localStorage.removeItem('isPaid');
    }

    this.getPayment();
  }

  getPayment(): void {
    if (this.paymentId) {
      this.paypalService.getPaymentById(this.paymentId).subscribe(
        (paymentDetails: any) => {
          console.log('Payment details:', paymentDetails);
          if (paymentDetails.state === 'created') {

                           this.studentser.AddNewEnrollmen(this.userid,this.lessonid).subscribe({
                            next: (res) => {
                              localStorage.removeItem('paymentId')
                              this.router.navigate(['/student'])
                            },
                            error: (e: any) => {
                              console.log(e);
                            }
                          });
          } else {
            console.log('Payment not confirmed.');
          }
        },
        (error: HttpErrorResponse) => {
          console.error('Failed to retrieve payment details', error.message);
        }
      );
    } else {
      console.error('Payment ID is required to retrieve payment details.');
    }
  }
}
