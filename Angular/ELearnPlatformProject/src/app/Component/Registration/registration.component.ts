import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student } from '../../Models/Student/student';
import { UserAuthService } from '../../Services/User/user-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  student: Student = {
    name: '',
    email: '',
    password: '',
    phone: '',
    gradeLevel: '',
    governorate: '',
    parentPhone: ''
  };
  confirmPassword: string = '';

  invalidFields = {
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    phone: false,
    gradeLevel: false,
    governorate: false,
    parentPhone: false
  };


  governorates: string[] = [
    "Cairo", "Giza", "Alexandria", "Qalyubia", "Port Said", "Suez",
    "Luxor", "Aswan", "Asyut", "Beheira", "Beni Suef", "Dakahlia",
    "Damietta", "Faiyum", "Gharbia", "Ismailia", "Kafr El Sheikh",
    "Matruh", "Minya", "Monufia", "New Valley", "North Sinai",
    "Qena", "Red Sea", "Sharqia", "Sohag", "South Sinai"
  ];

  constructor(private studentService: UserAuthService , private rou:Router) {}


  validateField(field: string): void {
    switch (field) {
      case 'name':
        this.invalidFields.name = !this.validName(this.student.name);
        break;
      case 'email':
        this.invalidFields.email = !this.validEmail(this.student.email);
        break;
      case 'password':
        this.invalidFields.password = !this.validPassword(this.student.password);
        break;
      case 'phone':
        this.invalidFields.phone = !this.validPhone(this.student.phone);
        break;
      case 'gradeLevel':
        this.invalidFields.gradeLevel = !this.validGradeLevel(this.student.gradeLevel);
        break;
      case 'governorate':
        this.invalidFields.governorate = !this.validGovernorate(this.student.governorate);
        break;
      case 'parentPhone':
        this.invalidFields.parentPhone = !this.validPhone(this.student.parentPhone);
        break;
      default:
        break;
    }
  }


  validName(name: string): boolean {
    return name.trim() !== '' && name.length <= 50 && /^[a-zA-Z\u0600-\u06FF\s]*$/.test(name);
  }

  validEmail(email: string): boolean {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  }

  validPhone(phone: string): boolean {
    const code: string[] = ['010', '011', '012', '015'];
    return code.includes(phone.substring(0, 3)) && phone.length === 11 && /^[0-9]+$/.test(phone);
  }

  validateConfirmPassword(): void {
    this.invalidFields.confirmPassword = this.student.password !== this.confirmPassword;
  }

  validPassword(password: string): boolean {
    return password.length >= 12;
  }

  validGradeLevel(gradeLevel: string): boolean {
    return ['F', 'T', 'S'].includes(gradeLevel);
  }

  validGovernorate(governorate: string): boolean {
    return this.governorates.includes(governorate);
  }

  registerStudent(): void {

    for (const field in this.invalidFields) {
      this.validateField(field);
    }


    this.validateConfirmPassword();

    if (Object.values(this.invalidFields).every(isInvalid => !isInvalid)) {
      this.studentService.registerStudent(this.student).subscribe(
        (response) => {
          this.rou.navigate(['/Login']);

        },
        (error) => {
          console.error('Error registering student:', error);
        }
      );
    } else {
      console.error('Validation failed:', this.invalidFields);
    }

  
  }
}
