const mongoose = require('mongoose');
const validator = require('validator');
// const User = require('./userModel');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A tour length must have less than equal to 40 characters',
      ],
      minlength: [
        10,
        'A tour length must have more than equal to 10 characters',
      ],
      // validate: [validator.isAlpha, 'Tour must only contain characters'],
    },
    duration: {
      type: 'Number',
      required: [true, 'A tour must have duration'],
    },
    maxGroupSize: {
      type: 'Number',
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: 'String',
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy or medium or difficult',
      },
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingQuantity: { type: Number, default: 0 },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    slug: String,
    /**DATA MODELING */
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    /**EMBEDDED DOCUMENTS */
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    /**EMBEDDED --> 1 */
    // guides: Array,
    /**REFERENCING */
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    // reviews: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Review',
    //   },
    // ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

/**USING INDEXING IN MONGODB */
tourSchema.index({ price: 1, ratingAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
/**REFERENCING USING VIRTUAL POPULATE */
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

/**VIRTUAL PROPERTIES */
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

/**DOCUMENT MIDDLEWARE --> RUNS BEFORE .save() and .create() */
tourSchema.pre('save', function (next) {
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

/**EMBEDDED --> 2 */
// tourSchema.pre('save', async function (next) {
//   const guidePromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidePromises);
//   next();
// });
/**QUERY MIDDLEWARE --> RUN BEFORE QUERY EXECUTES -->PRE
 * AFTER QUERY EXECUTES -->POST
 * WE USE REGULAR EXPRESSION HERE FOR FIND AND FINDONE OR ANY THING ELSE THAT STARTS WITH FIND
 */
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

/**WE POPULATE THE  METHODS FOR REFERENCING */
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});
tourSchema.post('find', function (docs, next) {
  console.log(`Query took ${Date.now() - this.start}milliseconds`);
  next();
});

/**AGGREGATION MIDDLEWARE --> RUN BEFORE AGGREATE */
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());
//   next();
// });
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
