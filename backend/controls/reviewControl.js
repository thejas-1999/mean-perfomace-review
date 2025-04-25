// controllers/feedbackController.js
import Employee from "../models/employeeModel.js";
import Review from "../models/reviewModel.js";

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("reviewee", "name email role")
      .populate("assignedReviewers", "name email role")
      .populate("feedback.reviewer", "name email role")
      .exec();

    res.status(200).json({
      message: "All reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const createReview = async (req, res) => {
  try {
    const { reviewee, assignedReviewers, dueDate } = req.body;

    // Check if reviewee exists
    const revieweeExists = await Employee.findById(reviewee);
    if (!revieweeExists) {
      return res.status(404).json({ message: "Reviewee not found" });
    }

    // Check if assignedReviewers are valid
    const reviewersExist = await Employee.find({
      _id: { $in: assignedReviewers },
    });

    if (reviewersExist.length !== assignedReviewers.length) {
      return res
        .status(400)
        .json({ message: "One or more reviewers not found" });
    }

    // Prevent reviewee being assigned as reviewer
    if (assignedReviewers.includes(reviewee)) {
      return res.status(400).json({ message: "Reviewee cannot be a reviewer" });
    }

    // Create empty feedbacks for each reviewer
    const feedback = assignedReviewers.map((reviewerId) => ({
      reviewer: [reviewerId],
      status: "pending",
      comments: "",
    }));

    const newReview = new Review({
      reviewee,
      assignedReviewers,
      dueDate,
      feedback,
    });

    await newReview.save();
    res
      .status(201)
      .json({ message: "Review created successfully", review: newReview });
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ message: "Server error", err });
  }
};

// PUT /api/reviews/:id
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewee, assignedReviewers, dueDate } = req.body;

    // Validate review
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Prevent reviewee being in assignedReviewers
    if (assignedReviewers.includes(reviewee)) {
      return res
        .status(400)
        .json({ message: "Reviewee cannot be one of the reviewers" });
    }

    // Re-generate feedback for updated reviewers
    const feedback = assignedReviewers.map((reviewerId) => ({
      reviewer: reviewerId,
      status: "pending",
      comments: "",
    }));

    // Update fields
    review.reviewee = reviewee;
    review.assignedReviewers = assignedReviewers;
    review.dueDate = dueDate;
    review.feedback = feedback;

    await review.save();
    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Employee Controller: Get Assigned Reviews
const getAssignedReviews = async (req, res) => {
  try {
    const employeeId = req.params.id;

    // Find reviews where the employee is listed as an assigned reviewer
    const reviews = await Review.find({
      assignedReviewers: employeeId,
    })
      .populate("reviewee", "name email") // Populate reviewee info for better display
      .populate("assignedReviewers", "name role"); // Populate assigned reviewers info

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assigned reviews", error });
  }
};

const submitFeedback = async (req, res) => {
  const { reviewId } = req.params;
  const { reviewerId, comments } = req.body;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const feedbackIndex = review.feedback.findIndex(
      (feedback) => feedback.reviewer.toString() === reviewerId
    );

    if (feedbackIndex === -1) {
      return res.status(400).json({ message: "Feedback not assigned to you" });
    }

    review.feedback[feedbackIndex].comments = comments;
    review.feedback[feedbackIndex].status = "completed";
    review.feedback[feedbackIndex].submittedAt = new Date(); // optional timestamp

    await review.save();

    res.status(200).json({
      message: "Feedback submitted successfully",
      feedback: review.feedback[feedbackIndex],
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Error submitting feedback", error });
  }
};

// Employee Controller: Get Feedback Status
const getFeedbackStatus = async (req, res) => {
  try {
    const employeeId = req.user.id; // Assuming user info is stored in `req.user`

    // Find all reviews assigned to the employee
    const reviews = await Review.find({
      assignedReviewers: employeeId,
    });

    // Format the response to show the status of each feedback
    const feedbackStatuses = reviews.map((review) => {
      const feedback = review.feedback.find(
        (feedback) => feedback.reviewer.toString() === employeeId
      );

      return {
        reviewId: review._id,
        reviewee: review.reviewee,
        feedbackStatus: feedback ? feedback.status : "Not Assigned",
      };
    });

    res.status(200).json(feedbackStatuses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedback status", error });
  }
};

export {
  createReview,
  getAssignedReviews,
  submitFeedback,
  getFeedbackStatus,
  getAllReviews,
  updateReview,
  deleteReview,
};
