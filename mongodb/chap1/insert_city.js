function insertCity(
    name, population, last_census,
    famous_for, mayor_info
) 
{
    db.towns.insert({
        name:name,
        population:population,
        last_census: new Date(last_census),
        famous_for:famous_for,
        mayor:mayor_info
    });
}

insertCity("Punxstawney", 6200, '01/31/2008',
            ["phil the groundhog"], { name : "Jim Wehrle" }
          )

insertCity("Portland", 582000, '09/20/2007',
            ["beer", "food"], { name : "Sam Adams", party : "D" }
          )

