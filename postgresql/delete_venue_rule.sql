CREATE RULE delete_venue AS 
  ON DELETE TO venues DO INSTEAD
  
  UPDATE venues
    SET active = false
    WHERE name = OLD.name;
    
  
