const express     = require('express');
const exerciseDB  = require('../db/exerciseDB');
const router      = express.Router();

function requireAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/auth/login');
  }
  next();
}

router.get('/search', requireAuth, async (req, res) => {
  const query = req.query.q || '';
  if (query.length < 2) return res.json([]);
  try {
    const results = await exerciseDB.searchExercises(query, 8);
    const simplified = results.map(ex => ({
      id:        ex.id,
      name:      ex.name,
      bodyPart:  ex.bodyPart,
      equipment: ex.equipment,
      target:    ex.target,
    }));
    res.json(simplified);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ExerciseDB search failed' });
  }
});

module.exports = router;
