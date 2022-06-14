const express = require('express');
const router = express.Router()

const { create, find, update, remove, findById,finalunitpreferencebyjobinmahzorid,smartfinalunitpreference,finalunitpreferencebymahzorid} = require('../../controllers/general/finalunitpreference');

// find spec 
router.get('/finalunitpreference/:id', findById)
//find all
router.get('/finalunitpreference', find)
//add 
router.post('/finalunitpreference',create); /**/ 
//update 
router.put('/finalunitpreference/:finalunitpreferenceId', update)
//delete 
router.delete('/finalunitpreference/:id', remove )

router.get('/finalunitpreferencebyjobinmahzorid/:jobid', finalunitpreferencebyjobinmahzorid )

router.get('/smartfinalunitpreference/', smartfinalunitpreference )

router.get('/finalunitpreferencebymahzorid/:mahzorid', finalunitpreferencebymahzorid )

module.exports = router;