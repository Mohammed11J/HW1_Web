function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        document.body.classList.add(savedTheme);
        document.querySelectorAll('.container, .toggle-button, #quiz-content, #quiz-form, #responses').forEach(element => {
            element.classList.add(savedTheme);
        });

        const themeIcon = document.getElementById('theme-icon');
        if (savedTheme === 'dark-mode') {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    }
}

function toggleTheme() {
    const elementsToToggle = document.querySelectorAll('body, .container, .toggle-button, #quiz-content, #quiz-form, #responses');
    elementsToToggle.forEach(element => {
        element.classList.toggle('dark-mode');
    });

    const themeIcon = document.getElementById('theme-icon');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        localStorage.setItem('theme', '');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();

    const themeToggleButton = document.getElementById('theme-toggle');
    themeToggleButton.addEventListener('click', () => {
        toggleTheme();
    });
});
