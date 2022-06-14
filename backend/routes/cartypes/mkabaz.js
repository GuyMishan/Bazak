const express = require('express');
const router = express.Router()


const {create, find, read, remove,update,mkabazsbymagad} = require("../../controllers/cartypes/mkabaz")

router.post('/mkabaz', create);

router.get('/mkabaz', find);

router.get('/mkabaz/:id', read);

router.post('/mkabaz/update', update)

router.post('/mkabaz/remove/:id', remove);

router.get('/mkabazsbymagad/:magadid', mkabazsbymagad);

module.exports = router