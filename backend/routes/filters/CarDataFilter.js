const express = require('express');
const router = express.Router()


const { create, find, read, update, remove, cardatafilterbyuserperonalnumber, cardatafilterbyfilterid } = require("../../controllers/filters/CarDataFilter")

router.post('/filters/cardatafilter', create);

router.get('/filters/cardatafilter', find);

router.get('/filters/cardatafilter/:id', read);

router.put('/filters/cardatafilter/:filterId', update)

router.post('/filters/cardatafilter/remove/:id', remove);

//

router.get('/filters/cardatafilterbyuserperonalnumber/:userperonalnumber', cardatafilterbyuserperonalnumber);
//

router.get('/filters/cardatafilterbyfilterid/:filterid', cardatafilterbyfilterid);

module.exports = router