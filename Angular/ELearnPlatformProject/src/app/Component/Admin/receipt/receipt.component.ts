import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { ReceiptService } from '../../../Services/Admin/receipt-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [CommonModule , MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css'],
})
export class ReceiptComponent implements OnInit {
  displayedColumns: string[] = ['index', 'name', 'title', 'gradeLevel', 'details'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private receiptService: ReceiptService, private router: Router) {}

  ngOnInit() {
    console.log('ReceiptComponent initialized');
    this.fetchReceipts();
  }

  fetchReceipts() {
    console.log('fetchReceipts method called');
    this.receiptService.getUnapprovedReceipts().subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.dataSource.data = data;
          console.log(this.dataSource.data);
        } else {
          console.error('No receipts returned from the API');
        }
      },
      (error) => {
        console.error('Failed to fetch receipts', error);
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  viewReceiptDetails(receipt: any) {
    this.receiptService.SetAlldetails(receipt);
    this.router.navigate(["admin/Receipt/" + receipt.receiptId]);
  }
}
