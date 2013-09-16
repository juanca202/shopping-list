CREATE TABLE IF NOT EXISTS `list` (
  `id` int(11) PRIMARY KEY,
  `name` int(11) NOT NULL
);

CREATE TABLE IF NOT EXISTS `list_item` (
  `id` int(11) PRIMARY KEY,
  `lid` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
);