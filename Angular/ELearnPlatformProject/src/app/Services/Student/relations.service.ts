import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RelationsService {

  Lessons : any;
  StudentInfo : any;
  currentLesson:any



  setLesson( ParamOne :any){
    this.Lessons=ParamOne;
    // console.log(this.Lessons);
  }





  private key1 = 'allDetails';
  setcurrentLesson(data: any): void {

    sessionStorage.setItem(this.key1, JSON.stringify(data));
  }

  getcurrentLesson(): any {
    const data = sessionStorage.getItem(this.key1);
    return data ? JSON.parse(data) : null;
  }


  private key2 = 'f';

  setStudentInfo(data: any): void {

    sessionStorage.setItem(this.key2, JSON.stringify(data));
  }

  GetStudentInfo(): any {
    const data = sessionStorage.getItem(this.key2);
    return data ? JSON.parse(data) : null;
  }

  constructor() { }
}
