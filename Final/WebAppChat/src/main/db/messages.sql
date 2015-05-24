CREATE TABLE `messages` (
    `id` VARCHAR(15) NOT NULL,
    `author` VARCHAR(255) NOT NULL,
    `text` text NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=INNODB CHARACTER SET utf8 COLLATE utf8_general_ci