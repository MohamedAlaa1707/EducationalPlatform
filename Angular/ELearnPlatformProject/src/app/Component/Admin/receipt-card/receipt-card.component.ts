import { CommonModule, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReceiptService } from '../../../Services/Admin/receipt-service.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-receipt-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './receipt-card.component.html',
  styleUrls: ['./receipt-card.component.css']
})

export class ReceiptCardComponent implements OnInit {

  constructor(private receiptService: ReceiptService, private http: HttpClient, private route: ActivatedRoute , private  loc:Location) {

  }

  // @Input() receipt: any = {};
  receipt: any;
  receiptId: any;

  studentName: string = '';
  gradeLevel: string = '';
  title: string = '';
  feeAmount: number = 0;
  receiptImageLink: string = '';
  enrollmentID: number = 1;
  state: string = '';


  successMessage: string | null = null;
  errorMessage: string | null = null;




  ngOnInit() {

    this.receiptId=this.route.snapshot.paramMap.get('id');

    this.fetchReceipts();
  }





  fetchReceipts() {
    this.receipt=  this.receiptService.GetAlldetails()
           this.studentName = this.receipt.name || '';
          this.gradeLevel = this.receipt.gradeLevel || '';
          this.title = this.receipt.title || '';
          this.feeAmount = this.receipt.feeAmount || 0;
          this.receiptImageLink = this.receipt.receiptImageLink || '';
          this.receiptId = this.receipt.receiptId || 1;
          this.enrollmentID = this.receipt.enrollmentID;



          // -------------------------------------------------------------
    // this.http.get<any[]>(`https://localhost:7217/api/Admin/unapproved`).subscribe
    // this.receiptService.getUnapprovedReceipts().subscribe(

    //   (data) => {

    //     if (data && data.length > 0) {

    //       this.receipt=data[0]
    this.receipt.studentName=this.studentName
    //       this.studentName = this.receipt.name || '';
    //       this.gradeLevel = this.receipt.gradeLevel || '';
    //       this.title = this.receipt.title || '';
    //       this.feeAmount = this.receipt.feeAmount || 0;
    //       this.receiptImageLink = this.receipt.receiptImageLink || '';
    //       this.receiptId = this.receipt.receiptId || 1;
    //       this.enrollmentID = this.receipt.enrollmentID;

    //     } else {
    //       console.error('No receipts returned from the API');
    //     }
    //   },
    //   (error) => {
    //     console.error('Failed to fetch receipts', error);
    //   }
    // );
  }


  onAccept() {
    this.state = 'accept';
    this.submitReceiptStatus(this.receipt.enrollmentID, this.receipt.receiptId);
  }

  onReject() {
    this.state = 'reject';
    this.submitReceiptStatus(this.receipt.enrollmentID, this.receipt.receiptId);
  }

  submitReceiptStatus(e: number, i: number) {
    this.receiptService.UpdateReceipt(e, i, this.state).subscribe({
      next: (d) => {

        this.successMessage = 'Receipt status updated successfully';
        this.errorMessage = null;

        this.loc.back()
      },
      error: (e: any) => {
        this.successMessage = null;
        this.errorMessage = 'Failed to update receipt status. Please try again later.';
      }
    });
  }
}
