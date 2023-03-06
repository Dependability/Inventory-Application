const express = require('express');
const router = express.Router();

const microwave_controller = require('../controllers/microwave_controller')
const brand_controller = require('../controllers/brand_controller')

router.get('/', microwave_controller.index)


router.get('/microwaves', microwave_controller.microwave_list)
router.get('/microwave/:id', microwave_controller.microwave_view)
router.post('/microwave/delete', microwave_controller.microwave_delete)


router.get('/brands', brand_controller.brand_list)
router.get('/brand/:id', brand_controller.brand_view)

module.exports = router