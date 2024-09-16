/* eslint-disable import/no-unresolved */
// eslint-disable-next-line import/no-unresolved
import { sleep } from 'k6';
import http from 'k6/http';
// import { review } from '../controllers/reviews.js';
export const options = {
  stages: [
    // { duration: '5s', target: 10 },
    { duration: '5s', target: 100 },
  ],
};
export default function () {
  // const req = { product_id: 30344 };
  const productId = 952409;
  const reviewsUrl = `http://127.0.0.1:3500/reviews?product_id=${productId}`;
  const metaUrl = `http://127.0.0.1:3500/reviews/meta?product_id=${productId}`;
  http.get(reviewsUrl);
  http.get(metaUrl);
  sleep(1);
}
