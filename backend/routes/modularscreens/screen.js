const express = require('express');
const router = express.Router()


const { create, find, read, update, remove,screensbyuserpersonalnumber } = require("../../controllers/modularscreens/screen")

router.post('/modularscreens/screen', create);

router.get('/modularscreens/screen', find);

router.get('/modularscreens/screen/:id', read);

router.put('/modularscreens/screen/:screenId', update)

router.post('/modularscreens/screen/remove/:id', remove);

//

router.get('/modularscreens/screensbyuserpersonalnumber/:userpersonalnumber', screensbyuserpersonalnumber);

module.exports = router