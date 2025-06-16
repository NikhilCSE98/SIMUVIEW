const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    interviewId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Interview'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    questionIndex: {
        type: Number,
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    userAnswer: {
        type: String,
        required: true,
    },
    feedback: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
