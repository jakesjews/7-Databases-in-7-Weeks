// Finds all cities famous for food and beer whose names contain e

db.towns.find(
    { $or : [ { famous_for: "food" }, { famous_for: "beer" } ], name:/e/ }
)
