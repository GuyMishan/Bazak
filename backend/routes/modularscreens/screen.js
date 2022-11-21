const express = require('express');
const router = express.Router()


const { create, find, read, update, remove } = require("../../controllers/modularscreens/screen")

router.post('/modularscreens/screen', create);

router.get('/modularscreens/screen', find);

router.get('/modularscreens/screen/:id', read);

router.put('/modularscreens/screen/:screenId', update)

router.post('/modularscreens/screen/remove/:id', remove);

//

module.exports = router