DROP TABLE IF EXISTS koala_rebates;
DROP TABLE IF EXISTS koala_offers;
DROP TABLE IF EXISTS koala_products;
DROP TABLE IF EXISTS koala_users;

CREATE TABLE koala_users
(id SERIAL PRIMARY KEY,
email VARCHAR (255) NOT NULL,
name VARCHAR (255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
last_login TIMESTAMP);

CREATE TABLE koala_products
(
id SERIAL PRIMARY KEY,
title VARCHAR (255),
description VARCHAR (1000),
teaser VARCHAR (255),
price integer,
image VARCHAR (255),
category VARCHAR (255),
leftInStock integer);

INSERT INTO koala_products
(title, description, teaser, price, image, category, leftInStock )
VALUES
 ('Laptop',
 'HP EliteBook 840 G6 14inches Core i5 1.6 GHz - SSD 256 GB - 16GB QWERTZ - Deutsch',
 'HP EliteBook 840 G6',
 259600,
 'laptop.jpg',
  'tech',
  30);

  INSERT INTO koala_products
  (title, description,teaser,price,image,category,leftInStock )
  VALUES
  ('Portable Projector','
  Mini Projector, ClokoWe, 1080P HD, 7000L, Compatible with Android/iOS/Windows/TV Stick/HDMI/USB',
  'ClokoWe Mini Projector 1080P HD',
  15900,
  'projector.jpg',
   'tech',
50);

INSERT INTO koala_products
(title, description,teaser,price,image,category,leftInStock )
VALUES
('Bluetooth Speaker',
'DOSS SoundBox Pro+ Bluetooth Speaker with IPX6 Waterproof, 24 W Dual Bass Drivers, Stereo Pairing, Colourful Light',
'DOSS SoundBox Pro+ Dual Bass Bluetooth Speaker',
15900,'speaker.jpg', 'tech', 100);

INSERT INTO koala_products
(title, description,teaser,price,image,category,leftInStock )
 VALUES
 ('Koala Mug','Capacity: 325 ml
Colored throughout (colored inside and outside)
Please wash by hand
Material: 100% ceramic (glossy)',
'The Koala Shop Signature Mug!'
,2100,'koala-mug.jpg', 'home', 300);

INSERT INTO koala_products
(title, description,teaser,price,image,category,leftInStock )
VALUES
('Koala T-Shirt','Retro Sunset Koala Bear Silhouette T-Shirt',
'Stylish Koala Silhouette T-Shirt'
,1900,'koala-t-shirt.jpg', 'home', 300);

CREATE TABLE koala_offers
(id SERIAL PRIMARY KEY,
product_id INTEGER,
CONSTRAINT fk_product
  FOREIGN KEY(product_id)
  REFERENCES koala_products(id));

  INSERT INTO koala_offers (product_id) VALUES(4);
  INSERT INTO koala_offers (product_id) VALUES(3);

CREATE TABLE koala_rebates
(id SERIAL PRIMARY KEY,
user_id INTEGER,
CONSTRAINT fk_product
  FOREIGN KEY(user_id)
  REFERENCES koala_users(id));