-- "Please don't change anything in the data if you change it's not going to work with you."

DROP DATABASE IF EXISTS `system_bot`;
CREATE DATABASE IF NOT EXISTS `system_bot`;
USE `system_bot`;

DROP TABLE IF EXISTS `autoreply`;
CREATE TABLE IF NOT EXISTS `autoreply` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message` varchar(255) DEFAULT NULL,
  `reply` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `private_messages`;
CREATE TABLE IF NOT EXISTS `private_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message_to` varchar(255) DEFAULT NULL,
  `mid` varchar(255) DEFAULT NULL,
  `message_id` varchar(255) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `private_rooms`;
CREATE TABLE IF NOT EXISTS `private_rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) DEFAULT NULL,
  `voice_room_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `protection`;
CREATE TABLE IF NOT EXISTS `protection` (
  `antiword_words` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[]',
  `antispam` int(11) DEFAULT NULL,
  `antimention` int(11) DEFAULT NULL,
  `pro_channels` int(11) DEFAULT NULL,
  `pro_roles` int(11) DEFAULT NULL,
  `server_privacy` varchar(255) DEFAULT 'public'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `protection` (`antiword_words`, `antispam`, `antimention`, `pro_channels`, `pro_roles`, `server_privacy`) VALUES
	('[]', 0, 1, 0, 0, 'public');

DROP TABLE IF EXISTS `sounds`;
CREATE TABLE IF NOT EXISTS `sounds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(255) DEFAULT NULL,
  `sid` varchar(255) DEFAULT NULL,
  `messageid` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `thumbnails` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `tickets`;
CREATE TABLE IF NOT EXISTS `tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `owner_id` varchar(255) DEFAULT NULL,
  `channel_id` varchar(255) DEFAULT NULL,
  `close_message_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `tickets_settings`;
CREATE TABLE IF NOT EXISTS `tickets_settings` (
  `channel_id` varchar(255) DEFAULT NULL,
  `message_id` varchar(255) DEFAULT NULL,
  `category_id` varchar(255) DEFAULT NULL,
  `role_id` varchar(255) DEFAULT NULL,
  `counts` int(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `tickets_settings` (`channel_id`, `message_id`, `category_id`, `role_id`, `counts`) VALUES
	(NULL, NULL, NULL, NULL, 0);