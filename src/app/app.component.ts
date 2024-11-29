import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';
import { EmployeeComponent } from './employee/employee.component';
import { NavbarComponent } from "./navbar/navbar.component";
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { NavbarClientComponent } from './navbar-client/navbar-client.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, NavbarComponent, SocialLoginModule, NavbarClientComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'EMPLOYEE MANAGEMENT';


}
