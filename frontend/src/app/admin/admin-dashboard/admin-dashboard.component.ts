import { Component } from '@angular/core';
import { AdminService } from '../../admin.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  employees: any[] = []


  editMode: boolean = false
  selectedEmployeeId: string | null = null;

  constructor(private adminService: AdminService, private router: Router) {
    this.getEmployeeDetails()
  }

  employeeForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),


  });



  getEmployeeDetails() {
    this.adminService.fetchEmployees().subscribe((result) => {
      this.employees = result

    })

  }

  formSubmit() {
    if (this.employeeForm.valid) {
      const employee = this.employeeForm.value;

      if (this.editMode && this.selectedEmployeeId) {
        this.adminService.editEmployee(this.selectedEmployeeId, employee).subscribe((result) => {
          window.alert('Employee updated Successfully')

          this.getEmployeeDetails();


          this.employeeForm.reset();
          this.editMode = false;
          this.selectedEmployeeId = null;
        });
      } else {
        this.adminService.addEmployees(employee).subscribe((result) => {
          window.alert('Employee Created Succesfully')
          this.getEmployeeDetails();
          this.employeeForm.reset();
        });
      }
    }
  }


  editEmployee(employee: any) {
    if (employee.role === 'admin') {
      alert('Admin user cannot be edited.');
      return;
    }

    this.editMode = true;
    this.selectedEmployeeId = employee._id;
    this.employeeForm.patchValue({
      name: employee.name,
      email: employee.email,
    });
  }


  deleteEmployee(employeeId: any) {
    const confirmDelete = window.confirm('Are you sure you want to delete this employee?');
    if (confirmDelete) {
      this.adminService.deleteEmployee(employeeId).subscribe((result) => {
        window.alert('Employee Deleted Successfully')
        this.getEmployeeDetails();
      });
    }
  }

  logout() {
    const confirmDelete = window.confirm('Are you sure you want to Log out?');
    if (confirmDelete) {
      localStorage.removeItem("isLoggedIn");
      this.router.navigate(['login']);
    }

  }


}
