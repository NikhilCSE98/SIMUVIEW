const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
    jobRole: String,
    jobDescription: String,
    yearsOfExperience: String,
    technology: String,
    expiryDate: Date, // Add expiry date field
});

module.exports = mongoose.model("AIcard", CardSchema);
