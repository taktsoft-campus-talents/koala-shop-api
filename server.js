const express = require("express");
const port = 3000;
const app = express();

app.get("/", (req, res) => {
  return res.json({ message: "Welcome to the Koala API" });
});

app.listen(port, () => {
  console.log(`Koala API running on port ${port}`);
});
