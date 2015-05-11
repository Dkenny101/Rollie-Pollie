var express = require('express');
var router = express.Router();

module.exports = router;

var mongoose = require('mongoose');
//var Poll = require('./../models/Poll').PollSchema;

var Poll = mongoose.model('Poll');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Rollie Pollie' });
});

router.get('/polls', function (req, res, next) {
    Poll.find(function(err, polls) {
        if(err) { return next(err); }
        
        res.json(polls);
    });
});
//post to the polls service
router.post('/polls', function (req, res, next) {
    var poll = new Poll(req.body);
    
    poll.save(function (err, poll){
        if (err) { return next(err); }
        
        res.json(poll);
    });
});

//use Express's param() function to automatically load an object.
router.param('poll', function(req, res, next, id) {
    var query = Poll.findById(id);
    
    query.exec(function (err, poll){
    if (err) { return next(err); }
    if (!poll) { return next(new Error("Can't find requested poll")); }

    req.poll = poll;
    return next();
    });
});

//to return a single post
//router.get('/polls/:poll', function(req, res, next){
//    res.json(poll);
//});

