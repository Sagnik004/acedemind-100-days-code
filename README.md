# Section-24: Using MySQL in NodeJS and Express websites

This section integrates MySQL DB with a NodeJS and Express app.

## Planning the database structure

- Posts
  - id (INT)
  - title (VARCHAR)
  - summary (VARCHAR)
  - body (TEXT)
  - date (DATETIME)
  - author_id (INT)
- Authors
  - id (INT)
  - name (VARCHAR)
  - email (VARCHAR)

Creating the database schema

```sh
    CREATE SCHEMA `blog` ;
```

Creating the tables

```sh
    CREATE TABLE blog.authors (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        PRIMARY KEY (id));
```

```sh
    CREATE TABLE blog.posts (
        id INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        summary VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        date DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        author_id INT NOT NULL,
        PRIMARY KEY (id));
```
