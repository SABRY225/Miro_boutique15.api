const express = require("express");

const {
  addProductReview,
  getProductReviews,
  getProductsReviewsForAdmin,
  rejectReview,
  verifyReview,
} = require("../../controllers/shop/product-review-controller");

const router = express.Router();

router.post("/add", addProductReview);
router.get("/", getProductsReviewsForAdmin);
router.get("/:productId", getProductReviews);
router.put("/verify/:reviewId", verifyReview);
router.put("/reject/:reviewId", rejectReview);

module.exports = router;
