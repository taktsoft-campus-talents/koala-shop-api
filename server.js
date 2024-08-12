require("dotenv").config();
const express = require("express");
const cors = require("cors");
const products = require("./data/products");
const { sql } = require("@vercel/postgres");
const SQL_QUERIES = require("./data/sql-queries");
const { GET_USER, INSERT_NEW_USER, LOGIN_USER, INSERT_REBATE, GET_SPECIALS } =
  SQL_QUERIES;

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "Welcome to the Koala API" });
});

app.get("/products", async (req, res) => {
  const validSortFields = ["price", "title"];
  // extract parameters from URL
  const { category, sort } = req.query;
  // set ascending sortOrder as default if none given

  let sortOrder = req.query.order || "ascending";

  // SQL command
  let query = "SELECT * FROM koala_products";

  // an array to save the parameters for the SQL request
  let queryParams = [];

  // check if there is a category
  if (category) {
    // add category condition to the SQL command
    query += " WHERE category = $1";
    // value of category (that the user chose) is inserted in the request
    queryParams.push(category);
  }

  // add new variable, check if sort field is valid
  if (sort && validSortFields.includes(sort)) {
    const orderBy = sortOrder === "descending" ? "DESC" : "ASC";
    // add sort condition to the SQL command
    query += ` ORDER BY ${sort} ${orderBy}`;
  }

  try {
    const { rows: products } = await sql.query(query, queryParams);
    res.json(
      products.map((product) => {
        const { leftinstock, ...rest } = product;
        return {
          ...rest,
          leftInStock: leftinstock,
        };
      })
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/products/categories", async (req, res) => {
  try {
    const { rows: categories } =
      await sql`SELECT DISTINCT category FROM koala_products`;
    res.json(categories);
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
  const { name } = req.body;
  try {
    const { rows: existedUser } = await sql.query(GET_USER, [null, name]);
    if (existedUser[0]) {
      const { id } = existedUser[0];
      await sql.query(LOGIN_USER, [id]); // update last login date/time
      const { rows: user } = await sql.query(GET_USER, [id, null]);
      res.status(200).json(user[0]);
    } else {
      const { rows: createdUser } = await sql.query(INSERT_NEW_USER, [
        name.trim(),
      ]);
      const { rows: user } = await sql.query(GET_USER, [
        createdUser[0].id,
        null,
      ]);
      res.status(201).json(user[0]);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/users/scanrebate", async (req, res) => {
  const { user, type, data } = req.body;
  try {
    if (type !== "koala-shop" || data !== "discount") {
      res.status(400).json({ message: `Not a valid rebate` });
    }
    let { rows: existedUser } = await sql.query(GET_USER, [null, user]);
    if (existedUser.length === 0) {
      const { rows } = await sql.query(INSERT_NEW_USER, [user]);
      existedUser = rows;
    }
    await sql.query(INSERT_REBATE, [existedUser[0].id]);
    res.status(201).json({
      message: `${
        existedUser.length === 0 ? `New user ${user} was created. ` : ""
      } Rebate for user ${user} was added sucessfully`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/specials", async (_, res) => {
  try {
    const { rows: specials } = await sql.query(GET_SPECIALS);
    res.status(200).json(specials);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Koala API running on port ${port}`);
});
