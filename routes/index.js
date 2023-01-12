/*
 * @Author: Emma Forslund - emfo2102 
 * @Date: 2023-01-12 16:52:04 
 * @Last Modified by:   Emma Forslund - emfo2102 
 * @Last Modified time: 2023-01-12 16:52:04 
 */


var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
