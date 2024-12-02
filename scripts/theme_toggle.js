// scripts/theme_toggle.js
document.addEventListener('DOMContentLoaded', () => {
    function setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.body.classList.add('dark');
            document.getElementById('theme-icon').classList.remove('fa-moon');
            document.getElementById('theme-icon').classList.add('fa-sun');
        } else {
            document.documentElement.classList.remove('dark');
            document.body.classList.remove('dark');
            document.getElementById('theme-icon').classList.remove('fa-sun');
            document.getElementById('theme-icon').classList.add('fa-moon');
        }
    }

    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('color-theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }

    // Theme toggle button
    const themeToggleBtn = document.getElementById('theme-toggle');
    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark');
        if (isDark) {
            setTheme('light');
            localStorage.setItem('color-theme', 'light');
        } else {
            setTheme('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    });
});