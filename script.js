const apiKey = 'YOUR_API_KEY';
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const autocompleteDropdown = document.getElementById('autocompleteDropdown');
const background = document.getElementById('background');
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;

// Dark Mode Toggle
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    themeIcon.classList.toggle('fa-moon');
    themeIcon.classList.toggle('fa-sun');
});

// Event Listeners
cityInput.addEventListener('input', handleInput);
searchBtn.addEventListener('click', handleSearch);
autocompleteDropdown.addEventListener('click', handleAutocompleteClick);

async function handleInput() {
    const query = cityInput.value.trim();
    if (query.length > 2) {
        const suggestions = await fetchCitySuggestions(query);
        displayAutocompleteSuggestions(suggestions);
    } else {
        autocompleteDropdown.style.display = 'none';
    }
}

async function handleSearch() {
    const city = cityInput.value;
    if (city) {
        const weatherData = await fetchWeather(city);
        if (weatherData) displayWeather(weatherData);
    }
}

function handleAutocompleteClick(e) {
    if (e.target.tagName === 'DIV') {
        cityInput.value = e.target.textContent;
        autocompleteDropdown.style.display = 'none';
        handleSearch();
    }
}

// API Functions
async function fetchCitySuggestions(query) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return [];
    }
}

async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`);
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return data;
    } catch (error) {
        alert(error.message);
        return null;
    }
}

// Display Functions
function displayWeather(data) {
    const { current, location } = data;

    document.getElementById('cityName').textContent = location.name;
    document.getElementById('temperature').textContent = `${current.temp_c}°C`;
    document.getElementById('humidity').textContent = `${current.humidity}%`;
    document.getElementById('windSpeed').textContent = `${current.wind_kph} km/h`;
    document.getElementById('feelsLike').textContent = `${current.feelslike_c}°C`;
    document.getElementById('uvIndex').textContent = current.uv;
    document.getElementById('weatherIcon').className = `weather-icon wi wi-${getWeatherIcon(current.condition.code)}`;

    setWeatherBackground(current.condition.text);
}

// Weather Icon Mapper
function getWeatherIcon(code) {
    const iconMap = {
        1000: 'day-sunny',
        1003: 'day-cloudy',
        1006: 'cloud',
        1009: 'cloudy',
        1030: 'fog',
        1063: 'rain',
        1066: 'snow',
        1069: 'sleet',
        1072: 'sleet',
        1087: 'thunderstorm',
        1114: 'snow-wind',
        1117: 'snow-wind',
        1135: 'fog',
        1147: 'fog',
        1150: 'rain-mix',
        1153: 'rain-mix',
        1168: 'rain-mix',
        1171: 'rain',
        1180: 'rain',
        1183: 'rain',
        1186: 'rain',
        1189: 'rain',
        1192: 'rain',
        1195: 'rain',
        1198: 'rain',
        1201: 'rain',
        1204: 'sleet',
        1207: 'sleet',
        1210: 'snow',
        1213: 'snow',
        1216: 'snow',
        1219: 'snow',
        1222: 'snow',
        1225: 'snow',
        1237: 'hail',
        1240: 'showers',
        1243: 'showers',
        1246: 'rain',
        1249: 'sleet',
        1252: 'sleet',
        1255: 'snow',
        1258: 'snow',
        1261: 'hail',
        1264: 'hail',
        1273: 'thunderstorm',
        1276: 'thunderstorm',
        1279: 'snow-thunderstorm',
        1282: 'snow-thunderstorm'
    };
    return iconMap[code] || 'day-sunny';
}

// Background Animation
function setWeatherBackground(condition) {
    background.className = 'background';
    background.innerHTML = '';

    const weatherType = condition.toLowerCase();
    if (weatherType.includes('sun')) createSun();
    if (weatherType.includes('rain')) createRain();
    if (weatherType.includes('cloud')) createClouds();
    if (weatherType.includes('snow')) createSnow();
}

function createSun() {
    background.classList.add('sunny');
    const sun = document.createElement('div');
    sun.className = 'sun';
    background.appendChild(sun);
}

function createRain() {
    background.classList.add('rainy');
    for (let i = 0; i < 50; i++) {
        const raindrop = document.createElement('div');
        raindrop.className = 'raindrop';
        raindrop.style.left = Math.random() * 100 + '%';
        raindrop.style.animationDuration = Math.random() * 0.5 + 0.5 + 's';
        raindrop.style.animationDelay = Math.random() * 2 + 's';
        background.appendChild(raindrop);
    }
}

function createClouds() {
    background.classList.add('cloudy');
    for (let i = 0; i < 5; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.width = Math.random() * 200 + 100 + 'px';
        cloud.style.height = Math.random() * 50 + 30 + 'px';
        cloud.style.top = Math.random() * 50 + '%';
        cloud.style.animationDuration = Math.random() * 10 + 20 + 's';
        background.appendChild(cloud);
    }
}

function createSnow() {
    background.classList.add('snowy');
    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.left = Math.random() * 100 + '%';
        snowflake.style.animationDuration = Math.random() * 3 + 5 + 's';
        snowflake.style.animationDelay = Math.random() * 5 + 's';
        snowflake.style.opacity = Math.random();
        background.appendChild(snowflake);
    }
}
