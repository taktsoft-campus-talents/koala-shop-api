DROP TABLE koala_products;

CREATE TABLE koala_products
(
id SERIAL PRIMARY KEY,
title VARCHAR (255),
description VARCHAR (255),
price integer,
image VARCHAR (255),
category VARCHAR (255),
leftInStock integer);

INSERT INTO koala_products 
(title, description, price, image, category, leftInStock ) 
VALUES
 ('Laptop',
 'HP EliteBook 840 G6 14inches Core i5 1.6 GHz - SSD 256 GB - 16GB QWERTZ - Deutsch',
 '2596.00',
 'laptop.jpg',
  'tech', 
  '30');

  INSERT INTO koala_products 
  (title, description,price,image,category,leftInStock ) 
  VALUES 
  ('Portable Projector','
  Mini Projector, ClokoWe, 1080P HD, 7000L, Compatible with Android/iOS/Windows/TV Stick/HDMI/USB',
  '159',
  'projector.jpg',
   'tech', 
'50');

INSERT INTO koala_products 
(title, description,price,image,category,leftInStock ) 
VALUES 
('Bluetooth Speaker',
'DOSS SoundBox Pro+ Bluetooth Speaker with IPX6 Waterproof, 24 W Dual Bass Drivers, Stereo Pairing, Colourful Light',
'159','speaker.jpg', 'tech', '100');

INSERT INTO koala_products 
(title, description,price,image,category,leftInStock )
 VALUES 
 ('Koala Mug','Capacity: 325 ml
Colored throughout (colored inside and outside)
Please wash by hand
Material: 100% ceramic (glossy), ','21','mug.jpg', 'home', '300');

INSERT INTO koala_products 
(title, description,price,image,category,leftInStock ) 
VALUES 
('Koala T-Shirt','Retro Sunset Koala Bear Silhouette T-Shirt '
,'19','tshirt.jpg', 'home', '300');