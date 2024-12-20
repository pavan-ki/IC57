document.addEventListener("DOMContentLoaded", () => {
    populateMenu();
    // Load the first mock test from Chapter 01 by default
    loadQuiz("Chapter 01 - BASIC PRINCIPLES AND THE FIRE POLICY/Easy.json", "Chapter 01 - BASIC PRINCIPLES AND THE FIRE POLICY", "Easy");
});

let questions = [];
let userAnswers = {};
let selectedChapter = "Chapter 01 - BASIC PRINCIPLES AND THE FIRE POLICY/Easy.json"; // Track the currently selected chapter
let selectedMockTest = "Easy"; // Track the currently selected mock test

// Dynamically populate the accordion menu with chapters and mock tests
function populateMenu() {
    const chapters = {
        "Chapter 01 - BASIC PRINCIPLES AND THE FIRE POLICY": ["Easy.json", "Medium.json", "Hard.json", "Extreme.json", "Summary.json"],
        "Chapter 02 - ADD ON COVERS AND SPECIAL POLICIES": ["Easy.json", "Medium.json", "Hard.json", "Extreme.json", "Old.json", "Summary.json"],
        "Chapter 03 - FIRE HAZARDS AND FIRE PREVENTION": ["Easy.json", "Medium.json", "Hard.json", "Extreme.json", "Old.json", "Summary.json"],
        "Chapter 04 - ERSTWHILE TARIFF – RULES AND RATING": ["Easy.json", "Medium.json", "Hard.json", "Extreme.json", "Old.json", "Summary.json"],
        "Chapter 05 - DOCUMENTS": ["Easy.json", "Medium.json", "Hard.json", "Extreme.json", "Old.json", "Summary.json"],
        "Chapter 06 - UNDERWRITING": ["Easy.json", "Medium.json", "Hard.json", "Extreme.json", "Old.json", "Summary.json"],
        "Chapter 07 - CLAIMS - LEGAL ASPECTS": ["Easy.json", "Medium.json", "Hard.json", "Extreme.json", "Old.json", "Summary.json"],
        "Chapter 08 - CLAIMS – PROCEDURAL ASPECTS": ["Easy.json", "Medium.json", "Hard.json", "Extreme.json", "Old.json", "Summary.json"],
        "Chapter 09 - CONSEQUENTIAL LOSS INSURANCE - I": ["Easy.json", "Medium.json", "Hard.json", "Extreme.json", "Old.json", "Summary.json"],
        "Chapter 10 - CONSEQUENTIAL LOSS INSURANCE – II": ["Easy.json", "Medium.json", "Hard.json", "Extreme.json", "Old.json", "Summary.json"],
        "Chapter 11 - SPECIALISED POLICIES AND OVERSEAS PRACTICE": ["Easy.json", "Medium.json", "Hard.json", "Extreme.json", "Old.json", "Summary.json"]
    };

    const sidenav = document.getElementById("mySidenav");
    sidenav.innerHTML = ""; // Clear previous content

    Object.keys(chapters).forEach((chapter, chapterIndex) => {
        // Create chapter heading
        const chapterHeading = document.createElement("h3");
        chapterHeading.textContent = chapter;
        chapterHeading.className = chapterIndex === 0 ? "expanded" : ""; // Expand first chapter by default
        chapterHeading.onclick = () => toggleChapter(chapter, chapterHeading);

        // Create mock test links container
        const quizLinksContainer = document.createElement("div");
        quizLinksContainer.className = "quiz-links";

        chapters[chapter].forEach(mockTest => {
            const quizLink = document.createElement("a");
            quizLink.textContent = mockTest.replace(".json", ""); // Display name without .json
            quizLink.classList.add("quiz-link");

            if (mockTest.startsWith("Summary")) {
                quizLink.onclick = () => loadSummary(encodeURIComponent(`${chapter}/${mockTest}`), chapter, mockTest.replace(".json", ""));
            }
            else {
                quizLink.onclick = () => loadQuiz(encodeURIComponent(`${chapter}/${mockTest}`), chapter, mockTest.replace(".json", ""));
            }

            quizLinksContainer.appendChild(quizLink);
        });

        sidenav.appendChild(chapterHeading);
        sidenav.appendChild(quizLinksContainer);
    });
}

// Toggle chapter expansion and collapse other chapters
function toggleChapter(chapter, chapterHeading) {
    const allChapters = document.querySelectorAll("#mySidenav h3");
    const allQuizLinks = document.querySelectorAll(".quiz-links");

    // Collapse all chapters and hide all quiz links
    allChapters.forEach(h => h.classList.remove("expanded"));
    allQuizLinks.forEach(ql => ql.style.display = "none");

    // Expand the clicked chapter and show its quizzes
    chapterHeading.classList.add("expanded");
    chapterHeading.nextElementSibling.style.display = "block";
}

