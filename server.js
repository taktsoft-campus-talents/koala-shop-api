require("dotenv").config();
const express = require("express");
const cors = require("cors");
const products = require("./data/products");
const { sql } = require("@vercel/postgres");
const SQL_QUERIES = require("./data/sql-queries");
const {
  GET_USER,
  INSERT_NEW_USER,
  LOGIN_USER,
  PATCH_USER,
  DELETE_USER,
  GET_PRODUCT,
  INSERT_PRODUCT,
  PATCH_PRODUCT,
  DELETE_PRODUCT,
  INSERT_OFFER,
  DELETE_OFFER,
} = SQL_QUERIES;

const port = 3000;
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

app.post("/products", async (req, res) => {
  const payload = req.body;
  try {
    const isSyntaxError = (payload) => {
      const requiredFields = [
        "title",
        "category",
        "description",
        "image",
        "price",
        "leftInStock",
      ];
      // 1st check - if one of the properties missing or mistyped
      let isFoundError =
        Object.keys(payload).sort().join("") !== requiredFields.sort().join("")
          ? true
          : false;
      // 2nd check - if one of the numeric fields is negative or string is empty
      Object.values(payload).forEach((value) => {
        if (
          (typeof value === "number" && value < 0) ||
          (typeof value === "string" && value.trim() === "")
        )
          isFoundError = true;
      });
      return isFoundError;
    };
    if (isSyntaxError(payload)) {
      res.status(400).json({
        message: "One of the propeties is missed or has invalid value",
      });
    }
    const { title, category, description, image, price, leftInStock } = payload;
    const { rowCount } = await sql.query(INSERT_PRODUCT, [
      title,
      category,
      description,
      image,
      price,
      leftInStock,
    ]);
    if (rowCount === 1) {
      res.status(200).json({ message: "New product was successfully added" });
    } else {
      throw new Error("Error adding new product");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.patch("/products/:id", async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  try {
    const isSyntaxError = (payload) => {
      let isFoundError = false;
      Object.values(payload).forEach((value) => {
        if (
          (typeof value === "number" && value < 0) ||
          (typeof value === "string" && value.trim() === "")
        )
          isFoundError = true;
      });
      return isFoundError;
    };
    if (isSyntaxError(payload)) {
      res.status(400).json({
        message: "One of the propeties has invalid value",
      });
    }
    const { rows: existedProduct } = await sql.query(GET_PRODUCT, [id]);
    if (existedProduct.length > 0) {
    } else {
      res.status(404).json({
        message: `Product with id ${id} not found`,
      });
    }
    const requiredFields = [
      "title",
      "category",
      "description",
      "image",
      "price",
      "leftInStock",
    ];
    const queryParams = [id];
    requiredFields.forEach((field) =>
      queryParams.push(payload[field] ? payload[field] : existedProduct[field])
    );
    const { rowCount } = await sql.query(PATCH_PRODUCT, queryParams);
    if (rowCount === 1) {
      res
        .status(200)
        .json({ message: `Product id #${id} was updated successfully` });
    } else {
      throw new Error("Error changing product");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows: existedProduct } = await sql.query(GET_PRODUCT, [id]);
    if (existedProduct.length > 0) {
    } else {
      res.status(404).json({
        message: `Product with id ${id} not found`,
      });
    }
    await sql.query(DELETE_PRODUCT, queryParams);
    res
      .status(200)
      .json({ message: `Product id #${id} was deleted successfully` });
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

app.patch("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const { rows: existedUser } = await sql.query(GET_USER, [id, null]);
    if (existedUser.length > 0) {
      if (name && name.trim() !== "") {
        await sql.query(PATCH_USER, [id, name]);
        res.status(200).json({ message: `User with id ${id} was updated` });
      } else {
        res.status(400).json({ message: `New name is not provided or empty` });
      }
    } else {
      res.status(404).json({ message: `User with id ${id} not found` });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows: existedUser } = await sql.query(GET_USER, [id, null]);
    if (existedUser.length > 0) {
      await sql.query(DELETE_USER, [id]);
      res.status(200).json({ message: `User with id ${id} was deleted` });
    } else {
      res.status(404).json({ message: `User with id ${id} not found` });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/specials/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    const { rows } = await sql.query(INSERT_OFFER, [productId]);
    res.status(200).json({
      message: `Offer for product id #${productId} was added (offer id - #${rows[0].id})`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/specials/:offerId", async (req, res) => {
  const { offerId } = req.params;
  try {
    await sql.query(DELETE_OFFER, [offerId]);
    res
      .status(200)
      .json({ message: `Offer id #${offerId} was deleted sucessfully` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Koala API running on port ${port}`);
});
