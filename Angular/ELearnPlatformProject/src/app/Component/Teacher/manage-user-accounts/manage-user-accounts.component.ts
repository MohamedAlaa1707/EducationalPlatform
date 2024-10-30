import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeacherService } from '../../../Services/Teacher/teacher.service';

@Component({
  selector: 'app-manage-user-accounts',
  standalone: true,
  imports: [CommonModule ,ReactiveFormsModule],
  templateUrl: './manage-user-accounts.component.html',
  styleUrl: './manage-user-accounts.component.css'
})
export class ManageUserAccountsComponent {

  adminAccountForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private manageAdminAccountService: TeacherService
  ) {
    this.adminAccountForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  // Custom validator to check if passwords match
  passwordMatchValidator(group: FormGroup): any {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatching: true };
  }
  AdminId:number=1;
  setAdminPassword(): void {
    if (this.adminAccountForm.valid) {
      const { email, newPassword } = this.adminAccountForm.value;

      let data={email, newPassword}
      this.manageAdminAccountService.Updateaccount( data).subscribe({
        next: (response) => {
          this.successMessage = 'Password has been successfully set for the admin.';
          this.errorMessage = '';
          this.adminAccountForm.reset();
        },
        error: (error) => {
          this.errorMessage = 'Failed to set the password. Please try again.';
          this.successMessage = '';
          console.error('Error:', error);
        }
      });
    }
  }

}
