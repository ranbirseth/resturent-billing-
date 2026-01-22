const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controller');

router.get('/', menuController.getMenuItems);
router.post('/', menuController.createMenuItem);
router.put('/:id', menuController.updateMenuItem);
router.patch('/:id/toggle', menuController.toggleMenuItem);
router.delete('/:id', menuController.softDeleteMenuItem);

module.exports = router;
