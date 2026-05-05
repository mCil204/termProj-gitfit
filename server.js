require('dotenv').config();

const express        = require('express');
const session        = require('express-session');
const pgSession      = require('connect-pg-simple')(session);
const passport       = require('passport');
const path           = require('path');
const pool           = require('./db/pool');

require('./auth/passport');

const authRoutes     = require('./routes/authRoutes');
const activityRoutes  = require('./routes/activitiesRoutes');
const exerciseRoutes  = require('./routes/exercisesRoutes');
const app  = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new pgSession({ pool, createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 1 week
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);
app.use('/', activityRoutes);
app.use('/exercises', exerciseRoutes);

app.use((req, res) => {
  res.status(404).render('404', { username: req.user?.display_name || null });
});


app.listen(PORT, () => console.log(`GitFIT running on http://localhost:${PORT}`));
