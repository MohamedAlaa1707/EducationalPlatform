import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserAuthService } from '../../../Services/User/user-auth.service';
import { Router } from '@angular/router';
import { window } from 'rxjs';
import { setInterval } from 'timers/promises';

@Component({
  selector: 'app-new-password',
  templateUrl: './newPassword.html',
  styleUrls: ['./newPassword.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class NewPasswordComponent implements OnInit {
  VerificationCode: string = '';
  newpassword: string = '';
  confirmnewpassword: string = '';
  message: string = '';
  passwordErrorMessage: string = '';
  confirmPasswordErrorMessage: string = '';
  email:string=''
   constructor( private userser:UserAuthService , private rou:Router){


   }
  ngOnInit(): void {
     this.email=  this.userser.getemail()

  }
  // Regular expression for a strong password
  // private strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  // private  = /./;
  private strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


  enterVerificationCode() {
    this.passwordErrorMessage = '';
    this.confirmPasswordErrorMessage = '';
    this.message = '';


  //   console.log(this.newpassword)
  // console.log(  this.strongPasswordRegex.test(this.newpassword) )
    if (!this.isStrongPassword(this.newpassword)) {

      this.passwordErrorMessage = 'Password must be at least 8 characters long, contain uppercase and lowercase letters, a number, and a special character.';
      return;
    }

    if (this.newpassword !== this.confirmnewpassword) {
      this.confirmPasswordErrorMessage = 'New password and confirmation password do not match.';
      return;
    }


//


 this.userser.ResetPassword(this.email,this.VerificationCode,this.newpassword).subscribe({



    next:(e:any)=>{
      this.userser.removeemail()

        this.message = 'Password Updated Successfully!';
        setTimeout(() => {
          this.rou.navigate(['/Login']);
        }, 3000);
      }
    // rou
  ,
  error:(e:any)=>{

    this.message= e.error.message;
    // console.log(e.)
  } })

  }


  // Method to check if the password is strong
  private isStrongPassword(password: string): boolean {
    return this.strongPasswordRegex.test(password);
  }
}

