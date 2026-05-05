const express = require('express');
const pool    = require('../db/pool');
const router  = express.Router();

// kcal estimation
const MET = {
  run:      8,
  weight:   5,
  tennis:   7,
  cycling:  6,
  swimming: 7,
  custom:   4,
};

function estimateKcal(type, durationMins) {
  const met = MET[type] || 4;
  return Math.round(met * 70 * (durationMins / 60));
}

function requireAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    return res.redirect("/auth/login");
  }
  next();
}

router.get('/', requireAuth, async (req, res) => {
  try {
    const { rows: recent } = await pool.query(
      `SELECT * FROM activities
       WHERE user_id = $1
       ORDER BY date DESC, created_at DESC
       LIMIT 5`,
      [req.user.id]
    );
    const { rows: stats } = await pool.query(
      `SELECT
         COUNT(*)            AS total_workouts,
         COALESCE(SUM(kcal), 0)     AS total_kcal,
         COALESCE(SUM(duration), 0) AS total_mins
       FROM activities WHERE user_id = $1`,
      [req.user.id]
    );
    res.render('home', {
      username: req.user.display_name,
      recent,
      stats: stats[0],
      tab: 'home',
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


router.get('/workouts', requireAuth, (req, res) => {
  res.render('workouts', {
    username: req.user.display_name,
    tab: 'workouts',
  });
});

router.get('/activities', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM activities
       WHERE user_id = $1
       ORDER BY date DESC, created_at DESC`,
      [req.user.id]
    );
    res.render('activities', {
      username: req.user.display_name,
      activities: rows,
      tab: 'activities',
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/activities/new', requireAuth, (req, res) => {
  const prefillType = req.query.type || '';
  res.render('activity-form', {
    username: req.user.display_name,
    activity: null,   // null = new
    prefillType,
    error: null,
    tab: 'workouts',
  });
});

router.post('/activities', requireAuth, async (req, res) => {
  const { type, label, date, duration, notes } = req.body;
  if (!type || !date || !duration) {
    return res.render('activity-form', {
      username: req.user.display_name,
      activity: null,
      prefillType: type,
      error: 'Type, date, and duration are required.',
      tab: 'workouts',
    });
  }
  try {
    const kcal = estimateKcal(type, parseInt(duration));
    await pool.query(
      `INSERT INTO activities (user_id, type, label, date, duration, kcal, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [req.user.id, type, label, date, parseInt(duration), kcal, notes || '']
    );
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('activity-form', {
      username: req.user.display_name,
      activity: null,
      prefillType: type,
      error: 'Something went wrong. Try again.',
      tab: 'workouts',
    });
  }
});


router.get('/activities/:id/edit', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM activities WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (!rows[0]) return res.redirect('/activities');
    res.render('activity-form', {
      username: req.user.display_name,
      activity: rows[0],
      prefillType: rows[0].type,
      error: null,
      tab: 'activities',
    });
  } catch (err) {
    console.error(err);
    res.redirect('/activities');
  }
});


router.post('/activities/:id/edit', requireAuth, async (req, res) => {
  const { type, label, date, duration, notes } = req.body;
  try {
    const kcal = estimateKcal(type, parseInt(duration));
    await pool.query(
      `UPDATE activities
       SET type=$1, label=$2, date=$3, duration=$4, kcal=$5, notes=$6
       WHERE id=$7 AND user_id=$8`,
      [type, label, date, parseInt(duration), kcal, notes || '', req.params.id, req.user.id]
    );
    res.redirect('/activities');
  } catch (err) {
    console.error(err);
    res.redirect('/activities');
  }
});


router.post('/activities/:id/delete', requireAuth, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM activities WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.redirect('/activities');
  } catch (err) {
    console.error(err);
    res.redirect('/activities');
  }
});

module.exports = router;
