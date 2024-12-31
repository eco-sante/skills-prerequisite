// Liste des questions
const questions = [
    "Do you have a personal computer at home?",
    "Do you have access to a personal computer?",
    "Do you regularly use a computer to study?",
    "Do you have a stable internet connection at home?",
    "Do you know what a terminal or command line is?",
    "Have you ever used a terminal or command line?",
    "Do you know how to create, rename, or delete files and folders in Windows?",
    "Do you know how to create, rename, or delete folders using a command line?",
    "Have you ever installed an application on your computer?",
    "Do you regularly use the Internet?",
    "Have you ever loocked for information on the Internet?",
    "AHave you ever used a text editor (Notepad, Sublime Text, etc.)?",
    "Do you enjoy solving logical problems or puzzles?",
    "Are you interested in how computers work?",
    "Would you like to create your own applications or video games?",
    "Are you patient and persistent?",
    "Are you willing to learn new things?",
    "Do you enjoy working independently?",
    "Are you comfortable with mathematics?",
    "Have you ever tried to learn a programming language?",
];

// Variables globales
let currentQuestion = 0;
const answers = [];
let score = 0;

// Sélecteurs
const userInfo = document.getElementById("user-info");
const quizSection = document.getElementById("quiz-section");
const questionElement = document.getElementById("question");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const progressElement = document.getElementById("progress");
const startButton = document.getElementById("startButton");
const nameInput = document.getElementById("name");
const surnameInput = document.getElementById("surname");
const emailInput = document.getElementById("email");

// Commencer le quiz
startButton.addEventListener("click", () => {
    if (nameInput.value && surnameInput.value && emailInput.value) {
        userInfo.style.display = "none";
        quizSection.style.display = "block";
        displayQuestion();
    } else {
        alert("Please fill in all the fields.");
    }
});

// Afficher la question actuelle
function displayQuestion() {
    questionElement.textContent = questions[currentQuestion];
    progressElement.textContent = `Question ${currentQuestion + 1}/${questions.length}`;
}

// Gérer les réponses
function handleAnswer(isCorrect) {
    answers.push({
        question: questions[currentQuestion],
        answer: isCorrect ? "Oui (Correct)" : "Non (Incorrect)",
    });

    if (isCorrect) score++;
    currentQuestion++;

    if (currentQuestion < questions.length) {
        displayQuestion();
    } else {
        showSaveOption();
    }
}

// Afficher l'option d'enregistrement
function showSaveOption() {
    quizSection.innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>Your score is ${score}/20.</p>
        <p>Would you like to save your results ?</p>
        <button id="saveButton">Save</button>
        <button id="cancelButton">Cancel</button>
    `;

    const saveButton = document.getElementById("saveButton");
    const cancelButton = document.getElementById("cancelButton");

    // Désactiver le bouton après le premier clic
    saveButton.addEventListener("click", () => saveResults(saveButton, cancelButton));
    cancelButton.addEventListener("click", () => {
    quizSection.innerHTML = `<h2>Thank you for your participation !</h2>`;
    });
}
// Enregistrer les résultats dans Google Sheets
const scriptURL = "https://script.google.com/macros/s/AKfycbyHPPpb67krWs7GYZ6m_s07XRLzWRw6uVhfAgwQ1pDnqT0q1o1-shRZcGyyuRgv22TpAg/exec";

function saveResults(saveButton, cancelButton) {
    // Désactiver le bouton "Enregistrer" pour éviter plusieurs clics
    saveButton.disabled = true;
    saveButton.textContent = "Saving in progress...";
        fetch(scriptURL, {
        method: "POST",
        mode: "no-cors", // Désactiver les restrictions CORS
        body: JSON.stringify({
            name: nameInput.value,
            surname: surnameInput.value,
            email: emailInput.value,
            score: score,
            answers: answers.map(a => a.answer),
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(() => {
        // Confirmation de l'enregistrement
        quizSection.innerHTML = `
            <h2>Thank you for your participation !</h2>
            <p>Your results have been successfully saved.</p>
        `;
    })
    .catch(error => {
        console.error("Erreur :", error);
        quizSection.innerHTML = `
            <h2>Erreur lors de l'enregistrement des résultats.</h2>
            <p>Veuillez réessayer plus tard.</p>
        `;
    });
}
// Boutons Oui / Non
yesButton.addEventListener("click", () => handleAnswer(true));
noButton.addEventListener("click", () => handleAnswer(false));

// Ajouter une section pour le graphique
function showSaveOption() {
    quizSection.innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>Your score is ${score}/20.</p>
        <p>Would you like to save your results ?</p>
        <button id="saveButton">Enregistrer</button>
        <button id="cancelButton">Annuler</button>
        <canvas id="resultsChart" width="400" height="200"></canvas>
    `;

    const saveButton = document.getElementById("saveButton");
    const cancelButton = document.getElementById("cancelButton");

    // Afficher le graphique
    renderChart();

    saveButton.addEventListener("click", () => saveResults(saveButton, cancelButton));
    cancelButton.addEventListener("click", () => {
        quizSection.innerHTML = `<h2>Thank you for your participation !</h2>`;
    });
}

