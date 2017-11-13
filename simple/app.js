const express = require('express');
const app = express();
const exphbs = require('express-handlebars');

//handlebars Middleware
app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'hbs');

//index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title
  });
});

//about route
app.get('/about', (req, res) => {
  res.render('about');
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on post ${port}`);
});