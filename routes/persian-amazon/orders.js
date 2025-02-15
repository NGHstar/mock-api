const express = require("express");
const router = express.Router();

// تابع کمکی برای محاسبه زمان تحویل
const getEstimatedDelivery = (deliveryOptionId) => {
  const deliveryDays = {
    1: 7, // یک هفته بعد
    2: 3, // سه روز بعد
    3: 1, // فردا
  };

  const daysToAdd = deliveryDays[deliveryOptionId] || 7; // پیش‌فرض ۷ روزه
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + daysToAdd);

  return estimatedDate.toISOString();
};

router.post("/", (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: "Invalid request format" });
  }

  const orderId = Math.random().toString(36).substr(2, 9);
  const orderTime = new Date().toISOString(); // فرمت استاندارد
  const total = 5800; // مقدار ثابت

  const products = items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    estimatedDeliveryTime: getEstimatedDelivery(item.deliveryOptionId),
  }));

  res.json({
    id: orderId,
    orderTime,
    total,
    products,
  });
});

module.exports = router;
