const express = require('express');
const router = express.Router()


const { create, find, read, update, remove, cardatabyunittypeandunitid,cardatabycarnumber,cardatabyunittypeandunitid_mushbat,cardatabyunittypeandunitidandcartypeandcarid } = require("../../controllers/general/cardata")

router.post('/cardata', create);

router.get('/cardata', find);

router.get('/cardata/:id', read);

router.put('/cardata/:cardataId', update)

router.post('/cardata/remove/:id', remove);

//

router.get('/cardata/cardatabyunittypeandunitid/:unittype/:unitid', cardatabyunittypeandunitid);

router.get('/cardata/cardatabycarnumber/:carnumber', cardatabycarnumber);

router.get('/cardata/cardatabyunittypeandunitid_mushbat/:unittype/:unitid', cardatabyunittypeandunitid_mushbat);

//

router.get('/cardata/cardatabyunittypeandunitidandcartypeandcarid/:unittype/:unitid/:cartype/:carid', cardatabyunittypeandunitidandcartypeandcarid);

module.exports = router