// Fonction pour afficher le graphique des résultats
function renderChart() {
    const ctx = document.getElementById("resultsChart").getContext("2d");

    // Calcul des données
    const correctAnswers = score;
    const incorrectAnswers = questions.length - score;

    // Ajouter le score au centre avec un plugin
    const centerTextPlugin = {
        id: "centerText",
        beforeDraw(chart) {
            const { width } = chart;
            const { height } = chart;
            const { ctx } = chart;
            const fontSize = (height / 100) * 7;

            ctx.save();
            ctx.font = `${fontSize}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#000";
            ctx.fillText(`${score}/${questions.length}`, width / 2, height / 2);
            ctx.restore();
        },
    };

    // Initialisation du graphique
    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Correctes", "Incorrectes"],
            datasets: [
                {
                    label: "Répartition des réponses",
                    data: [correctAnswers, incorrectAnswers],
                    backgroundColor: [
                        "rgba(75, 192, 192, 0.6)", // Vert clair
                        "rgba(255, 99, 132, 0.6)", // Rouge clair
                    ],
                    borderColor: [
                        "rgba(75, 192, 192, 1)",
                        "rgba(255, 99, 132, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                },
            },
        },
        plugins: [centerTextPlugin], // Ajouter le plugin ici
    });
}

// URL de l'API Google Sheets (à modifier si nécessaire)
const scoresFetchURL = "https://script.google.com/macros/s/AKfycbyHPPpb67krWs7GYZ6m_s07XRLzWRw6uVhfAgwQ1pDnqT0q1o1-shRZcGyyuRgv22TpAg/exec";

// Fonction pour calculer et afficher le classement
function calculateRanking() {
    fetch(scoresFetchURL)
        .then(response => response.json())
        .then(data => {
            const allScores = data.scores; // Liste des scores des participants
            allScores.push(score); // Ajouter le score actuel à la liste
            allScores.sort((a, b) => b - a); // Trier les scores (ordre décroissant)

            const rank = allScores.indexOf(score) + 1; // Trouver la position du score
            const totalParticipants = allScores.length;

            displayRanking(rank, totalParticipants);
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des scores :", error);
            quizSection.innerHTML += `
                <p>Impossible de déterminer votre classement pour le moment. Veuillez réessayer plus tard.</p>
            `;
        });
}

// Fonction pour afficher le classement
function displayRanking(rank, totalParticipants) {
    quizSection.innerHTML += `
        <h3>Ranking</h3>
        <p>You are ranked <strong>${rank}</strong> out of <strong>${totalParticipants}</strong> participants.</p>
    `;
}

// Modifier la fonction showSaveOption pour inclure le calcul du classement
function showSaveOption() {
    quizSection.innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>Your score is ${score}/20.</p>
        <p>Would you like to save your results ?</p>
        <button id="saveButton">Save</button>
        <button id="cancelButton">Cancel</button>
        <canvas id="resultsChart" width="400" height="200"></canvas>
    `;

    const saveButton = document.getElementById("saveButton");
    const cancelButton = document.getElementById("cancelButton");

    // Afficher le graphique
    renderChart();

    saveButton.addEventListener("click", () => {
        saveResults(saveButton, cancelButton);
        calculateRanking(); // Calculer le classement après l'enregistrement
    });

    cancelButton.addEventListener("click", () => {
        quizSection.innerHTML = `<h2>Thank you for your participation !</h2>`;
    });
}
