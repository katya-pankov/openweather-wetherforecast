// Student: Katya Pankov


// Declare Variables
const weatherContent = document.querySelector('#weather');
const API_KEY = '3905334dd8b9f286b63fc25068997e36';
const seattleApiUrl = fetch(`http://pro.openweathermap.org/data/2.5/forecast/daily?zip=98101&appid=${API_KEY}&units=imperial`);
const seattleApiUrl2 = fetch(`http://api.openweathermap.org/data/2.5/weather?zip=98101&appid=${API_KEY}&units=imperial`);
const seattleApiUrl3 = fetch(`http://pro.openweathermap.org/data/2.5/forecast/hourly?zip=98101&appid=${API_KEY}&units=imperial`);


// On first load display Seattle weathaer
document.getElementById("zip").value = "98101";
document.getElementById("city").innerHTML = '<i class="fa-sharp fa-solid fa-location-dot"></i> Seattle, US';
// fetch daily forecast for Seattle
fetch(`http://pro.openweathermap.org/data/2.5/forecast/daily?zip=98101&appid=${API_KEY}&units=imperial`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        getFiveDayForecast(data);
        getFiveDayForecast(data);
        const days = document.querySelectorAll('[data-weather-day]');
        const weather_data = document.querySelector('[data-weather-data]');
        days.forEach(day => {
            day.addEventListener('click', () => {
                // weather_data.style.background = 'linear-gradient(45deg, #222d40ae, #020406ae)';
                weather_data.style.border = '1px solid #222d40ae !important';
                // get the index of the day
                const dataIndex = parseInt(day.getAttribute('data-day-index'));
                showSummary(data, dataIndex);
            });
            day.addEventListener('mouseout', () => {
                // weather_data.style.background = 'transparent';
            });
        });

    }).catch((e) => {
        console.log(`This error occurred: ${e}`);
    });
// fetch current weather for Seattle
fetch(`http://api.openweathermap.org/data/2.5/weather?zip=98101&appid=${API_KEY}&units=imperial`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        getCurrentWeather(data);
        // showSummary(data, 0);
    }).catch((e) => {
        console.log(`This error occurred: ${e}`);
    });
// fetch hourly forecast for Seattle
fetch(`http://pro.openweathermap.org/data/2.5/forecast/hourly?zip=98101&appid=${API_KEY}&units=imperial`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        getHourlyWeather(data);
    }).catch((e) => {
        console.log(`This error occurred: ${e}`);
    });


// get the latitude and longitude of the zip code
const getLatLon = (data, zipCode) => {
    // Check to see if an error occurred
    if (data.cod == '400' || data.cod == '404' || data.cod == '401' || zipCode.trim() == '') {
        // Show the initially hidden div
        weatherContent.style.display = 'block';
        weatherContent.innerHTML = 'Please enter a valid Zip Code';
        return; // exit
    } else {
        // return an array of the latitude and longitude
        return [data.lat, data.lon];
    }
};


// Function to get the current weather given the data and zip code
const getCurrentWeather = (data) => {
    // console.log(data);
    // Check to see if the OpenWeather API returned an error
    if (data.cod == '400' || data.cod == '404' || data.cod == '401') {
        // show the initially hidden div
        weatherContent.style.display = 'block';
        weatherContent.innerHTML = 'Please enter a valid Zip Code';
        return; // exit
    }
    // let day = document.querySelector('#date'); // create a p element
    let date = new Date(data.dt * 1000);
    // let dateStr = date.toLocaleDateString('en-us');
    let timeStr = date.toLocaleTimeString('en-us');
    // declare an array of days of the week
    let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // declare an array of months
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    // get today's date 
    let dayOfWeek = daysOfWeek[date.getDay()];
    let month = months[date.getMonth()];
    let dayOfMonth = date.getDate();
    let year = date.getFullYear();
    let dayOfWeekParagraph = document.querySelector('#dayOfWeek');
    dayOfWeekParagraph.innerHTML = dayOfWeek;
    let monthDayYearParagraph = document.querySelector('#monthDayYear');
    monthDayYearParagraph.innerHTML = month + ' ' + dayOfMonth + ', ' + year;
    let city = document.querySelector('#city');
    city.innerHTML = '<i class="fa-sharp fa-solid fa-location-dot"></i> ' + data.name + ', ' + data.sys.country;
    let todayCondition = document.querySelector('#todayCondition');
    todayCondition.innerHTML = data.weather[0].description;
    let time = document.querySelector('#time');
    time.innerHTML = '<i class="fa-regular fa-clock"></i> ' + timeStr;
    // weather icon large
    let icon = document.querySelector("#weather-icon-large");
    icon.setAttribute('src', `img/${data.weather[0].icon}.png`);
    let bigTemperatureDigits = document.querySelector(".digits");
    bigTemperatureDigits.innerHTML = Math.floor(data.main.temp) + 'F';
    // feels like
    let feelsLike = document.querySelector('#feelsLike');
    feelsLike.innerHTML = Math.floor(data.main.feels_like) + '°F';
    // sunrise
    let sunrise = document.querySelector('#sunrise');
    let sunriseDate = new Date(data.sys.sunrise * 1000);
    let sunriseTime = sunriseDate.toLocaleTimeString('en-us', { hour: 'numeric', minute: 'numeric' });
    sunrise.innerHTML = sunriseTime;
    // sunset
    let sunset = document.querySelector('#sunset');
    let sunsetDate = new Date(data.sys.sunset * 1000);
    let sunsetTime = sunsetDate.toLocaleTimeString('en-us', { hour: 'numeric', minute: 'numeric' });
    sunset.innerHTML = sunsetTime;
    // wind
    let wind = document.querySelector('#wind-n');
    wind.innerHTML = Math.floor(data.wind.speed) + ' mph';
};


