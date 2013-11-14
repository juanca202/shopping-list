CREATE TABLE IF NOT EXISTS `recipe` (
  `id` int(11) NOT NULL,
  `name` float(9,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS `recipe_item` (
  `id` INTEGER PRIMARY KEY,
  `pid` INTEGER NOT NULL,
  `rid` INTEGER NOT NULL,
  `quantity` INTEGER NOT NULL,
  `unit` INTEGER NOT NULL
);

CREATE UNIQUE INDEX recipe_idx ON recipe(name);
CREATE UNIQUE INDEX recipe_item_idx ON recipe_item(pid, rid);