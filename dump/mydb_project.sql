-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mydb
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
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Project_userId_fkey` (`userId`),
  CONSTRAINT `Project_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES (3,'Object-based regional encoding','Asperiores benevolentia aureus virtus caritas.',2),(4,'Versatile bandwidth-monitored success','Crinis ocer considero vita optio.',2),(5,'Expanded dedicated framework','Suscipio labore agnitio canto vulgus trucido neque amplitudo.',2),(6,'Public-key 5th generation contingency','Ter bene tristis.',3),(7,'Managed maximized superstructure','Demum collum inflammatio voluptates vorax censura.',3),(8,'Down-sized disintermediate support','Spoliatio cupressus vulpes spectaculum calculus cubitum cogito adstringo audeo.',3),(9,'Quality-focused actuating task-force','Venia dolores arma bene cogito tantillus aufero animus speciosus tempus.',3),(10,'Proactive web-enabled adapter','Conspergo atqui talis causa creta.',4),(11,'User-friendly demand-driven orchestration','Tum debeo cuius.',4),(12,'Sharable clear-thinking collaboration','Repellendus animadverto civis acerbitas certe subito cubicularis.',4),(13,'Operative 3rd generation alliance','Vulnus adsum corona.',4),(14,'Front-line asymmetric hub','Absque creber adstringo argumentum quia.',4),(15,'Reverse-engineered tertiary forecast','Cupressus adsum thymum quisquam beatae.',5),(16,'Expanded tertiary capability','Armarium thymbra adinventitias copia vulgus.',5),(17,'Compatible optimizing encoding','Surgo tunc copiose labore clementia beatus curia.',5),(18,'Quality-focused bottom-line model','Dens crapula paulatim callide utique arbustum aveho enim virgo taedium.',6),(19,'Seamless exuding neural-net','Ab claro umerus defleo tendo spoliatio consequatur amoveo casus numquam.',6),(20,'Operative regional interface','Cubo ducimus civitas.',6),(21,'Enhanced heuristic approach','Ascit aliqua quas saepe spero.',7),(22,'Open-source bandwidth-monitored attitude','Conventus considero aestas.',7),(23,'Synchronised needs-based parallelism','Tutamen eaque defluo amet coniuratio cognatus subvenio.',7);
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-15 21:22:31
