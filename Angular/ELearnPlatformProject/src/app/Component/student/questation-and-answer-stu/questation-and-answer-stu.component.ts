import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StudentService } from '../../../Services/Student/student.service';
import { RelationsService } from '../../../Services/Student/relations.service';

@Component({
  selector: 'app-questation-and-answer-stu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './questation-and-answer-stu.component.html',
  styleUrl: './questation-and-answer-stu.component.css'
})
export class QuestationAndAnswerStuComponent {


  QAL:any
  studinf :any
  level:string=''
  constructor(private QA:StudentService , private Test:RelationsService){}
  ngOnInit(): void {


    this.studinf = this.Test.GetStudentInfo();

    if (this.studinf) {

      this.level = this.studinf.gradeLevel;
    }

   console.log(this.level)

  this.QA.getQAbyGreadleval(this.level).subscribe({
    next: (data: any) => {
      console.log(data);

      this.QAL = data;
  },
  error: (err) => {
    console.error("Error fetching data", err);
}




    })

  }


}
