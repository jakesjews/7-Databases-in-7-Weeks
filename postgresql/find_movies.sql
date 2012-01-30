CREATE OR REPLACE FUNCTION find_movies( search text ) 
RETURNS TABLE(movie text) AS $$ 

DECLARE
  actor_best float;
  movie_best float;

BEGIN

  SELECT 
    ts_rank(to_tsvector(search), query) INTO movie_best
  FROM 
    movies, 
    to_tsquery('english', search ) AS query
  WHERE 
    title @@ search 
  LIMIT 1;
  
  SELECT 
    ts_rank(to_tsvector(search), query) INTO actor_best
  FROM 
    actors, 
    to_tsquery('english', search ) AS query
  WHERE 
    name @@ search 
  LIMIT 1;

  IF coalesce( movie_best, 0.0) > coalesce( actor_best, 0.0) THEN
    
    RETURN QUERY 
      SELECT 
        m.title
      FROM 
        movies AS m,
        ( SELECT genre, title
          FROM movies
          WHERE to_tsvector(title) @@ to_tsquery( 'english', search )
        ) AS s
      WHERE 
        cube_enlarge( s.genre, 5, 18) @> m.genre
        AND
        s.title <> m.title
      ORDER BY
        cube_distance( m.genre, s.genre )
      LIMIT 5;

  ELSE

    RETURN QUERY 
      SELECT 
        title
      FROM
        movies AS m
      NATURAL JOIN movies_actors AS ma
      NATURAL JOIN actors AS a
      WHERE
        a.name @@ search
      LIMIT 5;

  END IF;
END;

$$ LANGUAGE plpgsql;
