import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { LessonWishList } from '../../Models/Student/lesson-wish-list';
import { UploadStudentHomework } from '../../Models/Student/upload-student-homework';
import { Lesson } from '../../Models/Student/lesson';
@Injectable({
  providedIn: 'root'
})
export class StudentService {
  Controller ='Student/'
  DB_URL = "https://localhost:7217/api/Student/GetStudentInfo"

  constructor(private readonly  Clinent:HttpClient) { }
  GetInfoAboutStudentCard()
  {
    return this.Clinent.get(this.DB_URL);
  }


  getWishlist(id:number): Observable<LessonWishList[]> {
    return this.Clinent.get<LessonWishList[]>(`${environment.baseUrl}${this.Controller}GetFavoriteLessons/${id}`);
  }

 

  uploadStudentHomework(newhomework: any): Observable<void> {
    return this.Clinent.post<void>(`${environment.baseUrl}${this.Controller}UploadHomework`,newhomework);
  }

  getallmessege(newhomework: any): Observable<void> {
    return this.Clinent.post<void>(`${environment.baseUrl}${this.Controller}getallquestionandreply`,newhomework);
  }

  sendmessage(data:any): Observable<void> {
    return this.Clinent.post<void>(`${environment.baseUrl}${this.Controller}setQuestionforStudentinlesson`,data);
  }

  getmylessonS(id: number): Observable<Lesson[]> {
    return this.Clinent.get<Lesson[]>(`${environment.baseUrl}${this.Controller}studentLessons/${id}`);
  }

  changeMyPassword(data: any): Observable<Lesson[]> {
    return this.Clinent.post<Lesson[]>(`${environment.baseUrl}${this.Controller}ChangePassword`,data);
  }

  UploadReceipt(data: any): Observable<Lesson[]> {
    return this.Clinent.post<Lesson[]>(`${environment.baseUrl}${this.Controller}UploadReceit`,data);
  }

  removelessonfromWishList(id: number ,lessonId:number): Observable<Lesson[]> {

    let params = new HttpParams()
    .set('studentid', id.toString())
    .set('lessonid', lessonId.toString());
    return this.Clinent.delete<any>(`${environment.baseUrl}${this.Controller}RemoveWishlist`  ,{params});
  }




  addtoWishlist(id: number ,lessonId:number): Observable<any> {

    let params = new HttpParams()
    .set('studentid', id.toString())
    .set('lessonid', lessonId.toString());
    return this.Clinent.get<any>(`${environment.baseUrl}${this.Controller}addtoWishlist`,{params});
  }


  getQAbyGreadleval(level:string){
    return this.Clinent.get(`${environment.baseUrl}${this.Controller}commonQA/${level}`);
  }


  AddNewEnrollmen(id: number ,lessonId:number): Observable<any> {

    let params = new HttpParams()
    .set('studentid', id.toString())
    .set('lessonid', lessonId.toString());
    return this.Clinent.get<any>(`${environment.baseUrl}${this.Controller}AddNewEnrollmen`,{params});
  }

}
