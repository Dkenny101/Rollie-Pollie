var mongoose = require('mongoose');


//Schema for polls
var PollSchema = new mongoose.Schema( {
    question: String,
    choices: [{
        text: String,
        votes: { type: Number, default: 0 }
    }]
});

PollSchema.methods.vote = function(cb) {
    this.votes += 1;
    this.save(cb);
}

mongoose.model('Poll', PollSchema);
