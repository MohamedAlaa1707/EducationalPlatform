import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, firstValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  Controller ='Admin/'
  constructor(private  Clinent:HttpClient) { }




  getUnapprovedStudents(): Observable<any[]> {
    return this.Clinent.get<any[]>(`${environment.baseUrl}${this.Controller}unapproved`);
  }


  ChangeStudentPassword(e:any): Observable<any[]> {
    return this.Clinent.post<any[]>(`${environment.baseUrl}${this.Controller}ChangeStudentPassword`,e);
  }

}
