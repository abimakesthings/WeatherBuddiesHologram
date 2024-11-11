const weatherApiUrl = 'https://api.weather.gov/gridpoints/BOU/71,60/forecast';

// Fetch weather data
async function fetchWeather() {
  try {
    const response = await fetch(weatherApiUrl);
    const data = await response.json();

    // Get today's forecast
    const nowForecast = data.properties.periods[0];
    const shortForecast = nowForecast.shortForecast;
    const isDaytime = nowForecast.isDaytime;
    let tempAfternoon;
    let tempNight;

    // At night, period 0 switches from day to night. 
    if(isDaytime == true) {
        tempAfternoon = nowForecast.temperature;
        tempNight = data.properties.periods[1].temperature;
    } else {
        tempNight = nowForecast.temperature;
        document.getElementById('temp-high-section').style.display = 'none';
        document.getElementById('short-forecast').style.marginTop = '2px';
        document.querySelectorAll('.right-column > div').forEach(element => {element.style.padding = '2px';});
        document.querySelectorAll(".label").forEach(element => {element.style.display = 'none';});
    }

    // Update DOM elements with weather data
    document.getElementById('day-of-week').textContent = getDayOfWeek();
    document.getElementById('short-forecast').textContent = `${shortForecast}`;
    document.getElementById('temp-high').textContent = `${tempAfternoon}`;
    document.getElementById('temp-low').textContent = `${tempNight}`;

    // Set the weather icon
    setWeatherIcon(shortForecast);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

// Function to set weather icon and change video based on current weather
function setWeatherIcon(forecast) {
    const iconElement = document.getElementById("weather-icon");
    const videoElement = document.querySelector(".background-video")
  
    // Check forecast description and set appropriate icon
    if (forecast.toLowerCase().includes("sunny")) {
        iconElement.src = "icons/sunny.png";
        videoElement.src = "videos/sunny.mp4";
        document.body.classList.add('sunny');
        document.body.classList.remove('cloudy', 'rainy', 'clear');
    } else if (forecast.toLowerCase().includes("cloudy") || 
               forecast.toLowerCase().includes("fog")) {
        iconElement.src = "icons/cloudy.png";
        videoElement.src = "videos/cloudy.mp4";
        document.body.classList.add('cloudy');
        document.body.classList.remove('sunny', 'rainy', 'clear');
    } else if (forecast.toLowerCase().includes("rain") || 
               forecast.toLowerCase().includes("storm") || 
               forecast.toLowerCase().includes("thunderstorm") || 
               forecast.toLowerCase().includes("showers")) {
        iconElement.src = "icons/rainy.png";
        videoElement.src = "videos/rainy.mp4";
        document.body.classList.add('rainy');
        document.bodyremove('sunny', 'cloudy', 'clear');
    } else if (forecast.toLowerCase().includes("clear")) {
        iconElement.src = "icons/clear_night.png";
        videoElement.src = "videos/sunny.mp4";
        document.body.classList.add('sunny');
        document.body.classList.remove('cloudy', 'rainy', 'clear');
    } else {
        iconElement.src = "icons/sunny.png";
        videoElement.src = "videos/sunny.mp4";
        document.body.classList.add('sunny');
        document.body.classList.remove('cloudy', 'rainy', 'clear');
    }
}

// Get the current day of the week
function getDayOfWeek() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  return days[today.getDay()];
}

// Fetch weather data on page load
fetchWeather();

// Fetch weather data every 30 minutes (1800000 milliseconds = 30 minutes)
setInterval(fetchWeather, 1800000);