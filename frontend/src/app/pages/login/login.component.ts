import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  errorMsg: string = '';
  email: string = '';
  password: string = '';


  regName: string = '';
  regEmail: string = '';
  regPhone: string = '';
  regPassword: string = '';
  regDepartment: string = '';
  regDesignation: string = '';

  showRegister: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }


  login() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Please enter both email and password';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        console.log('Login success:', res);
        localStorage.setItem('token', res.token);
        localStorage.setItem('userEmail', res.user?.email || this.email);

        const userRole = res.user?.role || res.role;
        const navigationPath = userRole === 'admin' ? '/admin/home' : 'home';
        this.router.navigate([navigationPath]);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = err.error.message || 'Login failed';
      }
    });
  }


  toggleRegister() {
    this.showRegister = !this.showRegister;
    this.errorMsg = '';
  }


  register() {
    if (!this.regName || !this.regEmail || !this.regPassword || !this.regDesignation) {
      this.errorMsg = 'Please fill all fields';
      return;
    }

    const payload = {
      name: this.regName,
      email: this.regEmail,
      password: this.regPassword,
      designation: this.regDesignation,
      phone: this.regPhone,
      department: this.regDepartment
    };

    this.authService.register(payload).subscribe({
      next: (res: any) => {
        console.log('Registration & auto-login success:', res);
        this.errorMsg = '';

        const userRole = res.user?.role;
        const navigationPath = userRole === 'admin' ? '/admin/home' : 'home';
        this.router.navigate([navigationPath]);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = err.error.message || 'Registration failed';
      }
    });
  }
}
