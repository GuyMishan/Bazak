const express = require('express');
const router = express.Router()

const { create, find, update, remove, findById,findgdodbyid,updatehativa,gdodsbyhativaid} = require('../../controllers/units/gdod');

// find spec 
router.get('/gdod/:id', findById)
router.get('/gdod', find)
//add 
router.post('/gdod',create); /**/ 
//update 
router.put('/gdod/:gdodId', update)
//delete 
router.delete('/gdod/:id', remove )

router.post('/gdod/gdodbyid',findgdodbyid);

router.post('/gdod/updatehativa',updatehativa);

router.post('/gdod/gdodsbyhativaid',gdodsbyhativaid);

module.exports = router;