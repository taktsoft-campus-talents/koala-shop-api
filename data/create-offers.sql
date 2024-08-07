DROP TABLE IF EXISTS koala_offers;

CREATE TABLE koala_offers
(id SERIAL PRIMARY KEY,
product_id INTEGER,
user_id INTEGER,
type INTEGER NOT NULL,
value INTEGER,
valid_from TIMESTAMP,
valid_to TIMESTAMP,
CONSTRAINT fk_product
  FOREIGN KEY(product_id)
  REFERENCES koala_products(id),
CONSTRAINT fk_user
  FOREIGN KEY(user_id)
  REFERENCES koala_users(id));