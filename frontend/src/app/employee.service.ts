import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private loginApi = 'http://localhost:8000/api/employees/login';
  private getAssignedReviewsPI = 'http://localhost:8000/api/reviews'
  private postFeedbackApi = 'http://localhost:8000/api/reviews/addFeedback'

  constructor(private http: HttpClient) { }

  loginEmployee(employee: any) {
    return this.http.post(this.loginApi, employee, { withCredentials: true })
  }

  getAssignedReviews(id: string) {
    return this.http.get<any[]>(`${this.getAssignedReviewsPI}/${id}`)
  }

  submitFeedback(reviewId: string, feedback: any) {
    return this.http.post(`${this.postFeedbackApi}/${reviewId}`, feedback)
  }


}
