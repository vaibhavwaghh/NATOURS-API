const express = require('express');
const tourController = require('../controller/tourController');
const authController = require('./../controller/authController');
const reviewRouter = require('./../routes/reviewRoutes');
/**ROUTER INITIALIZATION */
const tourRouter = express.Router();

tourRouter.use('/:tourId/reviews', reviewRouter);
/**MIDDLEWARE PARAMETER FOR CHECKING WHETHER BODY IS VALID OR NOT */
/**ROUTES FOR TOURS*/
tourRouter
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAlltours);
tourRouter.route('/tour-stats').get(tourController.getTourStats);
tourRouter
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  );
tourRouter
  .route('/')
  .get(tourController.getAlltours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createNewTour,
  );
tourRouter
  .route('/:id')
  .get(tourController.getTourBasedOnId)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );
tourRouter
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
tourRouter
  .route('/distances/:latlng/unit/:unit')
  .get(tourController.getDistances);
module.exports = tourRouter;
