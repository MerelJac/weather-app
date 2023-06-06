var submitBtn = document.querySelector('input[name="submit-button');
var locationInput = document.querySelector('input[name="location-input"]');
var currentWeatherSection = document.querySelector("#currentWeather");
var futureWeatherSection = document.querySelector("#futureWeather");

var apiKey = "17476851cd3efca9f4c619dbaa03a7d6";
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

function processData() {
// get input from search bar
var input = locationInput.value;
console.log(input);
// convert city name to lat lon
fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + input + '&limit=1&appid=' + apiKey)
.then(function (locationResponse) {
    return locationResponse.json()})
    .then(function (locationData) {
        console.log(locationData);
        var lat = locationData[0].lat;
        var lon = locationData[0].lon;
        // current weather 
        fetch('https://api.openweathermap.org/data/2.5/weather?lat='+ lat+ '&lon='+lon+'&units=imperial&appid=' + apiKey)
            .then(function(currentResponse){
                return currentResponse.json()})
                .then(function (currentData){
                    // add city name 
                    const currentName = currentData.name;
                    const currentIcon = currentData.weather[0].icon;
                    const iconUrl = 'https://openweathermap.org/img/wn/'+ currentIcon +'.png';
                    const currentTemp = JSON.stringify(currentData.main.feels_like);
                    const currentHumidity = JSON.stringify(currentData.main.humidity);
                    const currentWindSpeed = JSON.stringify(currentData.wind.speed);
                    //print to page
                    currentWeatherSection.innerHTML += `<p>${currentName}</p><img src="${iconUrl}" alt="weatherIconCurrent"><p>Temp: ${currentTemp}</p><p>Humidity: ${currentHumidity}</p>Wind Speed: ${currentWindSpeed}</p>`;})
        // needs the http or you will get a CORS error // 5 day weather
            fetch('http://api.openweathermap.org/data/2.5/forecast?lat='+ lat + '&lon='+ lon + '&limit=5&units=imperial&appid=' + apiKey)
                .then(function (forcastResponse){
                return forcastResponse.json()})
                .then(function(forcastData) {
                console.log(forcastData);
                // add print data here
                //add day value 
                const forcastIcon = forcastData.list[0].weather[0].icon;
                const forcastIconUrl = 'https://openweathermap.org/img/wn/'+ forcastIcon +'.png';
                const forcastTemp = JSON.stringify(forcastData.list[0].main.feels_like);
                const forcastHumidity = JSON.stringify(forcastData.list[0].main.humidity);
                const forcastWindSpeed = JSON.stringify(forcastData.list[0].wind.speed);
                //print to page
                futureWeatherSection.innerHTML += `<p>Days Away</p><img src="${forcastIconUrl}" alt="weatherIconCurrent"><p>Temp: ${forcastTemp}</p><p>Humidity: ${forcastHumidity}</p>Wind Speed: ${forcastWindSpeed}</p>`;})
                }) };

submitBtn.addEventListener("click", processData);

