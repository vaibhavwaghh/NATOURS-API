const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('./../models/tourModel');
const Booking = require('./../models/bookingModel');
const factory = require('./handlerFactory');
const catchAsyncErrors = require('../utils/catchAsyncError');
const AppError = require('../utils/appError');

exports.getCheckOutSession = catchAsyncErrors(async (req, res, next) => {
  /**1) GET THE CURRENTLY BOOKED TOUR */
  const clientUrl = 'http://localhost:5173';

  console.log('ALO ME CHECKOUT MADHE', clientUrl);

  const tour = await Tour.findById(req.params.tourId);

  /**2) CREATE CHECKOUT SESSION */

  const session = await stripe.checkout.sessions.create({
    // Define the payment method types (only card payments are supported)
    payment_method_types: ['card'],
    // Set the mode to "payment" to create a one-time payment
    mode: 'payment',
    // Define the URLs for success and cancellation redirects
    // success_url: `${req.protocol}://${req.get('host')}/?tour=${
    //   req.params.tourId
    // }&user=${req.user.id}&price=${tour.price}`,
    success_url: `${clientUrl}?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    // Set the customer email and client reference ID
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    // Add the line items for the session (in this case, only one tour)
    line_items: [
      {
        // Define the price data for the tour
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
          unit_amount: tour.price * 100, // Convert the tour price to paise (Indian currency)
        },
        quantity: 1, // Only one tour is being booked in this session
      },
    ],
  });
  console.log('HA AHE BHAVA APLA SESSION', session);

  /**3) CREATE SESSION AS RESPONSE */
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckOut = catchAsyncErrors(async (req, res, next) => {
  console.log('ALO RE ME CREATE BOOKING CHECKOUT MADHE KASA AHES', req.body);

  const { tour, user, price } = req.body;
  if (!tour && !user && !price) {
    console.log('CHALO RE BHAVA ME PUDHE');

    return next();
  }
  console.log('KARTO CREATE TOUR THAMB ZARA');

  await Booking.create({ tour, user, price });

  const clientUrl = req.get('Referer');

  console.log('HA AHE MAJA CLIENT ANI SERVER URL', clientUrl);

  res.status(200).json({
    status: 'success',
    url: clientUrl,
  });
  // res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
