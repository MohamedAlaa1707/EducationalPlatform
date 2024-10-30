import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../../Services/User/user-auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent implements OnInit {

  public ErrorMessage: string | null = null;
  constructor( private ser:UserAuthService , private rou:Router){}
  ngOnInit(): void {


      if (localStorage.getItem("token")) {

         this.ser.ISExpired().subscribe({
        next: ( res) => {


                this.goTopag(res.role);

        },
        error: (e: any) => {
            if (e.status === 401) {
               this.ErrorMessage="Session expired. Please log in again."

                this.rou.navigate(['/Login']);
            } else {

            }
        }
    });

      }



}



   err=""
   log(email: string, password: string) {
    this.ser.login(email, password).subscribe({
      next: (d) => {
        const token = d.token;
        localStorage.setItem('token', token);


        this.goTopag(d.role);
      },
      error: (e: any) => {
        this.err = "The username or password is incorrect";
      }
    });
  }

  goTopag(role:string){

    if (role.toUpperCase()=='A') {
      this.rou.navigate(['/admin'])
      return
    }
    if (role.toUpperCase()=='S') {
      this.rou.navigate(['/student'])
      return
    }
    if (role.toUpperCase()=='T') {
      this.rou.navigate(['/teacher'])
      return
    }


  }

  // generateRandomString(length: number): string {
  //   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijkl#@!$%^&&(*)_+_mnopqrstuvwxyz0123456789';
  //   let result = '';
  //   const charactersLength = characters.length;
  //   for (let i = 0; i < length; i++) {
  //     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  //   }
  //   return result;
  // }
  navigateToRegistration(){

    this.rou.navigate(['/Registration']);


  }








  }


