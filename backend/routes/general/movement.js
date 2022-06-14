const express = require('express');
const router = express.Router()

const { create, find, update, remove, findById} = require('../../controllers/general/movement');

// find spec 
router.get('/movement/:id', findById)
//find all
router.get('/movement', find)
//add 
router.post('/movement',create); /**/ 
//update 
router.put('/movement/:movementId', update)
//delete 
router.delete('/movement/:id', remove )

module.exports = router;