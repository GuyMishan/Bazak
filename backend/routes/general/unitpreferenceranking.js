const express = require('express');
const router = express.Router()

const { create, find, update, remove, findById} = require('../../controllers/general/unitpreferenceranking');

// find spec 
router.get('/unitpreferenceranking/:id', findById)
//find all
router.get('/unitpreferenceranking', find)
//add 
router.post('/unitpreferenceranking',create); /**/ 
//update 
router.put('/unitpreferenceranking/:unitpreferencerankingId', update)
//delete 
router.delete('/unitpreferenceranking/:id', remove )

module.exports = router;