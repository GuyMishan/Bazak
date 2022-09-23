const express = require('express');
const router = express.Router()


const { create, find, read, update, remove, ramambyunitid } = require("../../controllers/ramam/ramam")

router.post('/ramam', create);

router.get('/ramam', find);

router.get('/ramam/:id', read);

router.put('/ramam/:ramamId', update)

router.post('/ramam/remove/:id', remove);

//

router.get('/ramam/ramambyunitid/:unitid', ramambyunitid);

module.exports = router