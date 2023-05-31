const fs = require('fs');

const numberGenerator = (amount, min, max) => {
  const product = new Set();
  const range = max - min;
  while (product.size <= amount) {
    const number = Math.trunc(max - (Math.random() * range));
    product.add(number);
  }

  return [...product];
};

const productIds = numberGenerator(1000, 900000, 1000011);

fs.writeFileSync('./product.csv', productIds.join('\n'));

const { exec } = require('child_process');

exec('artillery run style.yml', (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  fs.writeFileSync('./style.result.txt', stdout);
});
