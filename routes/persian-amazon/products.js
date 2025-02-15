const express = require("express");
const fs = require("fs");
const router = express.Router();

router.get("/", (req, res) => {
  fs.readFile(
    "routes/persian-amazon/data/products.json",
    "utf8",
    (err, data) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(JSON.parse(data));
    }
  );
});

module.exports = router;
