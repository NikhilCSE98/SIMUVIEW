const express = require('express');
const { saveFeedback } = require('../Controller/interviewController.js');

const router = express.Router();

router.post('/save-feedback', saveFeedback);

module.exports = router;

