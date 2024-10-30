import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TeacherService } from '../../../Services/Teacher/teacher.service';

@Component({
  selector: 'app-edit-lecture',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-lecture.component.html',
  styleUrls: ['./edit-lecture.component.css'],
})
export class EditLectureComponent implements OnChanges {
  @Input() lecture: any;
  @Output() onSave = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();

  editedLecture: any = {};
  selectedVideo: File | null = null;
  selectedHomeWorkPDF: File | null = null;
  selectedAttachedFile: File | null = null;
  showModal: boolean = true;
  errorMessage: string | null = null;
  showError: boolean = false;

  invalidFields = {
    title: false,
    description: false,
    uploadDate: false,
    feeAmount: false,
    gradeLevel: false,
    videoURL: false,
    pdfURL: false,
    homeworkURL: false,
  };

  hasChanges: boolean = false;

  constructor(private http: HttpClient, private tec: TeacherService) {}

  ngOnChanges() {
    this.editedLecture = { ...this.lecture };
    console.log(this.editedLecture);
  }

  markChanges() {
    this.hasChanges = true;
  }

  validateField(field: keyof typeof this.invalidFields): void {
    switch (field) {
      case 'title':
        this.invalidFields.title = !this.isValidTitle(this.editedLecture.title);
        break;
      case 'description':
        this.invalidFields.description = !this.isValidDescription(this.editedLecture.description);
        break;
      case 'uploadDate':
        this.invalidFields.uploadDate = !this.isValidDate(this.editedLecture.uploadDate);
        break;
      case 'feeAmount':
        this.invalidFields.feeAmount = !this.isValidPrice(this.editedLecture.feeAmount);
        break;
      case 'gradeLevel':
        this.invalidFields.gradeLevel = !this.isValidGradeLevel(this.editedLecture.gradeLevel);
        break;
      case 'videoURL':
        this.invalidFields.videoURL = this.selectedVideo ? !this.isValidFile(this.selectedVideo) : false;
        this.hasChanges = true;
        break;
      case 'pdfURL':
        this.invalidFields.pdfURL = this.selectedAttachedFile ? !this.isValidFile(this.selectedAttachedFile) : false;
        this.hasChanges = true;
        break;
      case 'homeworkURL':
        this.invalidFields.homeworkURL = this.selectedHomeWorkPDF ? !this.isValidFile(this.selectedHomeWorkPDF) : false;
        this.hasChanges = true;
        break;
      default:
        break;
    }
  }

  // Validation Functions
  isValidTitle(title: string): boolean {
    return title.trim() !== '' && title.length <= 50 && !/^\d/.test(title);
  }

  isValidDescription(description: string): boolean {
    return description.trim() !== '';
  }

  isValidDate(date: string): boolean {
    return date.trim() !== '';
  }

  isValidPrice(price: number): boolean {
    return price > 0;
  }

  isValidGradeLevel(gradeLevel: string): boolean {
    return gradeLevel.trim() !== '';
  }

  isValidFile(file: File): boolean {
    return file !== undefined && file !== null;
  }

  validateFileType(file: File, type: 'video' | 'pdf'): boolean {
    const validTypes = {
      video: ['video/mp4', 'video/x-m4v', 'video/*'],
      pdf: ['application/pdf'],
    };
    return validTypes[type].some(validType => file.type.startsWith(validType));
  }

  // File Removal Functions
  removeVideo(): void {
    this.editedLecture.videoURL = null;
    this.selectedVideo = null;
    this.hasChanges = true;
  }

  removeHomeworkPDF(): void {
    this.editedLecture.homeworkURL = null;
    this.selectedHomeWorkPDF = null;
    this.hasChanges = true;
  }

  removeAttachedFile(): void {
    this.editedLecture.pdfurl = null;
    this.selectedAttachedFile = null;
    this.hasChanges = true;
  }

  // File Selection Handlers
  onVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file: File|null = input.files?.[0] || null;
    this.selectedVideo = file && this.isValidFile(file) ? file : null;
    this.validateField('videoURL');
  }

  onHomeworkPDFSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file: File|null = input.files?.[0] || null;
    this.selectedHomeWorkPDF = file && this.isValidFile(file) ? file : null;
    this.validateField('homeworkURL');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file: File|null = input.files?.[0] || null;
    this.selectedAttachedFile = file && this.isValidFile(file) ? file : null;
    this.validateField('pdfURL');
  }

  save(): void {
    this.showError = false;

    // Validate file types
    if (this.selectedVideo && !this.validateFileType(this.selectedVideo, 'video')) {
      this.invalidFields.videoURL = true;
      this.showError = true;
      this.errorMessage = 'Invalid video file type. Please upload a valid video.';
      return;
    }

    if (this.selectedHomeWorkPDF && !this.validateFileType(this.selectedHomeWorkPDF, 'pdf')) {
      this.invalidFields.homeworkURL = true;
      this.showError = true;
      this.errorMessage = 'Invalid homework PDF file type. Please upload a valid PDF.';
      return;
    }

    if (this.selectedAttachedFile && !this.validateFileType(this.selectedAttachedFile, 'pdf')) {
      this.invalidFields.pdfURL = true;
      this.showError = true;
      this.errorMessage = 'Invalid attachment file type. Please upload a valid PDF.';
      return;
    }

    if (!this.selectedVideo && !this.editedLecture.videoURL) {
      this.invalidFields.videoURL = true;
      this.showError = true;
      this.errorMessage = 'Please upload a lecture video.';
      return;
    }
    if (!this.selectedHomeWorkPDF && !this.editedLecture.homeworkURL) {
      this.invalidFields.homeworkURL = true;
      this.showError = true;
      this.errorMessage = 'Please upload a homework PDF.';
      return;
    }
    if (!this.selectedAttachedFile && !this.editedLecture.pdfurl) {
      this.invalidFields.pdfURL = true;
      this.showError = true;
      this.errorMessage = 'Please upload an attachment file.';
      return;
    }
    if (!this.hasChanges) {
      this.showError = true;
      this.errorMessage = 'No changes detected.';
      return;
    }
     // Create FormData to send the updated data
     const formData = new FormData();

     // Append the edited lecture details to FormData
     formData.append('lessonId', this.editedLecture.lessonId.toString());
     formData.append('gradeLevel', this.editedLecture.gradeLevel);
     formData.append('title', this.editedLecture.title);
     formData.append('description', this.editedLecture.description);
     formData.append('uploadDate', this.editedLecture.uploadDate.toString());
     formData.append('feeAmount', this.editedLecture.feeAmount.toString());

     // Append the files if they were selected
     if (this.selectedVideo) {
         formData.append('VideoURL', this.selectedVideo);
     }


     if (this.selectedHomeWorkPDF) {
         formData.append('HomeWork', this.selectedHomeWorkPDF);
     }


     if (this.selectedAttachedFile) {
         formData.append('PDFURL', this.selectedAttachedFile);
     }

    // Log the updated lecture object for verification
    console.log('Updated Lecture:', this.editedLecture);

    this.tec.UpdateLesson( this.editedLecture.lessonId,formData).subscribe({
      next: (data: any) => {

      },
      error: (err) => {
        console.error(err);
      }
    });
    // Emit the edited lecture data
    this.onSave.emit(this.editedLecture);
  }

  closeModal(): void {
    this.onClose.emit();

    console.log('Updated Lecture:', this.editedLecture);
  }
}
