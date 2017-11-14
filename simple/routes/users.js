const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// user login router
router.get('/login', (req, res) => {
  res.render('users/login');
});

// user register router
router.get('/register', (req, res) => {
  res.render('users/register');
});

module.exports = router;