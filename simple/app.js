const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

// load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// passport config
require('./config/passport')(passport);

//map global promise -get rid of warning
mongoose.Promise = global.Promise;
//conect to mongoose
mongoose.connect('mongodb://bodya.flesh:123123@ds055872.mlab.com:55872/vidjot-prod', {
  useMongoClient: true
})
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log(err));

//handlebars Middleware
app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'hbs');

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// method override middleware
app.use(methodOverride('_method'));

// express session midleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// global variable
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

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

// use routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on post ${port}`);
});