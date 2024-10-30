import { Component } from '@angular/core';
import { NavParComponent } from './NavBar/nav-par/nav-par.component';
import { StuInfoComponent } from './stu-info/stu-info.component';
import { Router, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [NavParComponent ,StuInfoComponent ,RouterOutlet ],
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.css'
})
export class TeacherComponent {

}
