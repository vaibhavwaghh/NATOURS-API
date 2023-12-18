import { showAlert } from './alerts';
// const stripe = Stripe(
//   'pk_test_51OOcmGSJ04lWz7sm6gOr6WqAlGt1dWC8bG92xC98mLzbOxsVQEaguw9mXmyWW0QYDW4P4jKmnxJ72bZQPsdCzpPO00i6fFi33q',
// );
export const bookTour = async (tourId) => {
  /**1) GET CHECKOUT SESSION FROM API */
  try {
    // console.log(stripe, Stripe());
    console.log(tourId);
    const res = await fetch(
      `http://127.0.0.1:3900/api/v1/bookings/checkout-session/${tourId}`,
    );

    const session = await res.json();
    console.log(session);

    /**2) CREATE CHECKOUT FORM + CHARGE CREDIT CARD FOR IT */
    if (session?.session?.url) {
      window.location.href = session.session.url;
    } else {
      showAlert('error', 'Something went wrong!');
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
