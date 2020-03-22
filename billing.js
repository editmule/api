import stripePackage from "stripe";
import { calculateCost } from "./libs/billing-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const { orders, source } = JSON.parse(event.body);

  const amount = calculateCost(orders);
  const description = "Edit Mule order";

  // Load our secret key from the  environment variables
  const stripe = stripePackage(process.env.stripeSecretKey);

  try {
    const charge = await stripe.charges.create({
      source,
      amount,
      description,
      currency: "usd",
    });
    return success({ status: true, chargeId: charge.id });
  } catch (e) {
    return failure({ message: e.message });
  }
}
