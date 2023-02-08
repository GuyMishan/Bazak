const express = require('express');
const router = express.Router()

const { create, find, update, remove, findById} = require('../../controllers/tipuls/tipul');

// find spec 
router.get('/tipul/:id', findById)
router.get('/tipul', find)
//add 
router.post('/tipul',create); /**/ 
//update 
router.put('/tipul/:id', update)
//delete 
router.delete('/tipul/:id', remove )

module.exports = router;