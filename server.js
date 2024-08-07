require("dotenv").config();
const express = require("express");
const cors = require("cors");
const products = require("./data/products");
const { sql } = require("@vercel/postgres");
const SQL_QUERIES = require("./data/sql-queries");
const { GET_USER, INSERT_NEW_USER, LOGIN_USER } = SQL_QUERIES;

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());

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
  const { id } = req.params;
  try {
    const { rows } = await sql`SELECT * FROM koala_products WHERE id=${id}`;
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});
// If user exists, updates last_login date/time and returns user object
// If user doesn't exist, creates a new user and returns user object
app.post("/users/login", async (req, res) => {
  const { email, name } = req.body;
  try {
    const { rows: existedUser } = await sql.query(GET_USER, [null, email]);
    if (existedUser) {
      const { id } = existedUser;
      const { rows: loggedUser } = await sql.query(LOGIN_USER, [id]);
      res.status(200).json(loggedUser[0]);
    } else {
      const { rows: createdUser } = await sql.query(INSERT_NEW_USER, [
        email.trim(),
        name.trim(),
      ]);
      res.status(201).json(createdUser[0]);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Koala API running on port ${port}`);
});
