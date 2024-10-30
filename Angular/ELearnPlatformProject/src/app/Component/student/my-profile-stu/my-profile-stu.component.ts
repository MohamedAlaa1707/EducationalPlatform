import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentService } from '../../../Services/Student/student.service';

@Component({
  selector: 'app-my-profile-stu',
  standalone: true,
  imports: [ CommonModule ,ReactiveFormsModule],
  templateUrl: './my-profile-stu.component.html',
  styleUrl: './my-profile-stu.component.css'
})
export class MyProfileSTUComponent {
  myAccountForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private myAccountService: StudentService) {
    this.myAccountForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]] ,
      Email:['',[Validators.required,Validators.email]]
    });
  }
  StudentId : number=1;
  onSubmit(): void {
    if (this.myAccountForm.valid && this.passwordsMatch()) {
      const { Email ,oldPassword, newPassword } = this.myAccountForm.value;

      let data= { Email ,oldPassword, newPassword }
      this.myAccountService.changeMyPassword(data).subscribe({
        next: (response) => {
          this.successMessage = 'Password reset successfully!';
          this.errorMessage = '';
          this.myAccountForm.reset();
        },
        error: (error) => {
          console.error('Error resetting password:', error);
          this.successMessage = '';
          this.errorMessage = 'Failed to reset password. Please try again.';
        }
      });
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
    }
  }

  passwordsMatch(): boolean {
    const newPassword = this.myAccountForm.get('newPassword')?.value;
    const confirmPassword = this.myAccountForm.get('confirmPassword')?.value;
    return newPassword === confirmPassword;
  }

}
