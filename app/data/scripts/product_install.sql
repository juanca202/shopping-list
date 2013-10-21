CREATE TABLE IF NOT EXISTS `product` (
  `id` INTEGER PRIMARY KEY,
  `cid` INTEGER NOT NULL,
  `code` varchar(80) NULL,
  `name` varchar(255) NOT NULL,
  `unit` varchar(80) NOT NULL,
  `price` float(9,2) NULL,
  `picture` varchar(255) NULL
);

CREATE TABLE IF NOT EXISTS `product_category` (
  `id` INTEGER PRIMARY KEY,
  `name` varchar(80) NOT NULL
);