var express = require('express');
var router = express.Router();

module.exports = router;

var mongoose = require('mongoose');

//get refernece to mongoose schema
//and store it in variable 'Poll'
var Poll = mongoose.model('Poll');

//GET home page
router.get('/', function (req, res) {
    res.render('index', { title: 'Rollie Pollie' });
});

//GET method for the /polls page template
router.get('/polls', function (req, res, next) {
    //query to return all contents of DB
    Poll.find(function(err, polls) {
        if(err) { return next(err); }
        
        //return result as json
        res.json(polls);
    });
});
//GET method to return a single post
//bug here="req.poll._id" changed to req.poll
router.get('/polls/:poll', function(req, res){
    res.json(req.poll);
});

//POST to the polls service
router.post('/polls', function (req, res, next) {
    var poll = new Poll(req.body);
    //save poll to DB
    poll.save(function (err, poll){
        if (err) { return next(err); }
        
        res.json(poll);
    });
});

//PUT method to add vote to choice in the poll
router.put('/polls/:poll/choices/:choice', function(req, res, next) {
    //find the required poll
    Poll.findOne({_id: req.params.poll}, function(err, poll) {
        if(err) { return next(err); }
        
        //query polls subdocument
        var choice = poll.choices.id(req.params.choice);
        //if choice has a value
        if(choice) {
            //increment the vote of selected choice
            choice.votes++;
            //save the updated state
            poll.save(function(err) {
                if(err) { return next(err) }
                return res.json(poll);
            });
            
        }
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
//mongoose queries



