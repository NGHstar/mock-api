const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { cart } = req.body;

  if (!cart || !Array.isArray(cart)) {
    return res.status(400).json({ error: "Invalid request format" });
  }

  const orderId = Math.random().toString(36).substr(2, 9);
  const orderTime = new Date().toISOString(); // فرمت استاندارد
  const estimatedDelivery = new Date(
    Date.now() + 2 * 24 * 60 * 60 * 1000
  ).toISOString();
  const total = 5800; // مقدار ثابت

  const products = cart.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    estimatedDeliveryTime: estimatedDelivery,
  }));

  res.json({
    id: orderId,
    orderTime,
    total,
    products,
  });
});

module.exports = router;
