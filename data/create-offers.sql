DROP TABLE IF EXISTS koala_offers;

CREATE TABLE koala_offers
(id SERIAL PRIMARY KEY,
product_id INTEGER,
CONSTRAINT fk_product
  FOREIGN KEY(product_id)
  REFERENCES koala_products(id));