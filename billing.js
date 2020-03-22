import stripePackage from "stripe";
import nodemailer from "nodemailer";
import {
  calculateCost
} from "./libs/billing-lib";
import {
  success,
  failure
} from "./libs/response-lib";

export async function main(event, context) {
  const {
    orders,
    source
  } = JSON.parse(event.body);

  const amount = calculateCost(orders);
  const description = "Edit Mule order";

  const fromMail = 'hello@editmule.com';
  const toMail = 'zane.mountcastle@gmail.com';
  const subject = 'Order Receipt';
  const text = `This is your order receipt. Total: $${(amount/100).toFixed(2)}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: fromMail,
      pass: process.env.receiptEmailPassword
    }
  });

  const mailOptions = {
    from: `Edit Mule <${fromMail}>`,
    to: toMail,
    subject: subject,
    text: text
  };

  // Load our secret key from the  environment variables
  const stripe = stripePackage(process.env.stripeSecretKey);

  try {
    const charge = await stripe.charges.create({
      source,
      amount,
      description,
      currency: "usd",
    });

    // Send receipt
    await transporter.sendMail(mailOptions);

    return success({
      status: true,
      chargeId: charge.id
    });
  } catch (e) {
    return failure({
      message: e.message
    });
  }
}
