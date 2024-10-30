import { Component, OnInit } from '@angular/core';
import { RelationsService } from '../../../../Services/Student/relations.service';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { StudentService } from '../../../../Services/Student/student.service';

@Component({
  selector: 'app-receipt-student',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receipt-student.component.html',
  styleUrls: ['./receipt-student.component.css']
})
export class ReceiptStudentComponent implements OnInit {
  studinf: any;
  lesson: any;
  id: number = 0;
  level: string = '';
  ImageFile!: File;
  imageUrl: string | ArrayBuffer | null = null;
  errorMessage: string | null = null;
  showError: boolean = false;
  lessonid: number = 0;

  constructor(private StuInfo: RelationsService, private router: Router, private studentser: StudentService , private loc:Location)  { }

  ngOnInit(): void {
    this.studinf = this.StuInfo.GetStudentInfo();
    this.lesson = this.StuInfo.getcurrentLesson();
    if (this.studinf) {
      this.id = this.studinf.id;
      this.level = this.studinf.gradeLevel;
    }
    if (this.lesson) {
      this.lessonid = this.lesson.lessonId;
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Invalid file type. Only JPEG, PNG, and GIF are allowed.';
        this.imageUrl = null;
        this.showError = true;
        return;
      }

      this.errorMessage = null;
      this.ImageFile = file;
      this.showError = false;

      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submit() {
    if (!this.ImageFile) {
      this.errorMessage = 'Please select a valid image before submitting.';
      this.showError = true;
      return;
    }

    if (!this.lesson) {
      this.errorMessage = 'Lesson information is missing.';
      this.showError = true;
      return;
    }

    const formData = new FormData();
    formData.append('image', this.ImageFile);
    formData.append('id', this.id.toString());
    formData.append('level', this.level);
    formData.append('lessonid', this.lesson.lessonId.toString());

    this.studentser.UploadReceipt(formData).subscribe({
      next: (d) => {
        this.loc.back();
      },
      error: (e: any) => {
        console.log(e);
        this.errorMessage = 'Failed to upload receipt. Please try again later.';
        this.showError = true;
      }
    });
  }

  GoToHome() {
    // this.router.navigate(['/student']);
    this.loc.back()
  }
}
