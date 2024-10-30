import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../../Services/Teacher/teacher.service';
import { ReplyToQuestion } from '../../../Models/Teacher/reply-to-question';
import { FormsModule } from '@angular/forms';
import { SignalRService } from '../../../Services/Hubs/signalr.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  allQuestions: any;
  unansweredQuestionsCount: number = 0;

  constructor(
    private teatherSer: TeacherService,
    private signalRService: SignalRService
  ) {}

  ngOnInit(): void {
    this.loadUnansweredQuestions();


    this.teatherSer.currentCount.subscribe(count => {
      this.unansweredQuestionsCount = count;
    });


    this.signalRService.hubConnection.on('SendStudentMessage', (user: string, question: string, commentId: number) => {
      console.log(`Received question from ${user}: ${question} with Comment ID: ${commentId}`);
      this.loadUnansweredQuestions();
    });
  }

  loadUnansweredQuestions(): void {
    this.teatherSer.GetAllUnansweredQuestions().subscribe({
      next: (response: any) => {
        const questions = response || []; // تأكد من استخراج المصفوفة بشكل صحيح
        console.log(questions)
        if (Array.isArray(questions)) {
          this.allQuestions = questions.map((question: any) => ({ ...question, TeacherReply: '' }));
          this.unansweredQuestionsCount = questions.length;
          this.teatherSer.updateCount(this.unansweredQuestionsCount);
        } else {
          this.allQuestions.length=0
         
        }
      },
      error: (e: any) => {
        console.log(e);
      }
    });
  }


  sendReply(commentId: number, teacherReply: string , studid:number): void {


    console.log(teacherReply)

    let repl: ReplyToQuestion = {
      commentId: commentId,
      teacherReply: teacherReply ,
      userid:studid
    };

    this.teatherSer.SendReplyMessege(repl).subscribe({
      next: () => {

        // this.signalRService.sendTeacherReply('Mohamed sayed ', teacherReply ,commentId ,studid); //

        this.loadUnansweredQuestions();
        this.teatherSer.updateCount(this.unansweredQuestionsCount - 1);
      },
      error: (e: any) => {
        console.log(e);
      }
    });
  }
}
