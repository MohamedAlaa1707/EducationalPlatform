import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../Services/User/user-auth.service';
import { NavParComponent } from './NavBar/nav-par/nav-par.component';
import { StuInfoComponent } from './stu-info/stu-info.component';
import { Router, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-student',
  standalone: true,
  imports: [NavParComponent ,StuInfoComponent ,RouterOutlet  ],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent implements OnInit {

  Name=""

  

 constructor( private service:UserAuthService , ){}





  ngOnInit(): void {
    if (localStorage.getItem("token")) {
    this.service.getRoleAndName().subscribe({
     next: (d) => {
        this.Name= d.username
     },
     error: (e: any) => {

     }
   });
   }





  }
}
