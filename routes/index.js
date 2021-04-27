const express = require('express');
const actions = require('../methods/actions');
const router = express.Router();

router.get('/', (req, res) => res.redirect('/dashboard'))

router.get('/dashboard', (req, res) => res.send('dashboard'))

router.post('/adduser', actions.addNew)

router.post('/authenticate', actions.authenticate)

router.get('/getinfo', actions.getInfo)

module.exports = router