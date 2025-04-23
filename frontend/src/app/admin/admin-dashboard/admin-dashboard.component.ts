import { Component } from '@angular/core';
import { AdminService } from '../../admin.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor(private adminService: AdminService) {
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
      console.log(this.employees)
    })

  }

  formSubmit() {
    if (this.employeeForm.valid) {
      const employee = this.employeeForm.value;

      if (this.editMode && this.selectedEmployeeId) {
        this.adminService.editEmployee(this.selectedEmployeeId, employee).subscribe((result) => {
          console.log('employee updated successfully');

          this.getEmployeeDetails();


          this.employeeForm.reset();
          this.editMode = false;
          this.selectedEmployeeId = null;
        });
      } else {
        this.adminService.addEmployees(employee).subscribe((result) => {
          console.log('Doctor inserted successfully');
          this.getEmployeeDetails();
          this.employeeForm.reset();
        });
      }
    }
  }


  editEmployee(employee: any) {
    this.editMode = true;
    this.selectedEmployeeId = employee._id;
    this.employeeForm.patchValue({
      name: employee.name,
      email: employee.email,

    });
  }

  deleteEmployee(employeeId: any) {
    this.adminService.deleteEmployee(employeeId).subscribe((result) => {
      console.log(`Deleted Successfully`)
      this.getEmployeeDetails()
    })

  }
}
