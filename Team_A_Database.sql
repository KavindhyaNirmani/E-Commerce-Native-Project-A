-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: e_com_team_a
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(45) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Pizza'),(2,'Cake'),(3,'Beverage');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `item_name` varchar(45) NOT NULL,
  `item_price` decimal(10,2) NOT NULL,
  `item_description` varchar(255) NOT NULL,
  `item_image` varchar(255) DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  KEY `fk_category` (`category_id`),
  CONSTRAINT `fk_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (5,'Margherita',9.99,'Classic pizza with mozzarella and tomato sauce','C:\\Users\\Devini\\Pictures\\codepark\\pizza-image.jpg',1),(6,'Hot & Spicy',10.20,'Classic pizza with mozzarella and tomato sauce',NULL,1),(7,'Cheesy Chicken',15.20,'Classic pizza with mozzarella and tomato sauce',NULL,1),(8,'Chicken pizza',10.90,'Classic pizza with mozzarella and tomato sauce','/images/pizza-image.jpg',1),(9,'Cheezy pizza',20.99,'Classic pizza with mozzarella and tomato sauce','pizza-image.jpg',1),(10,'Chocolate Gnash Cake',5.25,'Classic pizza with mozzarella and tomato sauce','cake.jpg',2),(11,'Lemon Lime Fizz',2.00,'Classic pizza with mozzarella and tomato sauce','beverage.jpg',3),(12,'Egg $ Spicy',30.00,'Classic pizza with mozzarella and tomato sauce','pizza1.jpg',1),(13,'Pepperoni Pizza',15.99,'A delicious pepperoni pizza with extra cheese','http://example.com/images/pepperoni_pizza.jpg',1),(14,'Pepperoni Spicy Pizza',15.99,'A delicious pepperoni pizza with extra cheese','http://example.com/images/pepperoni_pizza.jpg',1),(15,'Chocolate Cake',20.99,'Delicious and moist chocolate cake','chocolate_cake.jpg',2);
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'devinimadumali@gmail.com','devinimadumali','$2b$10$tcmMWa14kNPjbf93nOFjpOmLTkFxxI3a0971zsJfkdgeLy4Ghb206','user'),(2,'devinimadumali@gmail.com','devinimadumali','$2b$10$.Hu1Fug1OW.0.1xOWMPy..8i9.bJsljx2yiF4VO8zszi1ebzMSvUa','user'),(3,'devinimadumali@gmail.com','devinimadumali','$2b$10$xEMTDQ8SbacCtgR3XTyDxOkvGpZfHU97N83tqlaY66Gm/DuClaiIO','user'),(4,'gdmmunasinghe@std.appsc.sab.ac.lk','gdmmunasinghe','$2b$10$.tn/gN1xgddp9V/12wg7NeimM3WzRBjCUhI6EahTEZOFTxPbEDciG','user'),(5,'devinimadumali@gmail.com','devinimadumali','$2b$10$PUwD5o//b8DGlNqpI8tYheAqMbdUecQE4cLxLpkYMswYB58cxxKwq','user'),(6,'johndoe@example.com','John Doe','$2b$08$1tKNMdJLWAWKnrXcO5ZdS.VyK5fG0syac1sgrNpysOTDvHeNXnAcC','user'),(7,'admin@example.com','Admin User','$2a$12$.qJMAkz.obif7hLpwOVhxeuQYsioSzEHj677TGkVaepVYOzGfobSm','admin'),(8,'user1@gmail.com','User1','$2b$08$jwSd3L3vkZ7EDFKUa.kkRuN3N4DQ8EoYxDeeqQl8OXJHPe93eMqsO','user'),(9,'user2@gmail.com','User2','$2b$08$hM7/EYhmaBsw9f34ANdxY.9zhE719Ue7gul.dN1H2dziJ48/.Lnq2','user');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-19  8:58:11
