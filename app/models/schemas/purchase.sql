CREATE TABLE IF NOT EXISTS `purchase` (
	`id` INTEGER PRIMARY KEY,
	`lid` int(11) NOT NULL,
	`vid` int(11) NULL,
	`venue_platform` varchar(50) NULL,
	`lat` varchar(50) NULL,
	`lng` varchar(50) NULL,
	`currency` varchar(3) NOT NULL,
	`total` float(11,2) NOT NULL,
	`timestamp` int(11) NOT NULL
);

CREATE TABLE IF NOT EXISTS `purchase_item` (
  `id` INTEGER PRIMARY KEY,
  `puid` INTEGER NOT NULL,
  `pid` INTEGER NOT NULL,
  `cid` INTEGER NULL,
  `price` float(11,2) NULL,
  `quantity` INTEGER NULL,
  `unit` varchar(20) NULL
);