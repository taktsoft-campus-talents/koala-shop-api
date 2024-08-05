require("dotenv").config();
const express = require("express");
const port = 3000;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "Welcome to the Koala API" });
});

app.get("/products", (req, res) => {
  try {
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Koala API running on port ${port}`);
});
