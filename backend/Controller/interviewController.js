const Interview = require("../Model/Feedback.js");

const saveFeedback = async (req, res) => {
    const { interviewId, questionIndex, question, userAnswer, feedback, score } = req.body;

    try {
        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(404).json({ message: "Interview not found." });
        }

        // Ensure feedbacks array has the same number of slots as questions
        while (interview.feedbacks.length < interview.questions.length) {
            interview.feedbacks.push({});
        }

        interview.feedbacks[questionIndex] = {
            question,
            userAnswer,
            feedback,
            score,
        };

        await interview.save();

        res.status(200).json({ message: "Feedback saved successfully." });
    } catch (error) {
        console.error("Error saving feedback:", error);
        res.status(500).json({ message: "Error saving feedback." });
    }
};

module.exports = saveFeedback;
