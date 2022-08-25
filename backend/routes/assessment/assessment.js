const express = require('express');
const router = express.Router()


const { create, find, read, update, remove} = require("../../controllers/assessment/assessment")

router.post('/assessment', create);

router.get('/assessment', find);

router.get('/assessment/:id', read);

router.put('/assessment/:assessmentId', update)

router.post('/assessment/remove/:id', remove);

//

module.exports = router