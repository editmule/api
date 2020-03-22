import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import { orderIdGen } from "./libs/order-lib";
import { subtotalPricing } from "./libs/billing-lib";

export async function main(event, context) {
  const { orders, chargeId } = JSON.parse(event.body);
  const orderNum = orderIdGen(); // orderNum is shared across all orders in a cart that are charged together
  const orderStatus = "PENDING"; // Orders remain "PENDING" until they become "IN_PROGRESS" and then "COMPLETE";

  let response = [];

  for (let order of orders) {
    // Subtotal for this project
    const orderCost = subtotalPricing(order.wordcount, order.delivery)*100;
    try {
      const params = {
        TableName: process.env.tableName,
        Item: {
          userId: event.requestContext.identity.cognitoIdentityId,
          orderId: uuid.v1(),
          orderNum: orderNum,
          chargeId: chargeId,
          cost: orderCost,
          content: order.content,
          wordcount: order.wordcount,
          delivery: order.delivery,
          attachment: order.attachment,
          status: orderStatus,
          createdAt: Date.now()
        }
      };
      await dynamoDbLib.call("put", params);
      response.push(params.Item);
    } catch (e) {
      // Return failure in the event of just a single failure
      return failure({status: false});
    }
  }

  // Return success only if all orders succeed
  return success(response);
}
