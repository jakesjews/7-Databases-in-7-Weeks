SELECT * FROM crosstab(
  'SELECT 
    extract( year FROM starts ) AS year,
    extract( month FROM starts ) AS month,
    count(*)
  FROM events
  GROUP BY year, month',
  'SELECT * from generate_series(1,12)'
) AS ( 
  year int, jan int, feb int, mar int, apr int,
  may  int, jun int, jul int, aug int, sep int,
  oct  int, nov int, dec int)
ORDER BY year;
