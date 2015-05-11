var mongoose = require('mongoose');


//Schema for polls
//store schema template into variable PollSchema
var PollSchema = new mongoose.Schema( {
    question: String,
    choices: [{
        text: String,
        votes: { type: Number, default: 0 }
    }]
});

//new model named 'Poll' that takes the schema variable 
//as a parameter
mongoose.model('Poll', PollSchema);
