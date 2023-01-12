const express = require('express');
const router = express.Router()

const { find,getuserbyid,update,remove,findvalidated,findnotvalidated,usersbyrole,usersvalidatedaggregate,usersnotvalidatedaggregate} = require("../../controllers/authentication/user");

router.post('/getuserbyid',getuserbyid)

router.get('/users', find)

router.put('/user/update/:id', update)

router.post('/user/remove/:userId', remove )

router.get('/usersvalidated', findvalidated)

router.get('/usersnotvalidated', findnotvalidated)

router.get('/usersbyrole/:role', usersbyrole)

//3.1.2023

router.get('/usersvalidatedaggregate', usersvalidatedaggregate)

router.get('/usersnotvalidatedaggregate', usersnotvalidatedaggregate)

module.exports = router;