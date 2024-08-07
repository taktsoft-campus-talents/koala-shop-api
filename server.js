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
  // extract parameters from URL
  const { category, sort } = req.query;
  //set ascending sortOrder as default if none given
  let sortOrder = req.query.sortOrder || "ascending";

  // SQL command
  let query = "SELECT * FROM koala_products";

  // an array to save the parameters for the SQL request
  let queryParams = [];

  // check if there is a category and check which one
  if (category && (category === "tech" || category === "home")) {
    // add category condition to the SQL command
    query += " WHERE category = $1";
    // value of category (that the user chose) is inserted in the request
    queryParams.push(category);
  }

  // add new variable, check if sort field is valid
  if (sort && validSortFields.includes(sort)) {
    const orderBy = sortOrder === "ascending" ? "ASC" : "DESC";
    // add sort condition to the SQL command
    query += ` ORDER BY ${sort} ${orderBy}`;
  }

  try {
    const { rows: products } = await sql.query(query, queryParams);
    res.json(products);
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
