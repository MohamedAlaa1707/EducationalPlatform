import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserAuthService } from '../../../Services/User/user-auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';
  isSendButtonDisabled: boolean = false;
  isLinkDisabled: boolean = true;

  constructor(private userserv: UserAuthService) {}

  sendVerificationCode(email: string) {
    this.isSendButtonDisabled = true;

    this.userserv.sendVerificationCode(email).subscribe({
      next: (e: any) => {
        this.message = 'Verification code sent successfully!';
        this.userserv.setemail(email);
        this.isLinkDisabled = false; // Enable the link when the code is sent

        // Enable the send button after 5 minutes (300000 ms)
        setTimeout(() => {
          this.isSendButtonDisabled = false;
        }, 300000);
      },
      error: (e: any) => {
        console.log(e);
        this.message = 'Error sending verification code. Please try again.';
        this.isSendButtonDisabled = false;
      }
    });
  }
}
