const express = require('express');
const router = express.Router()


const { create, find, read, update, remove, archivecardatabyunittypeandunitid,archivecardatabycarnumber } = require("../../controllers/general/archivecardata")

router.post('/archivecardata', create);

router.get('/archivecardata', find);

router.get('/archivecardata/:id', read);

router.put('/archivecardata/:archivecardataId', update)

router.post('/archivecardata/remove/:id', remove);

//

router.get('/archivecardata/archivecardatabyunittypeandunitid/:unittype/:unitid', archivecardatabyunittypeandunitid);

router.get('/archivecardata/archivecardatabycarnumber/:carnumber', archivecardatabycarnumber);

module.exports = router