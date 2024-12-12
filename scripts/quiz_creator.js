let questions = [];

function initializeQuizForm() {
    const quizForm = document.getElementById('quiz-form');
    quizForm.innerHTML = '';

    questions.forEach((q, index) => {
        const questionDiv = createQuestionDiv(q, index);
        quizForm.appendChild(questionDiv);
    });
}

function createQuestionDiv(q, index) {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'mb-5 p-4 border border-gray-300 rounded';
    questionDiv.id = `question-${q.id}`;

    const headerDiv = document.createElement('div');
    headerDiv.className = 'flex justify-between items-center mb-3';

    const questionNumber = document.createElement('h2');
    questionNumber.className = 'text-xl font-semibold';
    questionNumber.textContent = `Question ${index + 1}`;
    headerDiv.appendChild(questionNumber);

    const removeButton = document.createElement('button');
    removeButton.className = 'removebtn'; // Use the custom class
    removeButton.innerHTML = '<i class="fas fa-trash"></i>'; // Trash icon for better UI
    removeButton.setAttribute('aria-label', 'Remove question');
    removeButton.setAttribute('title', 'Click to remove this question');
    removeButton.setAttribute('role', 'button');
    
    // Attach the click event listener
    removeButton.addEventListener('click', () => {
        const confirmDelete = confirm('Are you sure you want to remove this question?');
        if (confirmDelete) {
            if (typeof index === 'number' && index >= 0 && index < questions.length) {
                questions.splice(index, 1); // Remove the question
                initializeQuizForm(); // Re-render the form
            } else {
                console.error('Invalid index:', index);
            }
        }
    });
    
    // Append the button to the header div
    headerDiv.appendChild(removeButton);
    
    
    questionDiv.appendChild(headerDiv);

    const questionTextLabel = document.createElement('label');
    questionTextLabel.className = 'block text-md font-medium mb-1';
    questionTextLabel.textContent = 'Question Text';
    questionDiv.appendChild(questionTextLabel);

    const questionTextInput = document.createElement('input');
    questionTextInput.type = 'text';
    questionTextInput.className = 'w-full border border-gray-300 p-2 rounded mb-3';
    questionTextInput.value = q.question || '';
    questionTextInput.addEventListener('input', (e) => {
        q.question = e.target.value;
    });
    questionDiv.appendChild(questionTextInput);

    const typeLabel = document.createElement('label');
    typeLabel.className = 'block text-md font-medium mb-1';
    typeLabel.textContent = 'Question Type';
    questionDiv.appendChild(typeLabel);

    const typeSelect = document.createElement('select');
    typeSelect.className = 'w-full border border-gray-300 p-2 rounded mb-3';
    ['text', 'multiple-choice', 'checkboxes'].forEach((type) => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        if (q.type === type) {
            option.selected = true;
        }
        typeSelect.appendChild(option);
    });
    typeSelect.addEventListener('change', (e) => {
        q.type = e.target.value;
        const dynamicFieldsDiv = questionDiv.querySelector(`#dynamic-fields-${q.id}`);
        renderDynamicFields(q, dynamicFieldsDiv, index);
    });
    questionDiv.appendChild(typeSelect);

    const requiredDiv = document.createElement('div');
    requiredDiv.className = 'flex items-center mb-3';
    const requiredCheckbox = document.createElement('input');
    requiredCheckbox.type = 'checkbox';
    requiredCheckbox.className = 'mr-2';
    requiredCheckbox.checked = q.required || false;
    requiredCheckbox.addEventListener('change', (e) => {
        q.required = e.target.checked;
    });
    const requiredLabel = document.createElement('label');
    requiredLabel.textContent = 'Required';
    requiredDiv.appendChild(requiredCheckbox);
    requiredDiv.appendChild(requiredLabel);
    questionDiv.appendChild(requiredDiv);

    const gradeLabel = document.createElement('label');
    gradeLabel.className = 'block text-md font-medium mb-1';
    gradeLabel.textContent = 'Grade';
    questionDiv.appendChild(gradeLabel);

    const gradeInput = document.createElement('input');
    gradeInput.type = 'number';
    gradeInput.className = 'w-full border border-gray-300 p-2 rounded mb-3';
    gradeInput.value = q.grade || 0;
    gradeInput.addEventListener('input', (e) => {
        q.grade = parseInt(e.target.value, 10);
    });
    questionDiv.appendChild(gradeInput);

    const conditionalDiv = document.createElement('div');
    conditionalDiv.className = 'flex items-center mb-3';
    const conditionalCheckbox = document.createElement('input');
    conditionalCheckbox.type = 'checkbox';
    conditionalCheckbox.className = 'mr-2';
    conditionalCheckbox.checked = q.isConditional || false;
    conditionalCheckbox.addEventListener('change', (e) => {
        q.isConditional = e.target.checked;
        const dynamicFieldsDiv = questionDiv.querySelector(`#dynamic-fields-${q.id}`);
        renderDynamicFields(q, dynamicFieldsDiv, index);
    });
    const conditionalLabel = document.createElement('label');
    conditionalLabel.textContent = 'Is this question conditional?';
    conditionalDiv.appendChild(conditionalCheckbox);
    conditionalDiv.appendChild(conditionalLabel);
    questionDiv.appendChild(conditionalDiv);

    const dynamicFieldsDiv = document.createElement('div');
    dynamicFieldsDiv.id = `dynamic-fields-${q.id}`;
    questionDiv.appendChild(dynamicFieldsDiv);

    renderDynamicFields(q, dynamicFieldsDiv, index);

    return questionDiv;
}

