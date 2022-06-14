const express = require('express');
const router = express.Router()

const { create, find, update, remove, findById,findpikodbyid,updateogdas} = require('../../controllers/units/pikod');

// find spec tipul
router.get('/pikod/:id', findById);
router.get('/pikod', find)
//add pikod
router.post('/pikod',create); /**/ 
//update pikod
router.put('/pikod/:pikodId', update)
//delete pikod
router.delete('/pikod/:id', remove )

router.post('/pikod/pikodbyid',findpikodbyid);

router.post('/pikod/updateogdas',updateogdas);

module.exports = router;