CREATE TABLE IF NOT EXISTS `product` (
  `id` INTEGER PRIMARY KEY,
  `cid` INTEGER NOT NULL,
  `code` varchar(80) NULL,
  `name` varchar(255) NOT NULL,
  `picture` varchar(255) NULL
);

CREATE TABLE IF NOT EXISTS `product_category` (
  `id` INTEGER PRIMARY KEY,
  `name` varchar(80) NOT NULL
);

INSERT INTO product_category(name) VALUES ('Vegetables'); 
INSERT INTO product_category(name) VALUES ('Fruits'); 
INSERT INTO product_category(name) VALUES ('Refrigerated'); 
INSERT INTO product_category(name) VALUES ('Frozen'); 
INSERT INTO product_category(name) VALUES ('Condiments'); 
INSERT INTO product_category(name) VALUES ('Groceries'); 
INSERT INTO product_category(name) VALUES ('Canned foods'); 
INSERT INTO product_category(name) VALUES ('Dairy'); 
INSERT INTO product_category(name) VALUES ('Meat'); 
INSERT INTO product_category(name) VALUES ('Seefood'); 
INSERT INTO product_category(name) VALUES ('Beverages'); 
INSERT INTO product_category(name) VALUES ('Snacks'); 
INSERT INTO product_category(name) VALUES ('Baby stuffs'); 
INSERT INTO product_category(name) VALUES ('Pets'); 
INSERT INTO product_category(name) VALUES ('Personal care'); 
INSERT INTO product_category(name) VALUES ('Medicine'); 
INSERT INTO product_category(name) VALUES ('Cleaning stuff'); 
INSERT INTO product_category(name) VALUES ('Office supplies');