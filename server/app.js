const app = require('./index');

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
  console.log(`Server available at http://localhost:${PORT}`);
});
