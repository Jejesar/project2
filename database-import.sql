-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : db
-- Généré le : jeu. 18 mai 2023 à 16:27
-- Version du serveur : 5.7.42
-- Version de PHP : 8.1.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `project2`
--

-- --------------------------------------------------------

--
-- Structure de la table `currentSequence`
--

CREATE TABLE `currentSequence` (
  `idSequence` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `currentSequence`
--

INSERT INTO `currentSequence` (`idSequence`) VALUES
(NULL);

-- --------------------------------------------------------

--
-- Structure de la table `listSequences`
--

CREATE TABLE `listSequences` (
  `idSequence` int(10) UNSIGNED NOT NULL,
  `createdTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(64) DEFAULT NULL,
  `comment` varchar(128) DEFAULT NULL,
  `measure0` int(11) NOT NULL DEFAULT '0',
  `measure1` int(11) NOT NULL DEFAULT '0',
  `measure2` int(11) NOT NULL DEFAULT '0',
  `measure3` int(11) NOT NULL DEFAULT '0',
  `measure4` int(11) NOT NULL DEFAULT '0',
  `measure5` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `measures`
--

CREATE TABLE `measures` (
  `idMeasure` int(11) UNSIGNED NOT NULL,
  `idSequence` int(10) UNSIGNED DEFAULT NULL,
  `typeOf` varchar(64) NOT NULL COMMENT '0cm, 2cm, 4cm, 6cm',
  `createdTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `currentSequence`
--
ALTER TABLE `currentSequence`
  ADD KEY `idSequence` (`idSequence`);

--
-- Index pour la table `listSequences`
--
ALTER TABLE `listSequences`
  ADD PRIMARY KEY (`idSequence`);

--
-- Index pour la table `measures`
--
ALTER TABLE `measures`
  ADD PRIMARY KEY (`idMeasure`),
  ADD KEY `idSequenceMeasure` (`idSequence`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `listSequences`
--
ALTER TABLE `listSequences`
  MODIFY `idSequence` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `measures`
--
ALTER TABLE `measures`
  MODIFY `idMeasure` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `currentSequence`
--
ALTER TABLE `currentSequence`
  ADD CONSTRAINT `idSequence` FOREIGN KEY (`idSequence`) REFERENCES `listSequences` (`idSequence`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `measures`
--
ALTER TABLE `measures`
  ADD CONSTRAINT `idSequenceMeasure` FOREIGN KEY (`idSequence`) REFERENCES `listSequences` (`idSequence`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
