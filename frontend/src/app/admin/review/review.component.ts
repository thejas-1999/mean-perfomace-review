import { Component } from '@angular/core';
import { ReviewService } from '../../review.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../employee.service';
import { AdminService } from '../../admin.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-review',
  standalone: false,
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {
  reviews: any[] = []
  editMode: boolean = false;
  selectedReviewId: string | null = null;
  employees: any[] = []



  reviewForm = new FormGroup({
    reviewee: new FormControl('', [Validators.required]),
    assignedReviewers: new FormArray<FormControl<string | null>>([], [Validators.required]),
    dueDate: new FormControl('', [Validators.required])
  });

  constructor(private reviewService: ReviewService, private adminService: AdminService, private router: Router) {
    this.getAllReviews()
    this.getAllEmployees()
    this.editMode = false;
    this.selectedReviewId = null;

  }

  onReviewerChange(empId: string, event: any) {
    const reviewers = this.reviewForm.get('assignedReviewers') as FormArray;
    if (event.target.checked) {
      reviewers.push(new FormControl(empId));
    } else {
      const index = reviewers.controls.findIndex(ctrl => ctrl.value === empId);
      if (index !== -1) {
        reviewers.removeAt(index);
      }
    }
  }

  isReviewerChecked(empId: string): boolean {
    const reviewers = this.reviewForm.get('assignedReviewers') as FormArray;
    return reviewers.value.includes(empId);
  }


  getAllReviews() {
    this.reviewService.getAllReviews().subscribe((result: any) => {
      this.reviews = result.reviews
    })
  }

  getAllEmployees() {
    this.adminService.fetchEmployees().subscribe((result) => {
      this.employees = result.filter(emp => emp.role !== 'admin');

    });
  }





  formSubmit() {
    if (this.reviewForm.valid) {
      const review = {
        reviewee: this.reviewForm.value.reviewee,
        assignedReviewers: (this.reviewForm.get('assignedReviewers') as FormArray).value as string[],
        dueDate: this.reviewForm.value.dueDate
      };

      if (this.editMode && this.selectedReviewId) {
        this.reviewService.editReview(this.selectedReviewId, review).subscribe((result) => {
          window.alert(`Review Edited Successfully`)
          this.getAllReviews()
          this.reviewForm.reset()
        })
      } else {
        this.reviewService.addReview(review).subscribe((result) => {
          window.alert('review created successfully')
          this.getAllReviews()
          this.reviewForm.reset()
        });
      }
    }


  }

  editReview(review: any) {
    this.editMode = true;
    this.selectedReviewId = review._id;

    // 1) patch the simple fields
    this.reviewForm.patchValue({
      reviewee: review.reviewee._id,
      dueDate: review.dueDate.split('T')[0]
    });

    // 2) clear out any existing controls in the FormArray
    const fa = this.reviewForm.get('assignedReviewers') as FormArray;
    fa.clear();

    // 3) re-populate the FormArray with the existing reviewer IDs
    //    (if your backend gives you objects, pick ._id; if it gives you strings, just push r)
    review.assignedReviewers.forEach((r: any) => {
      const id = typeof r === 'string' ? r : r._id;
      fa.push(new FormControl(id));
    });
  }

  deleteReview(reviewId: string) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    this.reviewService.deleteReview(reviewId).subscribe((result) => {
      window.alert('Deleted Successfully')
      this.getAllReviews()
    })
  }


  logout() {
    const confirmDelete = window.confirm('Are you sure you want to Log out?');
    if (confirmDelete) {
      localStorage.removeItem("isLoggedIn");
      this.router.navigate(['login']);
    }

  }

  isPastDue(dueDate: string): boolean {
    return new Date(dueDate) < new Date();
  }

}