// function to get the hourly weather
const getHourlyWeather = (data) => {
    for (let i = 0; i <= 6; i++) {
        document.querySelector(".fd-row").style.display = 'block';
        let hourlyDateTime = new Date(data.list[i].dt * 1000);
        document.getElementById("future-time-" + (i + 1)).innerHTML = hourlyDateTime.toLocaleTimeString('en-us', { hour: 'numeric' });
        document.getElementById("temp" + (i + 1)).innerHTML = Math.floor(data.list[i].main.temp) + '°F';
        document.getElementById("today-icon-" + (i + 1)).setAttribute('src', "img/" + data.list[i].weather[0].icon + ".png");
        // document.getElementById("today-description-" + (i + 1)).innerHTML = data.list[i].weather[0].description;
    }
};

// function to get the five days forecast
const getFiveDayForecast = (data) => {
    for (let i = 0; i <= 5; i++) {
        let forecastDateTime = new Date(data.list[i].dt * 1000);
        document.getElementById("fw-date-" + (i + 1)).innerHTML = forecastDateTime.toLocaleDateString('en-us', { weekday: 'short', day: 'numeric', month: 'short' });
        document.getElementById("fw-img-" + (i + 1)).setAttribute('src', "img/" + data.list[i].weather[0].icon + ".png");
        document.getElementById("fw-d-" + (i + 1)).innerHTML = Math.floor(data.list[i].temp.day) + '°F';
    };
};


// popup summary with wether details
const showSummary = (data, dayIndex) => {
    console.log(data);
    const summary = document.querySelector('.fd-row');
    // Retrieve the weather data for the selected day
    const weatherData = data.list[dayIndex];
    // Extract the necessary information from the weather data
    const date = new Date(weatherData.dt * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    const highTemperature = Math.floor(weatherData.temp.max);
    const lowTemperature = Math.floor(weatherData.temp.min);
    const description = weatherData.weather[0].description;
    const sunrise = new Date(weatherData.sunrise * 1000).toLocaleTimeString('en-US');
    const sunset = new Date(weatherData.sunset * 1000).toLocaleTimeString('en-US');
    const humidity = weatherData.humidity;
    const pressure = weatherData.pressure;
    const windSpeed = weatherData.speed;
    // Update the content of the summary element
    summary.innerHTML = `
    <div class="container mb-5">
    <div class="row">
    <div class="col-12 opacity rounded-top">
    <p class="pt-2 custom-yellow-font fw-bold">Summary for ${date}</p>
    </div>
    </div>
    <div class="row bg-custom rounded-bottom pt-1">
    <div class="col-6">    
        <p class="fw-bold">${description}</p>
        <p><img src="img/Heat.png" height="17" alt="high temperature icon"> High: ${highTemperature}°F</p>
        <p><img src="img/Cold.png" height="17" alt="low tempretaure icon"> Low: ${lowTemperature}°F</p>
        <p><img src="img/humid.png" height="17" alt="humidity icon"> Humidity: ${humidity}%</p>
    </div>
    <div class="col-6">
        <p><img src="img/sunrise.png" height="17" alt="sunrise icon"> Sunrise:  ${sunrise}</p>
        <p><img src="img/sunset.png" height="17" alt="sunset icon"> Sunset: ${sunset}</p>
        <p><img src="img/pressure.png" height="17" alt="pressure icon"> Pressure: ${pressure} hPa</p>
        <p><img src="img/wind.png" height="17" alt="swind icon"> Wind Speed: ${windSpeed} mph</p>
    </div>
    </div>
    </div>
    </div>
    `;
};



document.querySelector('#getWeather').addEventListener('click', () => {
    // location.href = "index.html";
    weatherContent.innerHTML = ''; // clear out prior results
    let zipCode = document.querySelector('#zip').value;
    // First call the geolocation API to get the latitude and longitude of the zip code
    let url = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${API_KEY}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Call the getLatLon function which returns an array
            const geo = getLatLon(data, zipCode);
            // Now get current weather data
            url = `http://api.openweathermap.org/data/2.5/weather?lat=${geo[0]}&lon=${geo[1]}&appid=${API_KEY}&units=imperial`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    // Call getWeather function
                    getCurrentWeather(data, geo[0], geo[1]);
                }).catch((e) => {
                    console.log(`This error occurred: ${e}`);
                });
            // daily forecast data
            url = `http://pro.openweathermap.org/data/2.5/forecast/daily?lat=${geo[0]}&lon=${geo[1]}&appid=${API_KEY}&units=imperial`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    // console.log(data.list[0]);
                    getFiveDayForecast(data);
                    const days = document.querySelectorAll('[data-weather-day]');
                    const weather_data = document.querySelector('[data-weather-data]');
                    days.forEach(day => {
                        day.addEventListener('click', () => {
                            // weather_data.style.background = 'linear-gradient(45deg, #222d40ae, #020406ae)';
                            weather_data.style.border = '1px solid #222d40ae !important';
                            // get the index of the day
                            const dataIndex = parseInt(day.getAttribute('data-day-index'));
                            showSummary(data, dataIndex);
                        });
                        day.addEventListener('mouseout', () => {
                            // weather_data.style.background = 'transparent';
                        });
                    });
                }).catch((e) => {
                    console.log(`This error occurred: ${e}`);
                });
            // hourly forecast data
            url = `http://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${geo[0]}&lon=${geo[1]}&appid=${API_KEY}&units=imperial`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    getHourlyWeather(data);
                }).catch((e) => {
                    console.log(`This error occurred: ${e}`);
                });
        }).catch((e) => {
            console.log(`This error occurred: ${e}`);
        });
});









