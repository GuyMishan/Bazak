const express = require('express');
const router = express.Router()

const { create, find, update, remove, findById,smartmahzors} = require('../../controllers/general/mahzor');

// find spec 
router.get('/mahzor/:id', findById)
//find all
router.get('/mahzor', find)
//add 
router.post('/mahzor',create); /**/ 
//update 
router.put('/mahzor/:mahzorId', update)
//delete 
router.delete('/mahzor/:id', remove )

router.get('/smartmahzors', smartmahzors)

module.exports = router;