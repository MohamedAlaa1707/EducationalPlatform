import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserAuthService } from '../../../../Services/User/user-auth.service';

@Component({
  selector: 'app-nav-par',
  standalone: true,
  imports: [ RouterLink],
  templateUrl: './nav-par.component.html',
  styleUrl: './nav-par.component.css'
})
export class NavParComponent implements OnInit {
  Name:string="Mohamed"
  constructor(private service:UserAuthService , private rou:Router){


  }



  logout(){

    localStorage.removeItem("token")
     this.rou.navigate(['\Login'])

   }

  ngOnInit(): void {
    if (localStorage.getItem("token")) {

      this.service.getRoleAndName().subscribe({

        next: (d) => {
           this.Name= d.username
        }
        ,
        error: (e: any) => {

        }
        
      });
  }
   }



}
