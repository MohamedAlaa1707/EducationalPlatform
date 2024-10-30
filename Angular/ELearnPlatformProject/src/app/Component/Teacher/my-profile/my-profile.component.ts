import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { TeacherService } from '../../../Services/Teacher/teacher.service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [ReactiveFormsModule ,CommonModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent {

  manageAccountForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private manageAccountsService: TeacherService) {
    this.manageAccountForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.manageAccountForm.valid) {
      const formData = this.manageAccountForm.value;
      this.manageAccountsService.Updateaccount(formData).subscribe({
        next: (response:any) => {
          this.successMessage = 'Password updated successfully!';
          this.errorMessage = '';
          this.manageAccountForm.reset();
        },
        error: (error) => {
          console.error('Error updating password:', error);
          this.successMessage = '';
          this.errorMessage = 'Failed to update password. Please try again.';
        }
      });
    } else {
      this.errorMessage = 'Please provide valid input.';
    }
  }
}
