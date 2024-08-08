const SQL_QUERIES = {
  GET_USER:
    "SELECT id, email, name, created_at, last_login FROM users WHERE id = $1 OR email = $2",
  INSERT_NEW_USER:
    "INSERT INTO koala_users (email, name, created_at, last_login) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id, email, name, created_at, last_login",
  LOGIN_USER:
    "UPDATE koala_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, email, name, created_at, last_login",
  PATCH_USER: "UPDATE koala_users SET name = $2 WHERE id = $1",
  DELETE_USER: "DELETE FROM koala_users WHERE id = $1",
  GET_PRODUCT: `SELECT id, title, category, description, image, price, leftInStock as "leftInStock" FROM koala_products WHERE id = $1`,
  INSERT_PRODUCT:
    "INSERT INTO koala_products (title, category, description, image, price, leftInStock) VALUES ($1, $2, $3, $4, $5, $6)",
  PATCH_PRODUCT:
    "UPDATE koala_products SET title = $2, category = $3, description = $4, image = $5, price = $6, leftInStock = $7 WHERE id = $1",
};
module.exports = SQL_QUERIES;
