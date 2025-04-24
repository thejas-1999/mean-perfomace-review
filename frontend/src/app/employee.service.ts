import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private loginApi = `/api/employees/login`
  private getEmployeesApi = 'http://localhost:8000/api/employees'

  constructor(private http: HttpClient) { }

  loginEmployee(employee: any) {
    return this.http.post(this.loginApi, employee, { withCredentials: true })
  }


}
