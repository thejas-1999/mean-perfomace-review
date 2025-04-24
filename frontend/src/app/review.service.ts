import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private getAllReviewsApi = 'http://localhost:8000/api/reviews'
  private addReviewApi = 'http://localhost:8000/api/reviews/add'
  private editReviewApi = 'http://localhost:8000/api/reviews/edit'
  private deleteReviewApi = 'http://localhost:8000/api/reviews/delete'


  constructor(private http: HttpClient) { }

  getAllReviews() {
    return this.http.get<any[]>(this.getAllReviewsApi)
  }



  addReview(review: any) {
    return this.http.post(this.addReviewApi, review)
  }

  editReview(id: string, updatedData: any) {
    return this.http.put(`${this.editReviewApi}/${id}`, updatedData)

  }

  deleteReview(id: string) {
    return this.http.delete(`${this.deleteReviewApi}/${id}`)
  }


}
