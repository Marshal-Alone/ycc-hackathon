const Review = require('../../models/Review');

exports.createReview = async (req, res) => {
  const { listingId, rating, comment } = req.body;

  try {
    const newReview = new Review({
      listing: listingId,
      renter: req.user.id,
      rating,
      comment,
    });

    const review = await newReview.save();
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ listing: req.params.listingId }).populate('renter', ['name']);
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
