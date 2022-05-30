# Node.js and MongoDB (NoSQL)

This section integrates MongoDB with a Node and Express app.

## Pre-populated authors collection

Created a "blog" database using the below command -

```
use blog
```

And then inserted 2 author's documents in "authors" collection -

```
db.authors.insertOne({ name: "Sagnik Chakraborty", email: "sagnik@test.com" });
db.authors.insertOne({ name: "Dan Lorenz", email: "dan.lorenz@hotmail.com" });
```
