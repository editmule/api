export function calculateCost(words) {
  let rate = 0;

  if (words <= 100) {
    rate = 10; // $0.10 per word
  } else if (words <= 1000) {
    rate = 5; // $0.05 per word
  } else if (words <= 5000){
    rate = 3; // $0.03 per word
  } else if (words <= 10000){
    rate = 2; // $0.02 per word
  } else { // >10,000 words
    rate = 1; // $0.01 per word
  }

  return (rate * words) + 1000; // $10 + words * rate per words
}
