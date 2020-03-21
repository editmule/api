import { calculateCost } from "../libs/billing-lib";

test("First tier", () => {
  const orders=[{"wordcount":1000,"delivery":48,"content":"testing","attachment":null},{"wordcount":50,"delivery":24,"content":"4","attachment":null},{"wordcount":100,"delivery":24,"content":"6","attachment":null}];
  const cost = 6267;
  const expectedCost = calculateCost(orders);

  expect(cost).toEqual(expectedCost);
});

// test("Second tier", () => {
//   const words = 150;
//
//   const cost = 1750;
//   const expectedCost = calculateCost(words);
//
//   expect(cost).toEqual(expectedCost);
// });
//
// test("Third tier", () => {
//   const words = 1500;
//
//   const cost = 5500;
//   const expectedCost = calculateCost(words);
//
//   expect(cost).toEqual(expectedCost);
// });
//
// test("Fourth tier", () => {
//   const words = 6000;
//
//   const cost = 13000;
//   const expectedCost = calculateCost(words);
//
//   expect(cost).toEqual(expectedCost);
// });
//
// test("Fifth tier", () => {
//   const words = 15000;
//
//   const cost = 16000;
//   const expectedCost = calculateCost(words);
//
//   expect(cost).toEqual(expectedCost);
// });
