const crypto = require('crypto');

export function orderIdGen() {
  return ("111-" + random(5) + "-" + random(5) + "-" + random(5));
}

function random(length) {
  const chars = '0123456789';
  const rnd = crypto.randomBytes(length);
  const value = new Array(length);
  const len = Math.min(256, chars.length);
  const d = 256 / len;

  for (var i = 0; i < length; i++) {
    value[i] = chars[Math.floor(rnd[i] / d)];
  };

  return value.join('');
}
