const express = require('express');
const router = express.Router()

const { create, find, update, remove, findById} = require('../../controllers/general/unit');

// find spec 
router.get('/unit/:id', findById)
//find all
router.get('/unit', find)
//add 
router.post('/unit',create); /**/ 
//update 
router.put('/unit/:unitId', update)
//delete 
router.delete('/unit/:id', remove )

module.exports = router;