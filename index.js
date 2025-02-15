const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

// تنظیمات عمومی
app.use(cors());
app.use(express.json());

app.use(
  "/api/persian-amazon/orders",
  require("./routes/persian-amazon/orders")
);

app.use(
  "/api/persian-amazon/products",
  require("./routes/persian-amazon/products")
);

// اجرای سرور
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
