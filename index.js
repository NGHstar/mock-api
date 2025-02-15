const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

// تنظیمات عمومی
app.use(cors());
app.use(express.json());

app.use("/api/persian-amazon/orders", require("./routes/orders"));
app.use("/api/persian-amazon/products", require("./routes/products"));

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
  });
}

// برای Vercel
module.exports = app;
