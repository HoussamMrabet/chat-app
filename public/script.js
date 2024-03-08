// Icon elements
let sunIcon = document.querySelector(".sun");
let moonIcon = document.querySelector(".moon");

const userTheme = localStorage.getItem("theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Function to check and set initial theme
const checkTheme = () => {
    if (userTheme === "dark" || (!userTheme && systemTheme)) {
        document.documentElement.classList.add("dark");
        DarkReader.enable({
            brightness: 100,
            contrast: 90,
            sepia: 10
        });
    }
    else {
        document.documentElement.classList.remove("dark");
        DarkReader.disable();
    }
};

// Function to switch theme manually
const switchTheme = (e) => {
    e.preventDefault();
    if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
        DarkReader.disable();
    } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
        DarkReader.enable({
            brightness: 100,
            contrast: 90,
            sepia: 10
        });
    }
};

// Event listeners for icon clicks
sunIcon.addEventListener("click", switchTheme);
moonIcon.addEventListener("click", switchTheme);

// Invoke theme check on initial load
checkTheme();

