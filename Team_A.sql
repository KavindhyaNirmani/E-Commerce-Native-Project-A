-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: foodorder
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
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `added_at` datetime DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`cart_id`),
  KEY `fk_CART_USER1_idx` (`user_id`),
  CONSTRAINT `fk_CART_USER1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `fk_user_id_new` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `cart_item_id` int NOT NULL AUTO_INCREMENT,
  `quantity` int DEFAULT NULL,
  `item_price` decimal(10,0) DEFAULT NULL,
  `item_id` int NOT NULL,
  `cart_id` int NOT NULL,
  PRIMARY KEY (`cart_item_id`),
  KEY `fk_CART_ITEMS_ITEM1_idx` (`item_id`),
  KEY `fk_CART_ITEMS_CART1_idx` (`cart_id`),
  CONSTRAINT `fk_CART_ITEMS_CART1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`),
  CONSTRAINT `fk_CART_ITEMS_ITEM1` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Pizza'),(2,'Cake'),(3,'Beverage');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `item_name` varchar(45) DEFAULT NULL,
  `item_description` varchar(225) DEFAULT NULL,
  `item_price` decimal(10,2) DEFAULT NULL,
  `item_image` varchar(255) DEFAULT NULL,
  `category_id` int NOT NULL,
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`item_id`),
  KEY `fk_ITEM_CATEGORY_idx` (`category_id`),
  CONSTRAINT `fk_ITEM_CATEGORY` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` VALUES (1,'Cheesy Garlic Pizza','Loaded with garlic and cheese, perfect cheesy indulgence',1690.00,'pizza1.jpg',1,0),(2,'Caribbean Pizza','Tropical flavors blend with savory toppings, a true Caribbean delight',1300.00,'pizza2.jpg',1,0),(3,'Margherita Pizza','Classic tomato, mozzarella, and basil for a fresh, authentic taste',1200.00,'pizza3.jpg',1,0),(4,'Cheesy Lovers Pizza','Extra cheese on every bite, for serious cheese lovers',1450.00,'pizza4.jpg',1,0),(5,'Veggie Lovers Pizza','Fresh vegetables on a crispy crust, a healthy pizza treat',1100.00,'pizza5.jpg',1,0),(6,'Chicken Naimiris Pizza','Spicy chicken with herbs, a flavorful feast for spice fans',1999.00,'pizza6.jpg',1,0),(7,'Curry Pork Pizza','Juicy pork with rich curry flavors on a crispy crust',2110.00,'pizza7.jpg',1,0),(8,'Pani Bacon Pizza','Bacon and spicy flavors combine in this savory, indulgent pizza',2399.00,'pizza8.jpg',1,0),(9,'Chocolate Fudge Cake','Rich, decadent chocolate cake layered with silky fudge frosting',1800.00,'cake1.jpg',2,0),(10,'Red Velvet Cake','velvety cake with a hint of cocoa and cream cheese frosting',2000.00,'cake2.jpg',2,0),(11,'Lemon Drizzle Cake','Zesty lemon sponge soaked in tangy syrup with a light glaze',1600.00,'cake3.jpg',2,0),(12,'Black Forest Cake','Chocolate sponge cake layered with whipped cream and cherries,',2200.00,'cake4.jpg',2,0),(13,'Vanilla Buttercream Cake','Classic vanilla sponge cake filled with creamy buttercream',1500.00,'cake5.jpg',2,0),(14,'Strawberry Shortcake','Fluffy vanilla cake layered with fresh strawberries and whipped cream',1700.00,'cake6.jpg',2,0),(15,'Tiramisu Cake','Coffee-infused sponge cake with layers of mascarpone cream',2300.00,'cake7.jpg',2,0),(16,'Carrot Walnut Cake','Moist carrot cake with crunchy walnuts, topped with cream cheese',1980.00,'cake8.jpg',2,0),(17,'Iced Caramel Latte','Refreshing espresso with milk and sweet caramel, served over ice',450.00,'bev1.jpg',3,0),(18,'Mango Smoothie','Creamy blend of fresh mangoes, yogurt, and a touch of honey',500.00,'bev2.jpg',3,0),(19,'Fresh Lime Soda','Sparkling soda with freshly squeezed lime, the perfect thirst quencher',260.00,'bev3.jpg',3,0),(20,'Chocolate Milkshake','Thick, creamy milkshake made with rich chocolate ice cream ',460.00,'bev4.jpg',3,0),(21,'Green Tea Iced Cooler','Light and refreshing green tea with a hint of mint, served chilled',620.00,'bev5.jpg',3,0),(22,'Strawberry Lemonade','Tangy lemonade with a burst of fresh strawberry flavor, chilled to perfection',440.00,'bev6.jpg',3,0),(23,'Espresso Martini','Bold espresso shaken with vodka and coffee liqueur for a delightful kick',600.00,'bev7.jpg',3,0),(24,'Virgin Mojito','A refreshing blend of lime, mint, and soda, a non-alcoholic favorite',380.00,'bev8.jpg',3,0);
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `order_date` datetime DEFAULT NULL,
  `total_amount` decimal(10,0) DEFAULT NULL,
  `order_status` enum('Pending','Successfull','Failed') DEFAULT 'Pending',
  `cart_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `fk_ORDER_CART1_idx` (`cart_id`,`user_id`),
  CONSTRAINT `fk_ORDER_CART1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `order_detail_id` int NOT NULL AUTO_INCREMENT,
  `address` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `postal_code` varchar(45) DEFAULT NULL,
  `order_id` int NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`order_detail_id`),
  KEY `fk_ORDER_DETAILS_ORDER1_idx` (`order_id`),
  CONSTRAINT `fk_ORDER_DETAILS_ORDER1` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `quantity` int DEFAULT NULL,
  `item_price` decimal(10,0) DEFAULT NULL,
  `ORDER_ITEMScol` varchar(45) DEFAULT NULL,
  `item_id` int NOT NULL,
  `order_id` int NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `fk_ORDER_ITEMS_ITEM1_idx` (`item_id`),
  KEY `fk_ORDER_ITEMS_ORDER1_idx` (`order_id`),
  CONSTRAINT `fk_ORDER_ITEMS_ITEM1` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`),
  CONSTRAINT `fk_ORDER_ITEMS_ORDER1` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `PAYMENT_id` int NOT NULL AUTO_INCREMENT,
  `amount_paid` decimal(10,0) DEFAULT NULL,
  `payment_date` datetime DEFAULT NULL,
  `payment_status` enum('Pending','Successfull','Failed') DEFAULT NULL,
  `order_id` int NOT NULL,
  PRIMARY KEY (`PAYMENT_id`),
  KEY `fk_PAYMENT_ORDER1_idx` (`order_id`),
  CONSTRAINT `fk_PAYMENT_ORDER1` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('Admin','Customer') DEFAULT 'Customer',
  `user_image` varchar(255) DEFAULT NULL,
  `phone_no` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `password_UNIQUE` (`password`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'devini1999','Devini@9911','$2y$10$XFLjH87LdoE4s1bhAD7GJea9gBlrhJ0FYKaDAwYw9B3rs13ZUXRsi','Admin',NULL,NULL,NULL,NULL,NULL,0),(2,'NipuPrabodi','Nipuni#2024','$2y$10$AWolf0gPmP.1P9amXMzlH.Wews4keSk1PqjNiI93pBlCWcSPbrb9i','Admin',NULL,NULL,NULL,NULL,NULL,0),(3,'JayaniKodithuwakku','Jayan9900&','$2y$10$bUUS/HDhrHgDYl7TrBtG/./QU/UBaG6fo7AHe7hNna7bAacMCFWaa','Admin',NULL,NULL,NULL,NULL,NULL,0);
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

-- Dump completed on 2024-10-09 14:47:12
