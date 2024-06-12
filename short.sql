DROP TABLE IF EXISTS links;
CREATE TABLE IF NOT EXISTS links (
  `id` integer PRIMARY KEY NOT NULL,
  `url` text,
  `suffix` text,
  `ua` text,
  `ip` text,
  `status` int,
  `create_time` DATE
);
DROP TABLE IF EXISTS logs;
CREATE TABLE IF NOT EXISTS logs (
  `id` integer PRIMARY KEY NOT NULL,
  `url` string,
  `kid` string,
  `src` string,
  `act` string,
  `suffix` string,
  `referer` string,
  `ua` text ,
  `ip` string,
  `ip_location` string,
  `create_time` DATE
);


