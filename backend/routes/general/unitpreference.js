const express = require('express');
const router = express.Router()

const { create, find, update, remove, findById,unitpreferencebyjobinmahzorid,smartunitpreference,unitpreferencebymahzorid} = require('../../controllers/general/unitpreference');

// find spec 
router.get('/unitpreference/:id', findById)
//find all
router.get('/unitpreference', find)
//add 
router.post('/unitpreference',create); /**/ 
//update 
router.put('/unitpreference/:unitpreferenceId', update)
//delete 
router.delete('/unitpreference/:id', remove )

router.get('/unitpreferencebyjobinmahzorid/:jobid', unitpreferencebyjobinmahzorid )

router.get('/smartunitpreference/', smartunitpreference )

router.get('/unitpreferencebymahzorid/:mahzorid', unitpreferencebymahzorid )

module.exports = router;