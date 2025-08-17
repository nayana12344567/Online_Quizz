const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// Load questions from JSON
const questions = JSON.parse(fs.readFileSync(__dirname + "/questions.json"));

// API to get questions
app.get("/api/questions", (req, res) => {
    res.json(questions.map(q => ({
        question: q.question,
        options: q.options
    })));
});

// API to check answers
app.post("/api/submit", (req, res) => {
    const userAnswers = req.body.answers;
    let score = 0;

    questions.forEach((q, index) => {
        if (userAnswers[index] === q.answer) {
            score++;
        }
    });

    res.json({ score, total: questions.length });
});

// Start server
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
