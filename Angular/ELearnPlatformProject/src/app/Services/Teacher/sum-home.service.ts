import { Injectable } from '@angular/core';
import { StudentsWithSubmittedHomeworks } from '../../Models/Teacher/students-with-submitted-homeworks';

@Injectable({
  providedIn: 'root'
})
export class SumHomeService {

  private studentsWithHomeworks!:StudentsWithSubmittedHomeworks
  private key = 'allDetails';
  SetAlldetails(data: any): void {

    sessionStorage.setItem(this.key, JSON.stringify(data));
  }

  GetAlldetails(): any {
    const data = sessionStorage.getItem(this.key);
    return data ? JSON.parse(data) : null;
  }

  ClearDetails(): void {
    sessionStorage.removeItem(this.key);
  }

   constructor() { }


}
