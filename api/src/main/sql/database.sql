-- ============================================
-- SCRIPT DE RÉINITIALISATION - Base gestion_mp3
-- ============================================

-- Suppression des tables dans l'ordre inverse des dépendances
DROP TABLE IF EXISTS playlist_mp3 CASCADE;
DROP TABLE IF EXISTS playlist_utilisateur CASCADE;
DROP TABLE IF EXISTS metadata CASCADE;
DROP TABLE IF EXISTS mp3 CASCADE;
DROP TABLE IF EXISTS playlist CASCADE;
DROP TABLE IF EXISTS utilisateur CASCADE;
DROP TABLE IF EXISTS album CASCADE;
DROP TABLE IF EXISTS artiste CASCADE;
DROP TABLE IF EXISTS genre CASCADE;
DROP TABLE IF EXISTS langue CASCADE;

-- ============================================
-- TABLES DE RÉFÉRENCE
-- ============================================

CREATE TABLE artiste(
   id SERIAL,
   nom VARCHAR(50) NOT NULL,
   PRIMARY KEY(id)
);

CREATE TABLE genre(
   id SERIAL,
   libelle VARCHAR(50) NOT NULL,
   PRIMARY KEY(id)
);

CREATE TABLE album(
   id SERIAL,
   libelle VARCHAR(50),
   PRIMARY KEY(id)
);

-- 🔧 Table ajoutée (référencée par Mp3.langue côté Java, absente de ton script initial)
CREATE TABLE langue(
   id SERIAL,
   libelle VARCHAR(50) NOT NULL,
   PRIMARY KEY(id)
);

-- ============================================
-- TABLE PRINCIPALE MP3
-- ============================================

CREATE TABLE mp3(
   id SERIAL,
   id_genre INTEGER NOT NULL,
   id_album INTEGER,
   id_artiste INTEGER NOT NULL,
   id_langue INTEGER,  -- 🔧 nullable, à ajuster si obligatoire
   PRIMARY KEY(id),
   FOREIGN KEY(id_genre) REFERENCES genre(id),
   FOREIGN KEY(id_album) REFERENCES album(id) ON DELETE SET NULL,  -- 🔧 un mp3 peut perdre son album sans être supprimé
   FOREIGN KEY(id_artiste) REFERENCES artiste(id),
   FOREIGN KEY(id_langue) REFERENCES langue(id)
);

CREATE TABLE mp3_fichier(
   id_mp3 INTEGER NOT NULL,
   fichier BYTEA NOT NULL,
   PRIMARY KEY(id_mp3),
   FOREIGN KEY(id_mp3) REFERENCES mp3(id) ON DELETE CASCADE
);

-- ============================================
-- METADATA (relation 1-1 stricte avec mp3)
-- ============================================

CREATE TABLE metadata(
   id SERIAL,
   titre VARCHAR(300) NOT NULL,
   annee INTEGER NOT NULL,
   duree INTEGER NOT NULL,        -- 🔧 corrigé : INTEGER (secondes) au lieu de NUMERIC(15,2), à adapter si tu veux garder les décimales
   frequence INTEGER,
   bitrate BIGINT NOT NULL,
   id_mp3 INTEGER NOT NULL UNIQUE,  -- 🔧 UNIQUE ajouté pour garantir le vrai 1-1
   PRIMARY KEY(id),
   FOREIGN KEY(id_mp3) REFERENCES mp3(id) ON DELETE CASCADE  -- 🔧 supprime la metadata si le mp3 est supprimé
);

-- ============================================
-- UTILISATEUR / PLAYLIST
-- ============================================

CREATE TABLE utilisateur(
   id SERIAL,
   nom VARCHAR(50),
   login VARCHAR(50) NOT NULL UNIQUE,  -- 🔧 UNIQUE ajouté
   mot_de_passe VARCHAR(255) NOT NULL 
   PRIMARY KEY(id)
);

CREATE TABLE playlist(
   id SERIAL,
   id_utilisateur INTEGER NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(id_utilisateur) REFERENCES utilisateur(id) ON DELETE CASCADE,
);

CREATE TABLE playlist_mp3(
   id SERIAL,
   nom VARCHAR(100) NOT NULL,
   id_mp3 INTEGER NOT NULL,
   id_playlist INTEGER NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(id_mp3) REFERENCES mp3(id) ON DELETE CASCADE,
   FOREIGN KEY(id_playlist) REFERENCES playlist(id) ON DELETE CASCADE
);

-- ============================================
-- INDEX SUR LES CLÉS ÉTRANGÈRES
-- ============================================

CREATE INDEX idx_mp3_id_artiste ON mp3(id_artiste);
CREATE INDEX idx_mp3_id_album ON mp3(id_album);
CREATE INDEX idx_mp3_id_genre ON mp3(id_genre);
CREATE INDEX idx_mp3_id_langue ON mp3(id_langue);
CREATE INDEX idx_metadata_id_mp3 ON metadata(id_mp3);
CREATE INDEX idx_playlist_mp3_id_mp3 ON playlist_mp3(id_mp3);
CREATE INDEX idx_playlist_mp3_id_playlist ON playlist_mp3(id_playlist);
CREATE INDEX idx_playlist_utilisateur_id_playlist ON playlist_utilisateur(id_playlist);
CREATE INDEX idx_playlist_utilisateur_id_utilisateur ON playlist_utilisateur(id_utilisateur);