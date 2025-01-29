const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } =
      req.body;

    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      // orderStatus: "confirmed" || "delivered",
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase product to review it.",
      });
    }

    const checkExistinfReview = await ProductReview.findOne({
      productId,
      userId,
    });

    if (checkExistinfReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product!",
      });
    }

    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
      isVerified:0
    });

    await newReview.save();

    const reviews = await ProductReview.find({ productId });
    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewsLength;

    await Product.findByIdAndUpdate(productId, { averageReview });

    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await ProductReview.find({ productId,isVerified:1 });
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const getProductsReviewsForAdmin = async (req, res) => {
  try {

    const reviews = await ProductReview.find({});
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};


// تأكيد الريفيو
exports.verifyReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const updatedReview = await ProductReview.findByIdAndUpdate(
      reviewId,
      { isVerified: 1 },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review verified successfully", review: updatedReview });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.rejectReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const updatedReview = await ProductReview.findByIdAndUpdate(
      reviewId,
      { isVerified: 0 },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review rejected successfully", review: updatedReview });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// رفض الريفيو
exports.rejectReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const updatedReview = await ProductReview.findByIdAndUpdate(
      reviewId,
      { isVerified: 0 },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review rejected successfully", review: updatedReview });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};


module.exports = { addProductReview, getProductReviews,getProductsReviewsForAdmin };
