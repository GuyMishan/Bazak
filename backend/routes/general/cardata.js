const express = require('express');
const router = express.Router()


const { create, find, read, update, remove, cardatabyunittypeandunitid } = require("../../controllers/general/cardata")

router.post('/cardata', create);

router.get('/cardata', find);

router.get('/cardata/:id', read);

router.put('/cardata/:cardataId', update)

router.post('/cardata/remove/:id', remove);

//

router.get('/cardata/cardatabyunittypeandunitid/:unittype/:unitid', cardatabyunittypeandunitid);

module.exports = router