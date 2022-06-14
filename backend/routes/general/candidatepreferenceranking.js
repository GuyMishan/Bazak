const express = require('express');
const router = express.Router()

const { create, find, update, remove, findById} = require('../../controllers/general/candidatepreferenceranking');

// find spec 
router.get('/candidatepreferenceranking/:id', findById)
//find all
router.get('/candidatepreferenceranking', find)
//add 
router.post('/candidatepreferenceranking',create); /**/ 
//update 
router.put('/candidatepreferenceranking/:candidatepreferencerankingId', update)
//delete 
router.delete('/candidatepreferenceranking/:id', remove )

module.exports = router;