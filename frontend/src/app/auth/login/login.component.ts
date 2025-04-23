import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  employee: any[] = []

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  constructor(private employeeService: EmployeeService, private router: Router) { }


  onSubmit(employee: any) {
    if (this.loginForm.valid) {
      this.employeeService.loginEmployee(employee).subscribe({
        next: (res: any) => {
          console.log(res.employee.role);
          localStorage.setItem('isLoggedIn', 'true');
          console.log(res.employee.role)

          if (res.employee.role == 'admin') {
            this.router.navigate(['employee/admin']);
          }
          else {
            this.router.navigate(['employee/employeeDashboard']);
          }




        },
        error: (err) => {
          console.error("Login failed", err);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
