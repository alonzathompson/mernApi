const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const hb = require('express-handlebars');

//config
const db = require('./config/db');
const port = require('./config/port');
const app = express();
const cors = require('cors');

//db connection
mongoose.Promise = global.Promise;
mongoose.connect(db.url, {
  useMongoClient: true
}, (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log(`
    =========================================
    DB CONNECTED: ${db.url}
    =========================================`
  );
});


app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hb({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

//middleware
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(session({
  secret: 'thotsonpotsthatdrop',
  resave: false,
  saveUninitialized: false,
  //cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use('/users', require('./routes/users'));
app.use('/admin', require('./routes/admin'));
app.use('/products', require('./routes/products'));

app.get('/', (req, res) =>{
  console.log(req.headers);
  res.render('./partials/home');
})

//start server
app.listen(port, () => {
  console.log(`
    ========================================
    server listening on port ${port.port}
    ========================================
     `);
})
