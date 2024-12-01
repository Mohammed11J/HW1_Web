const responses = [
    {
        participant: 'John Doe',
        answers: {
            1: 'Paris',
            2: ['2', '3', '5'],
            3: 'Jupiter',
            4: 'Yes',
            5: 'JavaScript',
            6: ['Europe', 'Asia'],
            7: 'Option B',
            8: 'Secret Answer',
        },
        score: 40,
    },
    {
        participant: 'Jane Smith',
        answers: {
            1: 'Berlin',
            2: ['2', '4'],
            3: 'Saturn',
            4: 'No',
            6: ['Africa'],
            7: 'Option A',
        },
        score: 10,
    },
];

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

function renderResponses() {
    const responsesDiv = document.getElementById('responses');
    responsesDiv.innerHTML = '';

    responses.forEach((response) => {
        const responseDiv = document.createElement('div');
        responseDiv.className = 'mb-5 p-3 border border-gray-200 rounded';

        const participantName = document.createElement('h2');
        participantName.className = 'text-2xl font-semibold mb-2';
        participantName.textContent = response.participant;
        responseDiv.appendChild(participantName);

        quiz.questions.forEach((q) => {
            if (q.isConditional) {
                const conditionAnswer = response.answers[q.condition.questionId];
                let conditionMet = false;
                if (Array.isArray(conditionAnswer)) {
                    conditionMet = conditionAnswer.includes(q.condition.value);
                } else {
                    conditionMet = conditionAnswer === q.condition.value;
                }
                if (!conditionMet) {
                    return; 
                }
            }

            const answerDiv = document.createElement('div');
            answerDiv.className = 'mb-1';

            let participantAnswer = response.answers[q.id];
            let correct = false;

            if (participantAnswer !== undefined) {
                if (q.type === 'checkboxes') {
                    participantAnswer = participantAnswer.join(', ');
                    correct = arraysEqual(response.answers[q.id], q.correctAnswer);
                } else if (q.type === 'text') {
                    correct = q.correctAnswer && response.answers[q.id].trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                } else {
                    correct = response.answers[q.id] === q.correctAnswer;
                }
            } else {
                participantAnswer = 'No response';
            }

            answerDiv.innerHTML = `<strong>${q.question}</strong><br>Answer: ${participantAnswer} ${q.grade > 0 ? (correct ? '✅' : '❌') : ''}`;
            responseDiv.appendChild(answerDiv);
        });

        const scoreDiv = document.createElement('div');
        scoreDiv.className = 'mt-2 font-bold';
        scoreDiv.textContent = `Score: ${response.score}`;
        responseDiv.appendChild(scoreDiv);

        responsesDiv.appendChild(responseDiv);
    });
}

function renderResponses() {
    const responsesDiv = document.getElementById('responses');
    responsesDiv.innerHTML = '';

    responses.forEach((response) => {
        const responseDiv = document.createElement('div');
        responseDiv.className = 'mb-5 p-3 border border-gray-200 rounded';

        const participantName = document.createElement('h2');
        participantName.className = 'text-2xl font-semibold mb-2';
        participantName.textContent = response.participant;
        responseDiv.appendChild(participantName);

        let totalScore = 0;
        let maxScore = 0;

        quiz.questions.forEach((q) => {
            if (q.isConditional) {
                const conditionAnswer = response.answers[q.condition.questionId];
                let conditionMet = false;
                if (Array.isArray(conditionAnswer)) {
                    conditionMet = conditionAnswer.includes(q.condition.value);
                } else {
                    conditionMet = conditionAnswer === q.condition.value;
                }
                if (!conditionMet) {
                    return; 
                }
            }

            const answerDiv = document.createElement('div');
            answerDiv.className = 'mb-1';

            let participantAnswer = response.answers[q.id];
            let correct = false;

            if (participantAnswer !== undefined) {
                if (q.type === 'checkboxes') {
                    correct = arraysEqual(response.answers[q.id], q.correctAnswer);
                    participantAnswer = response.answers[q.id].join(', ');
                } else if (q.type === 'text') {
                    correct = q.correctAnswer && response.answers[q.id].trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                } else {
                    correct = response.answers[q.id] === q.correctAnswer;
                }
            } else {
                participantAnswer = 'No response';
            }

            maxScore += q.grade || 0;
            if (correct) {
                totalScore += q.grade || 0;
            }

            answerDiv.innerHTML = `<strong>${q.question}</strong><br>Answer: ${participantAnswer} ${q.grade > 0 ? (correct ? '✅' : '❌') : ''}`;
            responseDiv.appendChild(answerDiv);
        });

        const scoreDiv = document.createElement('div');
        scoreDiv.className = 'mt-2 font-bold';
        scoreDiv.textContent = `Score: ${totalScore}/${maxScore}`;
        responseDiv.appendChild(scoreDiv);

        responsesDiv.appendChild(responseDiv);
    });
}

function arraysEqual(a, b) {
    if (a === undefined || b === undefined) return false;
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, index) => val === sortedB[index]);
}

renderResponses();
