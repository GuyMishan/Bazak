const express = require('express');
const router = express.Router()

const { create, find, update, remove, findById,candidatepreferencebycandidateid,smartcandidatepreference,candidatepreferencebymahzorid} = require('../../controllers/general/candidatepreference');

// find spec 
router.get('/candidatepreference/:id', findById)
//find all
router.get('/candidatepreference', find)
//add 
router.post('/candidatepreference',create); /**/ 
//update 
router.put('/candidatepreference/:candidatepreferenceId', update)
//delete 
router.delete('/candidatepreference/:id', remove )

router.get('/candidatepreference/candidatepreferencebycandidateid/:candidateid', candidatepreferencebycandidateid )

router.get('/smartcandidatepreference', smartcandidatepreference )

router.get('/candidatepreferencebymahzorid/:mahzorid', candidatepreferencebymahzorid )

module.exports = router;