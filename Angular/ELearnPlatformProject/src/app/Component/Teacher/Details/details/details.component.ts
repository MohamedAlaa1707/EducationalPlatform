import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../../../Services/Teacher/teacher.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent  implements OnInit {
 id:number=0
 accepts:String[] =[]
 rejects:String[] =[]

  constructor(private teacher:TeacherService){


  }
  ngOnInit(): void {
    this.id= this.teacher.getid();


    this.teacher.AllStudentAccpetAndRejectOnLesson( this.id).subscribe({
      next: (data: any) => {

          this.accepts= data.nameAccept
          this.rejects=data.nameRejects

      },
      error: (e: any) => {
        console.error(e); // Consider logging the error for debugging
      },
    });

  }

}