function renderDynamicFields(q, dynamicFieldsDiv, index) {
    dynamicFieldsDiv.innerHTML = '';

    if (q.isConditional) {
        const dependLabel = document.createElement('label');
        dependLabel.className = 'block text-md font-medium mb-1';
        dependLabel.textContent = 'Depends on Question';
        dynamicFieldsDiv.appendChild(dependLabel);

        const dependSelect = document.createElement('select');
        dependSelect.className = 'w-full border border-gray-300 p-2 rounded mb-3';
        questions.slice(0, index).forEach((prevQ, idx) => {
            const option = document.createElement('option');
            option.value = prevQ.id;
            option.textContent = `Question ${idx + 1}: ${prevQ.question}`;
            if (q.condition && q.condition.questionId === prevQ.id) {
                option.selected = true;
            }
            dependSelect.appendChild(option);
        });
        dependSelect.addEventListener('change', (e) => {
            if (!q.condition) q.condition = {};
            q.condition.questionId = parseInt(e.target.value, 10);
        });
        dynamicFieldsDiv.appendChild(dependSelect);

        const valueLabel = document.createElement('label');
        valueLabel.className = 'block text-md font-medium mb-1';
        valueLabel.textContent = 'Show if the answer is';
        dynamicFieldsDiv.appendChild(valueLabel);

        const valueInput = document.createElement('input');
        valueInput.type = 'text';
        valueInput.className = 'w-full border border-gray-300 p-2 rounded mb-3';
        valueInput.value = q.condition ? q.condition.value : '';
        valueInput.addEventListener('input', (e) => {
            if (!q.condition) q.condition = {};
            q.condition.value = e.target.value;
        });
        dynamicFieldsDiv.appendChild(valueInput);
    } else {
        q.condition = null;
    }

    if (['multiple-choice', 'checkboxes'].includes(q.type)) {
        renderOptions(q, dynamicFieldsDiv, index);
    } else if (q.type === 'text') {
        const correctAnswerLabel = document.createElement('label');
        correctAnswerLabel.className = 'block text-md font-medium mb-1';
        correctAnswerLabel.textContent = 'Correct Answer';
        dynamicFieldsDiv.appendChild(correctAnswerLabel);

        const correctAnswerInput = document.createElement('input');
        correctAnswerInput.type = 'text';
        correctAnswerInput.className = 'w-full border border-gray-300 p-2 rounded mb-3';
        correctAnswerInput.value = q.correctAnswer || '';
        correctAnswerInput.addEventListener('input', (e) => {
            q.correctAnswer = e.target.value;
        });
        dynamicFieldsDiv.appendChild(correctAnswerInput);
    } else {
        dynamicFieldsDiv.innerHTML = '';
    }
}

