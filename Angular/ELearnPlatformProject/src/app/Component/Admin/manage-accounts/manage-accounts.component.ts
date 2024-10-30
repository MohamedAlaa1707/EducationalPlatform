import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../Services/Admin/admin.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-manage-accounts',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule ],
  templateUrl: './manage-accounts.component.html',
  styleUrls: ['./manage-accounts.component.css']
})
export class ManageAccountsComponent {
  manageAccountForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private manageAccountsService: AdminService) {
    this.manageAccountForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.manageAccountForm.valid) {
      const formData = this.manageAccountForm.value;
      this.manageAccountsService.ChangeStudentPassword(formData).subscribe({
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
