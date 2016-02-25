var express = require('express');
var router = express.Router();

// render partial views
router.get('/partials/:name', function (req, res) {
    res.render('partials/' + req.params.name);
});
router.get('/admin/:name', function (req, res) {
    res.render('admin/' + req.params.name);
});

// render "container page"
router.get('/', function (req, res, next) {
    res.render('index');
});

module.exports = router;
