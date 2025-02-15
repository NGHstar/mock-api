const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

// تنظیمات عمومی
app.use(cors());
app.use(express.json());

app.use("/persian-amazon/orders", require("./routes/persian-amazon/orders"));
app.use(
  "/persian-amazon/products",
  require("./routes/persian-amazon/products")
);

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
  });
}

// برای Vercel
module.exports = app;
