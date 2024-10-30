import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, Observable } from 'rxjs';
import { UploadLesson } from '../../Models/Teacher/upload-lesson';
import { ReplyToQuestion } from '../../Models/Teacher/reply-to-question';
import { AcceptorrejectHomework } from '../../Models/Teacher/acceptorreject-homework';
import { LessonStats } from '../../Models/Teacher/lesson-stats';
@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  Controller ='Teacher/'
 id:number=0
 private key = 'nn';
  private unansweredQuestionsCount = new BehaviorSubject<number>(0);
  currentCount = this.unansweredQuestionsCount.asObservable();

  constructor(private  Clinent:HttpClient) { }


  getLessonsByGradeLevel(gradeLevel: string): Observable<any> {
    return this.Clinent.get<any>(`${environment.baseUrl}${this.Controller}${gradeLevel}`);
  }
  GetStudentsWithSubmittedHomeworks()
  {
    return this.Clinent.get(`${environment.baseUrl}${this.Controller}GetOLD10StudentsWithSubmittedHomeworks`);
  }
  GetCountOfQuestionNotReplying ():Observable<any>
  {

    return this.Clinent.get<any>(`${environment.baseUrl}${this.Controller}QuestionAndCountOfNotReplyFromTeacher`);
  }


  GetNumberOfVideosByLevel ():Observable<any>
  {

    return this.Clinent.get<any>(`${environment.baseUrl}${this.Controller}GetNumberOfVideosByLevel`);
  }


   AddNewLesson( NewLesson:any):Observable<any>{

    console.log(NewLesson)
    return this.Clinent.post<any>(`${environment.baseUrl}${this.Controller}Uploadlesson` ,NewLesson);
   }



   GetAllUnansweredQuestions():Observable<any>{
    return this.Clinent.get<any>(`${environment.baseUrl}${this.Controller}unansweredByLesson` );
   }

   SendReplyMessege(rep:ReplyToQuestion):Observable<any>{
    return this.Clinent.post<any>(`${environment.baseUrl}${this.Controller}replyToQuestion`,rep );
   }



   updateCount(count: number) {
    this.unansweredQuestionsCount.next(count);
  }



 GetAllStudentsWithSubmittedHomeworks()
  {
    return this.Clinent.get(`${environment.baseUrl}${this.Controller}GetStudentsWithSubmittedHomeworks`);
  }



  acceptorrejectHomework(data:AcceptorrejectHomework)
  {
    return this.Clinent.post(`${environment.baseUrl}${this.Controller}acceptorrejectHomework`,data);
  }


  Upload(data:any)
  {
    return this.Clinent.post("https://localhost:7217/api/Media/Uploadlesson",data);
  }

  CountsAllStudentAccpetAndRejectOnLesson():Observable<any>{
    return this.Clinent.get<any>(`${environment.baseUrl}${this.Controller}CountsAllStudentAccpetAndRejectOnLesson` );
   }

   getid(){

    const data = sessionStorage.getItem(this.key);
    return data ? JSON.parse(data) : null;

   }
   setid(e:number){
    sessionStorage.setItem(this.key, JSON.stringify( e));
   }

   AllStudentAccpetAndRejectOnLesson(id:number):Observable<any>{
    return this.Clinent.get<any>(`${environment.baseUrl}${this.Controller}AllStudentAccpetAndRejectOnLesson/${id}` );
   }

   getLessonStats(): Observable<LessonStats[]> {

    return this.Clinent.get<LessonStats[]>(`${environment.baseUrl}${this.Controller}GetLessonStatsLast14Days`);
  }


  Updateaccount(a:any): Observable<LessonStats[]> {

    return this.Clinent.put<LessonStats[]>(`${environment.baseUrl}${this.Controller}ChangeAnyUserPassword`,a);
  }




  AllQuestionAndReplyFromSelectedQuestion()
  {
    return this.Clinent.get(`${environment.baseUrl}${this.Controller}AllQuestionAndReplyFromSelectedQuestion`)
  }

  GetAllQuestionsAndRepliesonForCommanQuestion()
  {
    return this.Clinent.get(`${environment.baseUrl}${this.Controller}GetAllQuestionsAndRepliesonForCommanQuestion`)
  }

  saveCommonQuestionChosen(x:any)
  {


    return this.Clinent.post(`${environment.baseUrl}${this.Controller}saveSelectedQuestions`,x)
  }

  RemoveQuestion(a:number): Observable<LessonStats[]> {

    return this.Clinent.delete<LessonStats[]>(`${environment.baseUrl}${this.Controller}RemoveQuestion/${a}`);
  }



  UpdateLesson(id:number ,data:any): Observable<LessonStats[]> {

    return this.Clinent.put<LessonStats[]>(`${environment.baseUrl}${this.Controller}UpdateLesson/${id}`,data);
  }

}
