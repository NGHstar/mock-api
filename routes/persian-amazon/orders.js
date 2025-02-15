const express = require("express");
const axios = require("axios"); // برای دریافت محصولات از API
const router = express.Router();

const PRODUCTS_API =
  "https://mock-api-zeta-liard.vercel.app/persian-amazon/products";

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

router.post("/", async (req, res) => {
  const { cart } = req.body;

  if (!cart || !cart.items || !Array.isArray(cart.items)) {
    return res.status(400).json({ error: "Invalid request format" });
  }

  try {
    // دریافت لیست محصولات از API
    const { data: products } = await axios.get(PRODUCTS_API);

    let total = 0;
    const productsResponse = cart.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return res
          .status(400)
          .json({ error: `Product not found: ${item.productId}` });
      }

      // قیمت کل محصول (قیمت واحد × تعداد)
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
    total = Math.round(total); // گرد کردن مبلغ نهایی

    res.json({
      id: Math.random().toString(36).substr(2, 9),
      orderTime: new Date().toISOString(),
      total,
      products: productsResponse,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product data" });
  }
});

module.exports = router;
