const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    jobRole: String,
    jobDescription: String,
    yearsOfExperience: String,
    technology: String,
    expiryDate: Date,
    questions: {
        type: [{ question: String, answer: String }], // Change from String to Array of Objects
        required: false,
    }
});



module.exports = mongoose.model("AIcard", CardSchema);
