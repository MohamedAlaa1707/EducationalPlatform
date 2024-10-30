import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



export interface PaymentRequest {
  total: number;
  currency: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentRequestService {

  private Endpoint = "https://localhost:7217/api/PayPal/";

  constructor(private http: HttpClient) {}

  getPaymentById(paymentId: string): Observable<any> {
    return this.http.get<any>(this.Endpoint+'payment/'+paymentId);
  }

  addPayment(paymentDate: any) {
    return this.http.post<any>(this.Endpoint+'create-payment',paymentDate);
  }

 
}
