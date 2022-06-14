const express = require('express');
const router = express.Router()

const { find,getuserbyid,update,remove,findvalidated,findnotvalidated,usersbyrole,usersbyroleandpopulation,smartgetuserbyid} = require("../../controllers/authentication/user");

router.post('/getuserbyid',getuserbyid)

router.get('/users', find)

router.put('/user/update/:id', update)

router.post('/user/remove/:userId', remove )

router.get('/usersvalidated', findvalidated)

router.get('/usersnotvalidated', findnotvalidated)

router.get('/usersbyrole/:role', usersbyrole)

router.get('/usersbyroleandpopulation/:role/:population', usersbyroleandpopulation)

router.post('/smartgetuserbyid',smartgetuserbyid)

module.exports = router;