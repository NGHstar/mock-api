const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// مسیر فایل JSON محصولات
const PRODUCTS_FILE = path.join(__dirname, "../data/products.json");

// تابع کمکی برای محاسبه هزینه ارسال
const getDeliveryCost = (deliveryOptionId) => {
  const deliveryCosts = {
    1: 0, // ارسال رایگان
    2: 25000,
    3: 50000,
  };
  return deliveryCosts[deliveryOptionId] || 0;
};

// تابع کمکی برای محاسبه زمان تحویل
const getEstimatedDelivery = (deliveryOptionId) => {
  const deliveryDays = {
    1: 7,
    2: 3,
    3: 1,
  };
  const daysToAdd = deliveryDays[deliveryOptionId] || 7;
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + daysToAdd);
  return estimatedDate.toISOString();
};

router.post("/", (req, res) => {
  const { cart } = req.body;

  if (!cart || !cart.items || !Array.isArray(cart.items)) {
    return res.status(400).json({ error: "Invalid request format" });
  }

  // خواندن اطلاعات از فایل JSON
  fs.readFile(PRODUCTS_FILE, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read product data" });
    }

    const products = JSON.parse(data);
    let total = 0;

    const productsResponse = cart.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return res
          .status(400)
          .json({ error: `Product not found: ${item.productId}` });
      }

      // محاسبه قیمت کل هر محصول (قیمت × تعداد)
      const productTotal = product.price * item.quantity;
      total += productTotal;

      // اضافه کردن هزینه ارسال
      total += getDeliveryCost(item.deliveryOptionId);

      return {
        productId: item.productId,
        quantity: item.quantity,
        estimatedDeliveryTime: getEstimatedDelivery(item.deliveryOptionId),
      };
    });

    // اضافه کردن مالیات ۱۰٪
    total += total * 0.1;
    total = Math.round(total); // گرد کردن عدد نهایی

    res.json({
      id: Math.random().toString(36).substr(2, 9),
      orderTime: new Date().toISOString(),
      total,
      products: productsResponse,
    });
  });
});

module.exports = router;
