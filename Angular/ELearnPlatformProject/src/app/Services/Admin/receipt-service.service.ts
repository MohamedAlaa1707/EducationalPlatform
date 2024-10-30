import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
  private apiUrl = 'https://localhost:7217/api/Admin/unapproved';
  private app="https://localhost:7217/api/Admin/UpdateRecepit"
  constructor(private http: HttpClient) {}

  getUnapprovedReceipts(): Observable<any[]> {


    // const token = localStorage.getItem('jwtToken');
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

 UpdateReceipt(enrollmentId: number, receiptId: number, state: string): Observable<any[]> {
  const params = new HttpParams()
  .set('EnrollmentID', enrollmentId.toString())
  .set('ReceiptId', receiptId.toString())
  .set('state', state);

    return this.http.get<any>(this.app ,{params}).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
  console.error('Error Status:', error.status);
  console.error('Full error response:', error);
  if (error.error instanceof ErrorEvent) {
    console.error('Client-side error:', error.error.message);
  } else {
    console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
  }
  return throwError('Something went wrong; please try again later.');
}


private key = 'allDetails';
SetAlldetails(data: any): void {

  sessionStorage.setItem(this.key, JSON.stringify(data));
}

GetAlldetails(): any {
  const data = sessionStorage.getItem(this.key);
  return data ? JSON.parse(data) : null;
}

}
