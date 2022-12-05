const express = require('express');
const router = express.Router()


const {create, find, read, remove, findById,update,makatsbymkabaz} = require("../../controllers/cartypes/makat")

router.post('/makat', create);

router.get('/makat/:id', findById);
router.get('/makat', find);

router.get('/makat/:id', read);

router.post('/makat/update', update)

router.post('/makat/remove/:id', remove);

router.get('/makat/makatsbymkabaz/:mkabazid', makatsbymkabaz);

module.exports = router