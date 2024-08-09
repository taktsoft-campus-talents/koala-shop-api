const SQL_QUERIES = {
  GET_USER: `SELECT
  id, name, created_at, last_login FROM koala_users WHERE id = $1 OR name = $2
    koala_users.id,
    koala_users.name,
    koala_users.created_at,
    koala_users.last_login,
    koala_rebates.id AS rebateId
  FROM
    koala_users
      WHERE id = $1 OR name = $2
  LEFT JOIN
    koala_rebates
  ON
    koala_users.id = koala_rebates.user_id;`,
  INSERT_NEW_USER:
    "INSERT INTO koala_users (name, created_at, last_login) VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id",
  LOGIN_USER:
    "UPDATE koala_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1",
  GET_SPECIALS: `SELECT
    koala_offers.id AS "offerId",
    koala_products.id AS "productId",
    koala_products.title,
    koala_products.category,
    koala_products.description,
    koala_products.teaser,
    koala_products.image,
    koala_products.price,
    koala_products.leftInStock AS "leftInStock"
      FROM
        koala_offers
      INNER JOIN
        koala_products
      ON
        koala_offers.product_id = koala_products.id;`,
};
module.exports = SQL_QUERIES;
