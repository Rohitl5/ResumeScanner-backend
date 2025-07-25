const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name:String,
    email: String,
    jobDescription: String,
    matchScore:Number,
    geminiSummary : String,
    createdAt:{type:Date, default:Date.now}
});

const Candidate = mongoose.model('Candidate', candidateSchema);




module.exports = Candidate;