// Load quiz from a specific chapter and mock test file, update header
async function loadQuiz(filePath, chapterName, mockTestName) {
    try {
        const response = await fetch(filePath);
        questions = await response.json();

        // Reset UI for a new quiz
        userAnswers = {};
        document.getElementById('question-count').textContent = `Questions: ${questions.length}`;
        document.getElementById('quiz-container').innerHTML = questions.map((q, index) => createQuestionHTML(q, index)).join('');
        document.getElementById('summary').textContent = '';
        document.getElementById('result-container').textContent = '';

        // Update the chapter and mock test name in the header
        updateQuizHeader(chapterName, mockTestName);

        // Update selected state in the menu
        updateSelectedMockTest(chapterName, mockTestName);
    } catch (error) {
        console.error("Error loading quiz:", error);
        alert("Quiz file not found.");
    }
}

// Load quiz from a specific chapter and mock test file, update header
async function loadSummary(filePath, chapterName, mockTestName) {
    try {
        const response = await fetch(filePath);
        questions = await response.json();

        // Reset UI for a new quiz
        userAnswers = {};
        document.getElementById('quiz-container').innerHTML = createSummaryHTML(questions.question);

        // Update the chapter and mock test name in the header
        updateQuizHeader(chapterName, mockTestName);

        // Update selected state in the menu
        updateSelectedMockTest(chapterName, mockTestName);
    } catch (error) {
        console.error("Error loading summary:", error);
        alert("Summary file not found.");
    }
}

// Update the <h3> below the <h2> with the selected chapter and mock test names
function updateQuizHeader(chapterName, mockTestName) {
    let header = document.getElementById("quiz-header");
    if (!header) {
        header = document.createElement("h3");
        header.id = "quiz-header";
        document.querySelector("h2").insertAdjacentElement("afterend", header);
    }
    header.textContent = `${chapterName} - ${mockTestName}`;
}

// Highlight the selected mock test in the menu and expand its chapter
function updateSelectedMockTest(chapterName, mockTestName) {
    const allChapters = document.querySelectorAll("#mySidenav h3");
    const allQuizLinks = document.querySelectorAll(".quiz-link");

    // Clear existing highlights and collapse all chapters
    allQuizLinks.forEach(link => link.classList.remove("selected"));
    allChapters.forEach(h => h.classList.remove("expanded"));
    document.querySelectorAll(".quiz-links").forEach(ql => ql.style.display = "none");

    // Expand the correct chapter
    const chapterHeading = Array.from(allChapters).find(h => h.textContent === chapterName);
    if (chapterHeading) {
        chapterHeading.classList.add("expanded");
        chapterHeading.nextElementSibling.style.display = "block";
    }

    // Highlight the selected mock test link
    const mockTestLink = Array.from(allQuizLinks).find(link => link.textContent === mockTestName);
    if (mockTestLink) {
        mockTestLink.classList.add("selected");
    }
}

// Generates HTML for each question card
function createQuestionHTML(question, index) {
    const optionsHTML = question.options.map((option, optionIndex) => `
        <button class="option-button" onclick="selectAnswer(${index}, ${optionIndex}, this)">
            ${option}
        </button>
    `).join('');

    return `
        <div class="question-card" id="question-${index}">
            <h3 class="question-title">${index + 1}. ${question.question}</h3>
            <div class="options-container">
                ${optionsHTML}
            </div>
            <div class="feedback" style="padding-top: 10px; font-weight: bold;"></div>
        </div>
    `;
}

// Generates HTML for each question card
function createSummaryHTML(question) {
    return `
        <div class="question-card">
            <div class="question-title">${question}</div>
        </div>
    `;
}

// Track user's selected answers
function selectAnswer(questionIndex, optionIndex, button) {
    userAnswers[questionIndex] = optionIndex;

    // Clear selected state on all options for this question
    const optionButtons = button.parentNode.querySelectorAll('.option-button');
    optionButtons.forEach(btn => btn.classList.remove('selected'));

    // Set selected state on the clicked button
    button.classList.add('selected');
}

// Submit quiz and evaluate results
function submitQuiz() {
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    questions.forEach((q, index) => {
        const userAnswer = userAnswers[index];
        const feedbackContainer = document.getElementById(`question-${index}`).querySelector('.feedback');

        if (userAnswer === undefined) {
            unansweredCount++;
            feedbackContainer.textContent = 'Unanswered';
            feedbackContainer.style.color = 'orange';
        } else if (userAnswer === q.correctIndex) {
            correctCount++;
            feedbackContainer.textContent = 'Correct!';
            feedbackContainer.style.color = 'green';
        } else {
            incorrectCount++;
            feedbackContainer.textContent = `Incorrect! The correct answer is: ${q.options[q.correctIndex]}`;
            feedbackContainer.style.color = 'red';
        }
    });

    // Update summary
    document.getElementById('summary').textContent = `Correct: ${correctCount} | Incorrect: ${incorrectCount} | Unanswered: ${unansweredCount}`;
}

// Reveal correct answers for all questions
function revealAnswers() {
    questions.forEach((q, index) => {
        const feedbackContainer = document.getElementById(`question-${index}`).querySelector('.feedback');
        feedbackContainer.textContent = `Answer: ${q.options[q.correctIndex]}`;
        feedbackContainer.style.color = '#4caf50'; // Green for correct answers

        // Highlight the correct answer button
        const optionButtons = document.getElementById(`question-${index}`).querySelectorAll('.option-button');
        optionButtons[q.correctIndex].classList.add('highlight');
    });
}