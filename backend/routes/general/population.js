const express = require('express');
const router = express.Router()

const { create, find, update, remove, findById} = require('../../controllers/general/population');

// find spec 
router.get('/population/:id', findById)
//find all
router.get('/population', find)
//add 
router.post('/population',create); /**/ 
//update 
router.put('/population/:populationId', update)
//delete 
router.delete('/population/:id', remove )

module.exports = router;