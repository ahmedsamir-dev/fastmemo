const { Router } = require('express');
const ViewsController = require('../controllers/views.Controllers');

const router = Router();

router.route('/').get(ViewsController.getHomePage);

module.exports = router;
