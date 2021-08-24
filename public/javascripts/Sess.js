var express = require('express');
var router = express.Router();

router.get('/:variable?', function(req, res, next) {
    var variable = req.params.variable;
    var session = req.session;

    if(variable && session[variable] ){
        res.status(200).json(session[variable]);
    }else{
        res.status(400).end();
    }
});

module.exports = router;