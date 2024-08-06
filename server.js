require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = 3000;
const app = express();
app.use(cors());
app.use(express.json());
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

app.get("/products/:id", async (req, res) => {
  const { id } = await req.params;
  const { rows } = await sql`SELECT * FROM koala_products WHERE id=${id}`;
  console.log(id);
  try {
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Koala API running on port ${port}`);
});
