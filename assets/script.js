var submitBtn = document.querySelector('#submit-button');
var regenBtn =  document.querySelector('#regenerateButton');
var locationInput = document.querySelector('input[name="location-input"]');
var currentWeatherSection = document.querySelector("#currentWeather");
var futureWeatherSection = document.querySelector("#futureWeather");
var savedCitiesSection = document.querySelector(".saved-cities");
var savedCityButton;

var apiKey = "17476851cd3efca9f4c619dbaa03a7d6";
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

function processData() {
// get input from search bar
var input = locationInput.value;
// edit CSS Styling dynamically 
currentWeatherSection.style.display = "flex";
futureWeatherSection.style.display = "flex";
submitBtn.style.display = "none"
regenBtn.style.display = "flex";
locationInput.value = "";
locationInput.placeholder = "Enter city";
// convert city name to lat lon
fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + input + '&limit=1&appid=' + apiKey)
.then(function (locationResponse) {
    return locationResponse.json()})
    .then(function (locationData) {
        var lat = locationData[0].lat;
        var lon = locationData[0].lon;
        // current weather 
        fetch('https://api.openweathermap.org/data/2.5/weather?lat='+ lat+ '&lon='+lon+'&units=imperial&appid=' + apiKey)
            .then(function(currentResponse){
                return currentResponse.json()})
                .then(function (currentData){
                    // add city name 
                    var today = dayjs();
                    var currentDate = today.format('ddd, MMMM D');
                    const currentName = currentData.name;
                    const currentIcon = currentData.weather[0].icon;
                    const iconUrl = 'https://openweathermap.org/img/wn/'+ currentIcon +'.png';
                    const currentTemp = Math.round(JSON.stringify(currentData.main.feels_like));
                    const currentHumidity = JSON.stringify(currentData.main.humidity);
                    const currentWindSpeed = Math.round(JSON.stringify(currentData.wind.speed));
                    // print to page
                    currentWeatherSection.innerHTML += `<div class="current"><h2 id="currentCityName">${currentName}</h2><p>${currentDate}</p><img id="weatherIcon" src="${iconUrl}" alt="weatherIconCurrent"></div><div class="infoCurrent"><p>Temp: ${currentTemp}\u00B0F</p><p>Humidity: ${currentHumidity}</p>Wind Speed: ${currentWindSpeed} mph</p></div>`;})
            // needs the http or you will get a CORS error // 5 day weather
            fetch('https://api.openweathermap.org/data/2.5/forecast?lat='+ lat + '&lon='+ lon + '&limit=5&units=imperial&appid=' + apiKey)
                .then(function (forcastResponse){
                return forcastResponse.json()})
                .then(function(forcastData) {
                //add day value 
                for (var i = 0; i < 100; i++) {
                    // modulus only pulls wanted date intervals 
                    if (i % 8 === 0  && i <= 40) {
                const pulledDate = forcastData.list[i].dt_txt;
                // creates date variable 
                var date = new Date(pulledDate);
                var month = date.toLocaleString('default', {month: 'long'});
                var day = date.getDate();
                var forcastDate = `${month} ${day}`;
                const forcastIcon = forcastData.list[i].weather[0].icon;
                const forcastIconUrl = 'https://openweathermap.org/img/wn/'+ forcastIcon +'.png';
                const forcastTemp = Math.round(JSON.stringify(forcastData.list[i].main.feels_like));
                const forcastHumidity = JSON.stringify(forcastData.list[i].main.humidity);
                const forcastWindSpeed = Math.round(JSON.stringify(forcastData.list[i].wind.speed));
                //print to page
                futureWeatherSection.innerHTML += `<div id="forcastDay"><p>${forcastDate}</p><img id="weatherIcon" src="${forcastIconUrl}" alt="weatherIconCurrent"><p>Temp: ${forcastTemp}\u00B0F</p><p>Humidity: ${forcastHumidity}</p>Wind Speed: ${forcastWindSpeed} mph</p></div>`;}}
                })})};
function localStorageRegenerateProcessData() {
    // save text from input to local storage
    cityInput = $("#currentCityName").text();
    localStorage.setItem("city", cityInput);
    // create button from location storage and print to page
    savedCitiesSection.innerHTML += `<button id="savedCity">${localStorage.getItem("city")}</button>`;
    // assign a new value to the already created variable
    savedCityButton = document.querySelector("#savedCity");
    // create event listener in the appropriate function 
    savedCityButton.addEventListener("click", runSavedCity);
    // clear old sections
    currentWeatherSection.innerHTML = "";
    futureWeatherSection.innerHTML = "";
    // run function again 
    processData();
    // CSS Styling
    savedCitiesSection.style.display = "flex";
    locationInput.value = "";
    locationInput.placeholder = "Enter city";
}


function runSavedCity() {
    // clear old sections
    currentWeatherSection.innerHTML = "";
    futureWeatherSection.innerHTML = "";
    console.log("clicked");
}


submitBtn.addEventListener("click", processData);
regenBtn.addEventListener("click", localStorageRegenerateProcessData);

