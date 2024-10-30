import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LectureService {
  private apiUrl = 'https://localhost:7217/api/Teacher/GetLessonsByGradeLevel';

  constructor(private http: HttpClient) {}

  getLessonsByGradeLevel(gradeLevel: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${gradeLevel}`);
  }
}
