import moment from 'moment-timezone';

export function calculateCost(orders) {

  const subtotal = (Number(orders.reduce((prev, next) => prev + subtotalPricing(next.wordcount, next.delivery), 0))).toFixed(2);
  const serviceFee = Number(((subtotal) * 0.15).toFixed(2));

  return (Number(subtotal) + Number(serviceFee)) * 100; // Sum costs and convert from dollars to cents
}

export function subtotalPricing(wordcount, delivery) {
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

  return Number((wordcount * rate).toFixed(2));
}

function deliveryToPricing(wordcount, delivery) {
  const cost = wordcountToPricing(wordcount);
  let discountRate = 0;

  delivery = Number(delivery);

  if (delivery === 24) {
    discountRate = 0;
  } else if (delivery === 48) {
    discountRate = -0.15;
  } else if (delivery === 72) {
    discountRate = -0.25;
  }

  const discount = cost * discountRate;

  return Number((discount).toFixed(2));
}

function getDeliveryEstimate(delivery) {
  const date = moment().add(delivery, 'hours');
  return `${date.format('MMMM D')}, ${date.tz('America/New_York').format('ha z')} (${date.tz('America/Los_Angeles').format('ha z')})`;
}

function formatFilename(str) {
  return str.replace(/^\w+-/, "");
}

function listOrders(orders, lineEnding){
  return orders.map((order, index) => (
    `${index+1}. ${order.content ? order.content : formatFilename(order.attachment)} -- ${getDeliveryEstimate(order.delivery)}${lineEnding}`
  )).join('');
}

export function generateReceiptHtml(orders, orderNum, charge) {
  return `<p>Hey,</p><p>We've received your order ${orderNum}. Your document delivery estimates are below:</p><p>${listOrders(orders, "<br>")}</p><p>Order total: $${(calculateCost(orders)/100).toFixed(2)}</p><p>We will email you with each document as it is completed.</p><p><a href=${charge.receipt_url}>View your receipt.</a></p><p>Questions? Please reply to this email and we'll be happy to help.</p>Thanks,<br>Edit Mule`;
}

export function generateReceipt(orders, orderNum, charge) {
  return `Hey,\n\nWe've received your order ${orderNum}. Your document delivery estimates are below:\n\n${listOrders(orders, "\n")}\nOrder total: $${(calculateCost(orders)/100).toFixed(2)}\n\nWe will email you with each document as it is completed.\n\nQuestions? Please reply to this email and we'll be happy to help.\n\nThanks,\nEdit Mule`;
}
