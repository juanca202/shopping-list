CREATE TABLE IF NOT EXISTS `list` (
  `id` INTEGER PRIMARY KEY,
  `name` varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS `list_item` (
  `id` INTEGER PRIMARY KEY,
  `lid` INTEGER NOT NULL,
  `pid` INTEGER NOT NULL,
  `rid` INTEGER NULL,
  `quantity` INTEGER NOT NULL,
  `unit` INTEGER NOT NULL
);

CREATE UNIQUE INDEX list_idx ON list(name);
CREATE UNIQUE INDEX list_item_idx ON list_item(lid, pid);
INSERT INTO list(name) VALUES ('My shopping list'); 