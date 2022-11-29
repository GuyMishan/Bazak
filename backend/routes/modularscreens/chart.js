const express = require('express');
const router = express.Router()


const { create, find, read, update, remove, chartsbyscreenid, chartbychartid } = require("../../controllers/modularscreens/chart")

router.post('/modularscreens/chart', create);

router.get('/modularscreens/chart', find);

router.get('/modularscreens/chart/:id', read);

router.put('/modularscreens/chart/:chartId', update)

router.post('/modularscreens/chart/remove/:id', remove);

//

router.get('/modularscreens/chartsbyscreenid/:screenid', chartsbyscreenid);
//

router.get('/modularscreens/chartbychartid/:chartid', chartbychartid);

module.exports = router