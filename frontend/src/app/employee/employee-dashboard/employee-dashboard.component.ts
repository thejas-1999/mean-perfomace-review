import { Component } from '@angular/core';
import { EmployeeService } from '../../employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-dashboard',
  standalone: false,
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css'
})
export class EmployeeDashboardComponent {
  user = JSON.parse(localStorage.getItem('user') || '{}');
  employeeId = this.user._id;
  activeSection: 'assigned' | 'submitted' = 'assigned';

  feedbacks: any[] = [];
  submittedFeedbacks: any[] = [];

  activeReviewId: string | null = null;
  comments: string = '';

  constructor(private employeeService: EmployeeService, private router: Router) {
    this.loadReviews();
  }

  loadReviews() {
    this.employeeService.getAssignedReviews(this.employeeId).subscribe((reviews: any[]) => {
      this.feedbacks = [];
      this.submittedFeedbacks = [];

      reviews.forEach(review => {
        const feedback = review.feedback.find((f: any) => f.reviewer === this.employeeId || f.reviewer?._id === this.employeeId);

        if (feedback) {
          if (feedback.status === 'completed') {
            this.submittedFeedbacks.push({ ...review, myFeedback: feedback });
          } else {
            this.feedbacks.push(review);
          }
        }
      });
    });
  }

  addReview(reviewId: string) {
    this.activeReviewId = reviewId;
    this.comments = '';
  }




  submitReview(reviewId: string) {
    const feedbackData = {
      reviewerId: this.employeeId,
      comments: this.comments
    };

    this.employeeService.submitFeedback(reviewId, feedbackData).subscribe(() => {
      this.activeReviewId = null;
      this.comments = '';
      this.loadReviews(); // Reload list to update UI
    });
  }

  setSection(section: 'assigned' | 'submitted') {
    this.activeSection = section;
  }

  logout() {
    const confirmDelete = window.confirm('Are you sure you want to Log out?');
    if (confirmDelete) {
      localStorage.removeItem("isLoggedIn");
      this.router.navigate(['login']);
    }

  }

}
