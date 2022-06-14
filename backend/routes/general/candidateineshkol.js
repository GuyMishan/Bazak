const express = require('express');
const router = express.Router()

const { create, find, update, remove, findById} = require('../../controllers/general/candidateineshkol');

// find spec 
router.get('/candidateineshkol/:id', findById)
//find all
router.get('/candidateineshkol', find)
//add 
router.post('/candidateineshkol',create); /**/ 
//update 
router.put('/candidateineshkol/:candidateineshkolId', update)
//delete 
router.delete('/candidateineshkol/:id', remove )

module.exports = router;