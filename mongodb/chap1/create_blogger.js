// Create a database named blogger with a collection articles
// then insert a new article with an author name and email, creation date, and text

db.articles.insert({
    author : "Jacob Jewell",
    email  : "jakesjews@gmail.com",
    creation_date : ISODate("2012-02-07"),
    text : "This is an article"
})
