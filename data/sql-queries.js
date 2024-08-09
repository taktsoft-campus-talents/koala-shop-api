const SQL_QUERIES = {
  GET_USER:
    "SELECT id, name, created_at, last_login FROM users WHERE id = $1 OR name = $2",
  INSERT_NEW_USER:
    "INSERT INTO koala_users (name, created_at, last_login) VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id, name, created_at, last_login",
  LOGIN_USER:
    "UPDATE koala_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, email, name, created_at, last_login",
  INSERT_REBATE: "INSERT INTO koala_rebates (user_id) VALUES ($1) RETURNING id",
};
module.exports = {
  SQL_QUERIES,
};
