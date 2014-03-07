CREATE TABLE IF NOT EXISTS `product` (
  `id` INTEGER PRIMARY KEY,
  `cid` INTEGER NOT NULL,
  `code` varchar(80) NULL,
  `name` varchar(255) NOT NULL,
  `picture` varchar(255) NULL
);

CREATE TABLE IF NOT EXISTS `product_category` (
  `id` INTEGER PRIMARY KEY,
  `name` varchar(80) NOT NULL,
  `color` varchar(7) NULL
);

CREATE UNIQUE INDEX product_idx ON product(name);

INSERT INTO product_category(name, color) VALUES ('Vegetables', '#66FF33'); 
INSERT INTO product_category(name, color) VALUES ('Fruits', '#CCFF33'); 
INSERT INTO product_category(name, color) VALUES ('Refrigerated', '#003DF5'); 
INSERT INTO product_category(name, color) VALUES ('Frozen', '#002EB8'); 
INSERT INTO product_category(name, color) VALUES ('Condiments', '#B88A00'); 
INSERT INTO product_category(name, color) VALUES ('Groceries', '#F5B800'); 
INSERT INTO product_category(name, color) VALUES ('Canned foods', '#FF6633'); 
INSERT INTO product_category(name, color) VALUES ('Dairy', '#FF3366'); 
INSERT INTO product_category(name, color) VALUES ('Meat', '#CC33FF'); 
INSERT INTO product_category(name, color) VALUES ('Seefood', '#33CCFF'); 
INSERT INTO product_category(name, color) VALUES ('Beverages', '#33FFCC'); 
INSERT INTO product_category(name, color) VALUES ('Snacks', '#CC6600'); 
INSERT INTO product_category(name, color) VALUES ('Baby stuffs', '#FF33CC'); 
INSERT INTO product_category(name, color) VALUES ('Pets', '#FFCC33'); 
INSERT INTO product_category(name, color) VALUES ('Personal care', '#33FF66'); 
INSERT INTO product_category(name, color) VALUES ('Medicine', '#CC0000'); 
INSERT INTO product_category(name, color) VALUES ('Cleaning stuff', '#6633FF'); 
INSERT INTO product_category(name, color) VALUES ('Office supplies', '#00CC00');