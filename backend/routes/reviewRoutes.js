import express from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getAssignedReviews,
  getFeedbackStatus,
  submitFeedback,
  updateReview,
} from "../controls/reviewControl.js";

const router = express.Router();

router.post("/add", createReview);
router.put("/edit/:id", updateReview);
router.delete("/delete/:id", deleteReview);
router.get("/:id", getAssignedReviews);
router.post("/addFeedback/:reviewId", submitFeedback);
router.get("/feedbacks/status", getFeedbackStatus);
router.get("/", getAllReviews);

export default router;
