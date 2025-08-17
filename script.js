const quizContainer = document.getElementById("quiz-container");
const submitBtn = document.getElementById("submit-btn");
const resultDiv = document.getElementById("result");
let quizData = [];

async function loadQuiz() {
    try {
        console.log("Loading quiz...");
        const res = await fetch("http://localhost:5000/api/questions");
        console.log("Response status:", res.status);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        quizData = await res.json();
        console.log("Quiz data loaded:", quizData);
        displayQuiz();
    } catch (error) {
        console.error("Error loading quiz:", error);
        quizContainer.innerHTML = `<p style="color: red;">Error loading quiz: ${error.message}</p>`;
    }
}

function displayQuiz() {
    quizContainer.innerHTML = "";
    quizData.forEach((q, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question");
        questionDiv.innerHTML = `<h3>${index + 1}. ${q.question}</h3>`;
        
        q.options.forEach(option => {
            questionDiv.innerHTML += `
                <label>
                    <input type="radio" name="q${index}" value="${option}">
                    ${option}
                </label><br>
            `;
        });
        quizContainer.appendChild(questionDiv);
    });
}

submitBtn.addEventListener("click", async () => {
    try {
        const answers = quizData.map((_, index) => {
            const selected = document.querySelector(`input[name="q${index}"]:checked`);
            return selected ? selected.value : null;
        });

        console.log("Submitting answers:", answers);
        const res = await fetch("http://localhost:5000/api/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answers })
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        console.log("Result received:", result);
        resultDiv.innerHTML = `You scored ${result.score} out of ${result.total}`;
    } catch (error) {
        console.error("Error submitting quiz:", error);
        resultDiv.innerHTML = `<p style="color: red;">Error submitting quiz: ${error.message}</p>`;
    }
});

loadQuiz();
