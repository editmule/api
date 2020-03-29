import stripePackage from "stripe";
import nodemailer from "nodemailer";
import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import {
  success,
  failure
} from "./libs/response-lib";
import {
  orderIdGen
} from "./libs/order-lib";
import {
  calculateCost,
  subtotalPricing
} from "./libs/billing-lib";

export async function main(event, context) {
  const {
    orders,
    source,
    email,
    isAuthenticated
  } = JSON.parse(event.body);

  // Load our secret key from the  environment variables
  const stripe = stripePackage(process.env.stripeSecretKey);

  const orderNum = orderIdGen(); // orderNum is shared across all orders in a cart that are charged together
  const orderStatus = "PENDING"; // Orders remain "PENDING" until they become "IN_PROGRESS" and then "COMPLETE";

  const amount = calculateCost(orders).toFixed(0);
  const description = `Edit Mule order number: ${orderNum}`;

  const text = `This is your order receipt. Total: $${(amount/100).toFixed(2)}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hello@editmule.com',
      pass: process.env.receiptEmailPassword
    }
  });

  const mailOptions = {
    from: `Edit Mule <hello@editmule.com>`,
    bcc: 'hello@editmule.com',
    to: email,
    subject: 'Order Receipt',
    text: text
  };

  let response = [];

  try {
    // Charge the card
    const charge = await stripe.charges.create({
      source,
      amount,
      description,
      currency: "usd"
    });

    // Send receipt
    await transporter.sendMail(mailOptions);

    for (let order of orders) {
      // Subtotal for this project
      const orderCost = subtotalPricing(order.wordcount, order.delivery) * 100;
      const userId = isAuthenticated.toString() === 'true' ? event.requestContext.identity.cognitoIdentityId : 'anonymous';
      const orderContent = (order.content === "" || order.content === null) ? null : order.content;
      const params = {
        TableName: process.env.tableName,
        Item: {
          userId: userId,
          email: email,
          orderId: uuid.v1(),
          orderNum: orderNum,
          chargeId: charge.id,
          cost: orderCost,
          content: orderContent,
          wordcount: order.wordcount,
          delivery: order.delivery,
          attachment: order.attachment,
          status: orderStatus,
          createdAt: Date.now()
        }
      };
      await dynamoDbLib.call("put", params);
      response.push(params.Item);
    }

    return success({
      orders: response,
      status: true,
    });
  } catch (e) {
    return failure({
      message: e.message
    });
  }
}
