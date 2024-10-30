  import { CommonModule, Location } from '@angular/common';
  import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
  import { RelationsService } from '../../../../Services/Student/relations.service';
  import { Lesson } from '../../../../Models/Student/lesson';
  import { Router } from '@angular/router';
  import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
  import { StudentService } from '../../../../Services/Student/student.service';
  import { UploadStudentHomework } from '../../../../Models/Student/upload-student-homework';
  import { ALL } from 'node:dns';
  import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

  import { HttpClient } from '@angular/common/http';
import { SignalRService } from '../../../../Services/Hubs/signalr.service';
import { log } from 'node:console';
  @Component({
    selector: 'app-watch-vedio',
    standalone: true,
    imports: [CommonModule ,ReactiveFormsModule ],
    templateUrl: './watch-vedio.component.html',
    styleUrl: './watch-vedio.component.css'
  })


  export class WatchVedioComponent implements OnInit , AfterViewChecked  {
    @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
    curentlesson:any
    lesson:Lesson={
      accessPeriod:"",
      description:"",
      feeAmount:"",
      gradeLevel:"" ,
      hasVideoAccess :"",
      homeworkURL  :"",
      lessonId: 0 ,
      pdfurl: "",
      title :"" ,
      uploadDate:"",
      videoURL:"" ,
      homeworkElevation:""

    }
    private connection!: HubConnection;
    homeworkFile!:File|null
    uploadForm: FormGroup;
    constructor(private Location:Location , private re:RelationsService , private router:Router ,private fb: FormBuilder ,private studentserv:StudentService,
      private signalRService: SignalRService
    ){
      this.uploadForm = this.fb.group({
        receipt: [null]
      });

    }
    studeninfo:any
    lessonid:number=0
    userid:number=0
    allessage:any
    ngAfterViewChecked(): void {
      this.videoPlayer.nativeElement.oncontextmenu = (event: MouseEvent) => {
        event.preventDefault();
      };




    }
    ngOnInit(): void {




      this.initializeSignalR();


      // -----------------------------
  this.curentlesson= this.re.getcurrentLesson()
  this.studeninfo = this.re.GetStudentInfo()



  if (this.curentlesson && this.studeninfo) {
    this.lessonid = this.curentlesson.lessonId;
    this.userid = this.studeninfo.id;

    let data = {
      "studentid": this.userid,
      "lessonid": this.lessonid
    };

    // استدعاء الدالة لجلب الرسائل
    this.studentserv.getallmessege(data).subscribe({
      next: (res) => {
        this.allessage=  res
        console.log(this.allessage)
      },
      error: (e: any) => {
        console.log(e);
      }
    });

  }


    }





    initializeSignalR() {
      this.signalRService.hubConnection.on('SendTeacherMessage', (user: string, responseMessage: string, commentId: number, studentid: number) => {

        let data = {
          "studentid": this.userid,
          "lessonid": this.lessonid
        };

        // استدعاء الدالة لجلب الرسائل
        this.studentserv.getallmessege(data).subscribe({
          next: (res) => {
            this.allessage=  res
            console.log(this.allessage)
          },
          error: (e: any) => {
            console.log(e);
          }
        });



        if (studentid === this.userid) {
          for (const element of this.allessage) {

            if (element.commentId === commentId) {


              element.reply = responseMessage;

            }


          }
        }
      });
    }

  onSubmitQuestion(): void {
    const question = (document.getElementById('studentQuestion') as HTMLTextAreaElement).value;
    const data = {
      studentid: this.userid,
        lessonid: this.lessonid,
        question: question
    };

    this.allessage.push({ question: question, reply: '' });
    this.studentserv.sendmessage(data).subscribe({
        next: (res:any) => {

            (document.getElementById('studentQuestion') as HTMLTextAreaElement).value = '';
        },
        error: (e) => console.error(e)
    });
}
















    isPaused = true;

    togglePlay() {
      const video: HTMLVideoElement = this.videoPlayer.nativeElement;
      if (video.paused) {
        console.log(video)
        video.play();
        this.isPaused = false;
      } else {
        video.pause();
        this.isPaused = true;
      }
    }

    toggleFullScreen() {
      const video: HTMLVideoElement = this.videoPlayer.nativeElement;

      if (!document.fullscreenElement) {
        video.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }

    onContextMenu(event: MouseEvent) {
      event.preventDefault();
  }

  errorMessage: string | null = null;
  isFileValid: boolean = false;

  onFileChange(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
      this.errorMessage = 'Please select a PDF file.';
      this.isFileValid = false;
      return;
    }

    if (file.type !== 'application/pdf') {
      this.errorMessage = 'Please select a PDF file only.';
      this.isFileValid = false;
      this.isSuccess = false;
      return;
    }
    this.homeworkFile=file
    this.errorMessage = null;
    this.isFileValid = true;
  }
  alertMessage: string | null = null;
    isSuccess: boolean = false;

  onSubmit(lessonId:number): void {

    const formData = new FormData();


    formData.append('lessonid', lessonId.toString());
    formData.append('id', this.studeninfo.id);
    formData.append('level', this.studeninfo.gradeLevel);


    if (this.homeworkFile) {
      formData.append('homeworkpdf', this.homeworkFile, this.homeworkFile.name);
    }


    this.studentserv.uploadStudentHomework(formData).subscribe({
      next: ( res) => {


        this.alertMessage = 'Homework uploaded successfully.';
        this.isSuccess = true;
        this.clearInput();
        this.isFileValid = false;

      },
      error: (e: any) => {
        console.log(e)
      }
  });;




  }

  clearInput() {
    this.homeworkFile = null;

   let x=  (document.getElementById('receiptInput') as HTMLInputElement)
   console.log(x)
    	      x.value = '';

            x.disabled =true
  }
    Back()
    {
      this.Location.back();
    }
  }
