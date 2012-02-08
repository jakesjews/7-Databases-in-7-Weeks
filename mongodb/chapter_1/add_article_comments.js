// Update an article with an array of comments containing an author and text

db.articles.update(
    { "author" : "Jacob Jewell" },
    { $set : { "comments", { "author" : "A Guy", "text" : "First" } } }
)
