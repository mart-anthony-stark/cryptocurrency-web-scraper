const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api', require('./routes/scraper'))

app.listen(PORT, (e) => {
  if (e) return console.log(e);
  console.log(`Server running at port ${PORT}`);
});
