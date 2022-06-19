const path = require('path');

const express = require('express');

const authRoutes = require('./routes/auth.routes');

// Create Express app
const app = express();

// Make Express aware we will use EJS view template & engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(authRoutes);

app.listen(3000, () => {
  console.log(`App started successfully at port 3000...`);
});
