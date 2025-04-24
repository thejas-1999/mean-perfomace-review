import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema(
  {
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    assignedReviewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],
    dueDate: Date,
    feedback: [
      {
        reviewer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Employee",
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "completed"],
          default: "pending",
        },
        submittedAt: Date,
        comments: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