function renderOptions(q, dynamicFieldsDiv, index) {
    const existingOptions = dynamicFieldsDiv.querySelectorAll('.option-div, .add-option-button');
    existingOptions.forEach((element) => element.remove());

    q.options = q.options || ['', '', ''];
    if (q.type === 'checkboxes' && !Array.isArray(q.correctAnswer)) {
        q.correctAnswer = [];
    } else if (q.type === 'multiple-choice' && typeof q.correctAnswer !== 'string') {
        q.correctAnswer = '';
    }

    q.options.forEach((option, optIndex) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'flex items-center mb-1 option-div';

        const optionInput = document.createElement('input');
        optionInput.type = 'text';
        optionInput.className = 'w-full border border-gray-300 p-2 rounded mr-2';
        optionInput.value = option;
        optionInput.addEventListener('input', (e) => {
            q.options[optIndex] = e.target.value;
        });
        optionDiv.appendChild(optionInput);

        if (q.type === 'multiple-choice') {
            const correctRadio = document.createElement('input');
            correctRadio.type = 'radio';
            correctRadio.name = `correct-answer-${q.id}`;
            correctRadio.value = option;
            correctRadio.checked = q.correctAnswer === option;
            correctRadio.addEventListener('change', (e) => {
                q.correctAnswer = e.target.value;
            });
            optionDiv.appendChild(correctRadio);
        } else if (q.type === 'checkboxes') {
            const correctCheckbox = document.createElement('input');
            correctCheckbox.type = 'checkbox';
            correctCheckbox.value = option;
            correctCheckbox.checked = q.correctAnswer.includes(option);
            correctCheckbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    q.correctAnswer.push(option);
                } else {
                    q.correctAnswer = q.correctAnswer.filter((ans) => ans !== option);
                }
            });
            optionDiv.appendChild(correctCheckbox);
        }

        const removeOptionButton = document.createElement('button');
        removeOptionButton.className = 'text-red-500 ml-2';
        removeOptionButton.textContent = 'X';
        removeOptionButton.addEventListener('click', () => {
            const removedOption = q.options.splice(optIndex, 1)[0];

            if (q.type === 'multiple-choice' && q.correctAnswer === removedOption) {
                q.correctAnswer = '';
            }

            if (q.type === 'checkboxes') {
                q.correctAnswer = q.correctAnswer.filter((ans) => ans !== removedOption);
            }

            renderOptions(q, dynamicFieldsDiv, index);
        });
        optionDiv.appendChild(removeOptionButton);

        dynamicFieldsDiv.appendChild(optionDiv);
    });

    const addOptionButton = document.createElement('button');
    addOptionButton.className = 'mt-2 bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition duration-300 add-option-button';
    addOptionButton.textContent = 'Add Option';
    addOptionButton.addEventListener('click', () => {
        q.options.push('');
        renderOptions(q, dynamicFieldsDiv, index);
    });
    dynamicFieldsDiv.appendChild(addOptionButton);
}

initializeQuizForm();

document.getElementById('add-question').addEventListener('click', () => {
    questions.push({
        id: Date.now(),
        type: 'text',
        question: '',
        required: false,
        grade: 0,
        correctAnswer: '',
        isConditional: false,
        condition: null,
        options: [],
    });
    initializeQuizForm();
});

document.getElementById('save-quiz').addEventListener('click', () => {
    console.log('Quiz saved:', questions);
    
    const currentUrl = window.location.href;
    const quizParticipantUrl = currentUrl.replace('quiz_creator.html', 'quiz_participant.html');

    // Create the backdrop with dark overlay
    const alertBox = document.createElement('div');
    alertBox.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    // Create the modal content without dynamic darkModeClass
    alertBox.innerHTML = `
        <div id="alert-content" class="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-8 rounded-lg shadow-lg max-w-md w-full text-center relative">
            <h2 class="text-2xl font-bold mb-4">Quiz Saved Successfully!</h2>
            <p class="mb-3">You can access the quiz here:</p>
            <a href="${quizParticipantUrl}" target="_blank" id="quiz-link" class="text-blue-500 dark:text-blue-400 underline break-all">${quizParticipantUrl}</a>
            <div class="flex justify-center mt-6">
                <button id="copy-link" class="mr-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Copy Link</button>
                <button id="close-alert" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(alertBox);

    // Event listener for "Copy Link" button
    document.getElementById('copy-link').addEventListener('click', () => {
        navigator.clipboard.writeText(quizParticipantUrl).then(() => {
            // Optional: Show a temporary confirmation message
            const copyConfirmation = document.createElement('div');
            copyConfirmation.className = 'absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded';
            copyConfirmation.innerText = 'Copied!';
            document.getElementById('alert-content').appendChild(copyConfirmation);
            setTimeout(() => {
                copyConfirmation.remove();
            }, 2000);
        }).catch((err) => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy the link. Please try manually.');
        });
    });

    // Event listener for "Close" button
    document.getElementById('close-alert').addEventListener('click', () => {
        alertBox.remove();
    });

    // Optional: Close modal when clicking outside the modal content
    alertBox.addEventListener('click', (e) => {
        if (e.target === alertBox) {
            alertBox.remove();
        }
    });
});
