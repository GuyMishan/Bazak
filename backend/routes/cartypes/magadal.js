const express = require('express');
const router = express.Router()


const {create, find, read, remove,update} = require("../../controllers/cartypes/magadal")

router.post('/magadal', create);

router.get('/magadal', find);

router.get('/magadal/:id', read);

router.post('/magadal/update', update)

router.post('/magadal/remove/:id', remove);

module.exports = router