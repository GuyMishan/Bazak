const express = require('express');
const router = express.Router()


const {create, find, read, remove,update,magadsbymagadal} = require("../../controllers/cartypes/magad")

router.post('/magad', create);

router.get('/magad', find);

router.get('/magad/:id', read);

router.post('/magad/update', update)

router.post('/magad/remove/:id', remove);

router.get('/magad/magadsbymagadal/:magadalid', magadsbymagadal);

module.exports = router