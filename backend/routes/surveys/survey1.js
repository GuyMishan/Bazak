const express = require('express');
const router = express.Router()


const { create, find, read, update, remove, survey1byuserid } = require("../../controllers/surveys/survey1")

router.post('/survey1', create);

router.get('/survey1', find);

router.get('/survey1/:id', read);

router.put('/survey1/:survey1Id', update)

router.post('/survey1/remove/:id', remove);

//

router.get('/survey1/survey1byuserid/:userid', survey1byuserid);

module.exports = router