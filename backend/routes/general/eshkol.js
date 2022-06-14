const express = require('express');
const router = express.Router()

const { create, find, update, remove, findById,deleteMahzorEshkol,eshkolbymahzorid,eshkolbymahzoridandunitid,eshkolbyjobinmahzorid,eshkolbyid} = require('../../controllers/general/eshkol');

// find spec 
router.get('/eshkol/:id', findById)
//find all
router.get('/eshkol', find)
//add 
router.post('/eshkol',create); /**/ 
//update 
router.put('/eshkol/:eshkolId', update)
//delete 
router.delete('/eshkol/:id', remove )

router.delete('/eshkol/deletemahzoreshkol/:mahzorid', deleteMahzorEshkol )

router.get('/eshkolbymahzorid/:mahzorid', eshkolbymahzorid)

router.get('/eshkolbymahzoridandunitid/:mahzorid/:unitid', eshkolbymahzoridandunitid)

router.get('/eshkolbyjobinmahzorid/:jobinmahzorid', eshkolbyjobinmahzorid)

router.get('/eshkolbyid/:id', eshkolbyid)

module.exports = router;