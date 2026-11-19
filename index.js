const API_KEY = "9Km8ghrRWGCtRzNnbFbBrgDdbHNDMHkFDn8jCJ7d"
const ENDPOINT = "https://api.nasa.gov/planetary/apod";

const imageContainer = document.getElementById("current-image-container");
const inputDate = document.getElementById("search-input");
const searchHistory = document.getElementById("search-history");
const searchForm = document.getElementById("search-form");

const img = document.createElement("img");
const title = document.createElement("h2");
const paragraph = document.createElement("p");

imageContainer.append(img, title, paragraph);

async function fetchRequest(date) {
    const response = await fetch(
        `${ENDPOINT}?date=${date}&api_key=${API_KEY}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch NASA APOD data");
    }

    return await response.json();
}

function displayImage(data) {
    img.src = data.url;
    img.alt = data.title;

    title.innerText = data.title;
    paragraph.innerText = data.explanation;
}

async function getCurrentImageOfTheDay() {
    try {
        const date = new Date().toISOString().split("T")[0];
        const data = await fetchRequest(date);

        displayImage(data);
    } catch (error) {
        console.error(error);
    }
}

async function getImageOfTheDay(date) {
    try {
        if (!date) return;

        const data = await fetchRequest(date);

        displayImage(data);
        inputDate.value = date;

        saveSearch(date);
    } catch (error) {
        console.error(error);
        alert("Unable to fetch image. Please check the selected date.");
    }
}

function saveSearch(date) {
    let history = JSON.parse(localStorage.getItem("search-history")) || [];

    // Avoid duplicate dates
    history = history.filter(item => item !== date);

    // Add latest searched date at the beginning
    history.unshift(date);

    localStorage.setItem("search-history", JSON.stringify(history));

    addSearchToHistory();
}

function addSearchToHistory() {
    const history = JSON.parse(localStorage.getItem("search-history")) || [];

    searchHistory.innerHTML = "";

    const list = document.createElement("ul");

    history.forEach((date) => {
        const item = document.createElement("li");
        const link = document.createElement("a");

        link.innerText = date;
        link.href = "#";

        link.addEventListener("click", (e) => {
            e.preventDefault();
            getImageOfTheDay(date);
        });

        item.appendChild(link);
        list.appendChild(item);
    });

    searchHistory.appendChild(list);
}

// Form submission
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    getImageOfTheDay(inputDate.value);
});

// Initial page load
getCurrentImageOfTheDay();
addSearchToHistory();
