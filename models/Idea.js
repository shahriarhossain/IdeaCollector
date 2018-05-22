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
    image : {
        type: String
    },
    createdOn : {
        type: Date,
        default : Date.now()
    }
});

module.exports = mongoose.model('Ideas', IdeaSchema);