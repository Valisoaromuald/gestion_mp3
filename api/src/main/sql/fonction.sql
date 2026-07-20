CREATE OR REPLACE FUNCTION rechercher_mp3(
    idsArtistes INTEGER[],
    idsLangues INTEGER[],
    idsGenres INTEGER[]
)
RETURNS SETOF mp3 AS $$
    SELECT *
    FROM mp3
    WHERE (idsArtistes IS NULL OR array_length(idsArtistes, 1) IS NULL OR id_artiste = ANY(idsArtistes))
      AND (idsLangues IS NULL OR array_length(idsLangues, 1) IS NULL OR id_langue = ANY(idsLangues))
      AND (idsGenres IS NULL OR array_length(idsGenres, 1) IS NULL OR id_genre = ANY(idsGenres));
$$ LANGUAGE SQL;


CREATE OR REPLACE FUNCTION generer_playlist(
    dureeTotale INTEGER,
    idsArtistes INTEGER[],
    idsLangues INTEGER[],
    idsGenres INTEGER[]
)
RETURNS TABLE(
    id INTEGER,
    nom_artiste VARCHAR,
    libelle_genre VARCHAR,
    libelle_langue VARCHAR,
    duree BIGINT,
    titre VARCHAR
) AS $$
DECLARE
    mp3_courant RECORD;
    duree_cumulee INTEGER := 0;
BEGIN
    FOR mp3_courant IN
    SELECT
        m.id,
        meta.duree,
        meta.titre,
        a.nom AS nom_artiste,
        g.libelle AS libelle_genre,
        l.libelle AS libelle_langue
    FROM rechercher_mp3(idsArtistes, idsLangues, idsGenres) m
    JOIN metadata meta ON meta.id_mp3 = m.id
    JOIN artiste a ON a.id = m.id_artiste
    JOIN genre g ON g.id = m.id_genre
    JOIN langue l ON l.id = m.id_langue
    ORDER BY m.id ASC
    LOOP
        EXIT WHEN duree_cumulee + mp3_courant.duree > dureeTotale;

        duree_cumulee := duree_cumulee + mp3_courant.duree;

        RETURN QUERY SELECT
            mp3_courant.id,
            mp3_courant.nom_artiste,
            mp3_courant.libelle_genre,
            mp3_courant.libelle_langue,
            mp3_courant.duree,
            mp3_courant.titre;
    END LOOP;
    RETURN;
END;
$$ LANGUAGE plpgsql;