const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IdeaSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description : {
        type: String,
        required : true
    },
    createdOn : {
        type: Date,
        default : Date.now()
    }
});

mongoose.model('Ideas', IdeaSchema);