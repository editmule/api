export function calculateCost(orders) {

  const subtotal = (Number(orders.reduce((prev,next) => prev + subtotalPricing(next.wordcount, next.delivery), 0))).toFixed(2);
  const serviceFee = Number(((subtotal)*0.15).toFixed(2));

  return (Number(subtotal)+Number(serviceFee))*100; // Sum costs and convert from dollars to cents
}

function subtotalPricing(wordcount, delivery) {
  const wordcountCost = wordcountToPricing(wordcount);
  const deliveryDiscount = deliveryToPricing(wordcount, delivery);

  return (Number((wordcountCost + deliveryDiscount).toFixed(2)));
}

function wordcountToPricing(wordcount) {

  let rate = 0;
  if (wordcount <= 75) {
    rate = 0.10;
  } else if (wordcount <= 200) {
    rate = 0.07;
  } else if (wordcount <= 300) {
    rate = 0.066;
  } else if (wordcount <= 500) {
    rate = 0.054;
  } else if (wordcount <= 1000) {
    rate = 0.05;
  } else if (wordcount <= 5000) {
    rate = 0.047;
  } else {
    rate = 0.045;
  }

  return Number((wordcount*rate).toFixed(2));
}

function deliveryToPricing(wordcount, delivery) {
  const cost = wordcountToPricing(wordcount);
  let discountRate = 0;

  delivery = Number(delivery);

  if (delivery===24) {
    discountRate = 0;
  } else if (delivery===48) {
    discountRate = -0.15;
  } else if (delivery===72) {
    discountRate = -0.25;
  }

  const discount = cost*discountRate;

  return Number((discount).toFixed(2));
}
