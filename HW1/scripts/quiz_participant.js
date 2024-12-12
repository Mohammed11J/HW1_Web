const quiz = {
    title: 'Sample Quiz',
    questions: [
        {
            id: 1,
            type: 'multiple-choice',
            question: 'What is the capital of France?',
            options: ['Berlin', 'Paris', 'Rome', 'Madrid'],
            required: true,
            grade: 10,
            correctAnswer: 'Paris',
        },
        {
            id: 2,
            type: 'checkboxes',
            question: 'Select the prime numbers',
            options: ['2', '3', '4', '5', '6'],
            required: true,
            grade: 10,
            correctAnswer: ['2', '3', '5'],
        },
        {
            id: 3,
            type: 'text',
            question: 'Name the largest planet in our solar system',
            required: true,
            grade: 10,
            correctAnswer: 'Jupiter',
        },
        {
            id: 4,
            type: 'multiple-choice',
            question: 'Do you like programming?',
            options: ['Yes', 'No'],
            required: true,
            grade: 0,
            correctAnswer: '',
        },
        {
            id: 5,
            type: 'text',
            question: 'What is your favorite programming language?',
            required: false,
            grade: 0,
            correctAnswer: '',
            isConditional: true,
            condition: {
                questionId: 4,
                value: 'Yes',
            },
        },
        {
            id: 6,
            type: 'checkboxes',
            question: 'Select the continents you have visited',
            options: ['Asia', 'Europe', 'Africa', 'Australia', 'South America'],
            required: false,
            grade: 0,
            correctAnswer: [],
        },
        {
            id: 7,
            type: 'multiple-choice',
            question: 'Select the correct answer to proceed to the next question',
            options: ['Option A', 'Option B', 'Option C'],
            required: true,
            grade: 0,
            correctAnswer: 'Option B',
        },
        {
            id: 8,
            type: 'text',
            question: 'You have unlocked this question!',
            required: true,
            grade: 10,
            correctAnswer: 'Secret Answer',
            isConditional: true,
            condition: {
                questionId: 7,
                value: 'Option B',
            },
        },
    ],
};

let participantAnswers = {};

function initializeQuiz() {
    const quizContent = document.getElementById('quiz-content');
    quizContent.innerHTML = '';

    quiz.questions.forEach((q) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'mb-5';
        questionDiv.id = `question-${q.id}`;

        const questionLabel = document.createElement('label');
        questionLabel.className = 'block text-xl font-semibold mb-2';
        questionLabel.textContent = q.question + (q.required ? ' *' : '');
        questionDiv.appendChild(questionLabel);

        if (q.type === 'text') {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'w-full border border-gray-300 p-2 rounded';
            input.value = participantAnswers[q.id] || '';
            input.addEventListener('input', (e) => {
                participantAnswers[q.id] = e.target.value;
                updateConditionalQuestions();
            });
            questionDiv.appendChild(input);
        } else if (q.type === 'multiple-choice') {
            q.options.forEach((option) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'flex items-center mb-1';
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = `question-${q.id}`;
                radio.value = option;
                radio.className = 'mr-2';
                radio.checked = participantAnswers[q.id] === option;
                radio.addEventListener('change', (e) => {
                    participantAnswers[q.id] = e.target.value;
                    updateConditionalQuestions();
                });
                const label = document.createElement('label');
                label.textContent = option;
                optionDiv.appendChild(radio);
                optionDiv.appendChild(label);
                questionDiv.appendChild(optionDiv);
            });
        } else if (q.type === 'checkboxes') {
            q.options.forEach((option) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'flex items-center mb-1';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = `question-${q.id}`;
                checkbox.value = option;
                checkbox.className = 'mr-2';
                checkbox.checked = participantAnswers[q.id] && participantAnswers[q.id].includes(option);
                checkbox.addEventListener('change', (e) => {
                    if (!participantAnswers[q.id]) participantAnswers[q.id] = [];
                    if (e.target.checked) {
                        participantAnswers[q.id].push(e.target.value);
                    } else {
                        participantAnswers[q.id] = participantAnswers[q.id].filter((ans) => ans !== e.target.value);
                    }
                    updateConditionalQuestions();
                });
                const label = document.createElement('label');
                label.textContent = option;
                optionDiv.appendChild(checkbox);
                optionDiv.appendChild(label);
                questionDiv.appendChild(optionDiv);
            });
        }

        quizContent.appendChild(questionDiv);
    });

    updateConditionalQuestions();
}

function updateConditionalQuestions() {
    quiz.questions.forEach((q) => {
        if (q.isConditional) {
            const questionDiv = document.getElementById(`question-${q.id}`);
            const conditionQuestion = quiz.questions.find((question) => question.id === q.condition.questionId);
            const participantAnswer = participantAnswers[conditionQuestion.id];

            let conditionMet = false;
            if (Array.isArray(participantAnswer)) {
                conditionMet = participantAnswer.includes(q.condition.value);
            } else {
                conditionMet = participantAnswer === q.condition.value;
            }

            if (conditionMet) {
                questionDiv.style.display = 'block';
            } else {
                questionDiv.style.display = 'none';
                delete participantAnswers[q.id];
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('h1').textContent = quiz.title;
    initializeQuiz();
});

document.getElementById('submit-quiz').addEventListener('click', () => {
    for (let q of quiz.questions) {
        const questionDiv = document.getElementById(`question-${q.id}`);
        if (questionDiv.style.display === 'none') {
            continue;
        }
        if (q.required && (!participantAnswers[q.id] || participantAnswers[q.id].length === 0)) {
            alert('Please answer all required questions.');
            return;
        }
    }

    let totalScore = 0;
    let maxScore = 0;

    quiz.questions.forEach((q) => {
        const questionDiv = document.getElementById(`question-${q.id}`);
        if (questionDiv.style.display === 'none') {
            return;
        }

        maxScore += q.grade || 0;
        const answer = participantAnswers[q.id];

        if (q.type === 'text' && answer && q.correctAnswer && answer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
            totalScore += q.grade || 0;
        } else if (q.type === 'multiple-choice' && answer === q.correctAnswer) {
            totalScore += q.grade || 0;
        } else if (q.type === 'checkboxes' && Array.isArray(answer)) {
            if (
                q.correctAnswer.length > 0 &&
                answer.length === q.correctAnswer.length &&
                answer.every((val) => q.correctAnswer.includes(val))
            ) {
                totalScore += q.grade || 0;
            }
        }
    });

    alert(`Quiz submitted successfully!\nYour Score: ${totalScore} out of ${maxScore}`);

    const wantsEmail = confirm('Do you want a copy of the quiz and your answers sent to your email?');
    if (wantsEmail) {
        const email = prompt('Please enter your email address:');
        if (email) {
            alert(`A copy of your quiz and responses will be sent to ${email}.`);
        } else {
            alert('Email address was not provided.');
        }
    }
});
