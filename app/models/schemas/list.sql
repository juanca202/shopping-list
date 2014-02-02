CREATE TABLE IF NOT EXISTS `list` (
  `id` INTEGER PRIMARY KEY,
  `name` varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS `list_item` (
  `id` INTEGER PRIMARY KEY,
  `lid` INTEGER NOT NULL,
  `pid` INTEGER NOT NULL,
  `rid` INTEGER NULL,
  `price` float(11,2) NULL,
  `quantity` INTEGER NULL,
  `unit` varchar(20) NULL,
  `note` varchar(160) NULL,
  `checked` varchar(5) NULL
);

-- CREATE UNIQUE INDEX list_idx ON list(name);
CREATE UNIQUE INDEX list_item_idx ON list_item(lid, pid);
INSERT INTO list(id, name) VALUES (1, 'Shopping cart');