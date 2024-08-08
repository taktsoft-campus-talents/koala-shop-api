const SQL_QUERIES = {
  GET_USER:
    "SELECT id, name, created_at, last_login FROM koala_users WHERE id = $1 OR name = $2",
  INSERT_NEW_USER:
    "INSERT INTO koala_users (name, created_at, last_login) VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id, name, created_at, last_login",
  LOGIN_USER:
    "UPDATE koala_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, name, created_at, last_login",
  GET_SPECIALS: "SELECT * FROM koala_offers",
};
module.exports = SQL_QUERIES;
