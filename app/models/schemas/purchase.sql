CREATE TABLE IF NOT EXISTS `purchase` (
	`id` INTEGER PRIMARY KEY,
	`lid` int(11) NOT NULL,
	`vid` int(11) NOT NULL,
	`venue_platform` varchar(50) NOT NULL,
	`lat` varchar(50) NOT NULL,
	`lng` varchar(50) NOT NULL,
	`currency` varchar(3) NOT NULL,
	`timestamp` int(11) NOT NULL
);

CREATE TABLE IF NOT EXISTS `purchase_item` (
  `id` INTEGER PRIMARY KEY,
  `puid` INTEGER NOT NULL,
  `pid` INTEGER NOT NULL,
  `price` float(11,2) NULL,
  `quantity` INTEGER NULL,
  `unit` varchar(20) NULL
);