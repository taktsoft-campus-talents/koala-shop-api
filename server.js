require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = 3000;
const app = express();
app.use(cors());
app.use(express.json());
// const products = require("./data/products");
const { sql } = require("@vercel/postgres");

app.get("/", (req, res) => {
  return res.json({ message: "Welcome to the Koala API" });
});

app.get("/products", async (req, res) => {
  const { rows: products } = await sql`SELECT * FROM koala_products`;

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
