const express = require('express');
const reviewController = require('./../controller/reviewController');
const authController = require('./../controller/authController');
const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.use(authController.protect);
/**NESTED ROUTES */
/**POST --> /tour/23244edfd/reviews*/
/**GET  --> /tour/23244edfd/reviews*/
/**GET  --> /tour/23244edfd/reviews/235456gfdgtfg*/
/**POST --> /reviews */
reviewRouter
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );
reviewRouter
  .route('/:id')
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview,
  )
  .get(reviewController.getReviewBasedOnId);
module.exports = reviewRouter;
