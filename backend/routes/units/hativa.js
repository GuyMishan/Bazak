const express = require('express');
const router = express.Router()

const { create, find, update, remove, findById,findhativabyid,updateogda,updategdods,hativasbyogdaid} = require('../../controllers/units/hativa');

// find spec tipul
router.get('/hativa/:id', findById)
router.get('/hativa', find)
//add pikod
router.post('/hativa',create) 
//update pikod
router.put('/hativa/:hativaId', update)
//delete pikod
router.delete('/hativa/:id', remove )

router.post('/hativa/hativabyid',findhativabyid);

router.post('/hativa/updateogda',updateogda);

router.post('/hativa/updategdods',updategdods);

router.post('/hativa/hativasbyogdaid',hativasbyogdaid);

module.exports = router;