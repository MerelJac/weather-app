var submitBtn = document.querySelector('#submit-button');
var regenBtn =  document.querySelector('#regenerateButton');
var locationInput = document.querySelector('input[name="location-input"]');
var currentWeatherSection = document.querySelector("#currentWeather");
var futureWeatherSection = document.querySelector("#futureWeather");
var savedCitiesSection = document.querySelector(".saved-cities");
var savedCityButton;

var apiKey = "17476851cd3efca9f4c619dbaa03a7d6";
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

function processData(newCity) {
// get input from search bar or info passed
var input = locationInput.value || newCity;
// edit CSS Styling dynamically 
currentWeatherSection.style.display = "flex";
futureWeatherSection.style.display = "flex";
submitBtn.style.display = "none"
regenBtn.style.display = "flex";
locationInput.value = "";
locationInput.placeholder = "Enter city";
// convert city name to lat lon
fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + input + '&limit=1&appid=' + apiKey)
.then(function (locationResponse) {
    return locationResponse.json()})
    .then(function (locationData) {
        // if city name is wrong and locationData is empty, hit this alter
        if (locationData.length === 0) {
            alert("City not found. Please try again");
            // reloads current URl 
            location.reload();
        }
        var lat = locationData[0].lat;
        var lon = locationData[0].lon;
        // current weather 
        fetch('https://api.openweathermap.org/data/2.5/weather?lat='+ lat+ '&lon='+lon+'&units=imperial&appid=' + apiKey)
            .then(function(currentResponse){
                return currentResponse.json()})
                .then(function (currentData){
                    var today = dayjs();
                    var currentDate = today.format('ddd, MMMM D');
                    const currentName = currentData.name;
                    const currentIcon = currentData.weather[0].icon;
                    const iconUrl = 'https://openweathermap.org/img/wn/'+ currentIcon +'.png';
                    const currentTemp = Math.round(JSON.stringify(currentData.main.feels_like));
                    const currentHumidity = JSON.stringify(currentData.main.humidity);
                    const currentWindSpeed = Math.round(JSON.stringify(currentData.wind.speed));
                    // print to page
                    currentWeatherSection.innerHTML += `<div class="current"><h2 id="currentCityName">${currentName}</h2><p>${currentDate}</p><img id="weatherIcon" src="${iconUrl}" alt="weatherIconCurrent"></div><div class="infoCurrent"><p>Temp: ${currentTemp}\u00B0F</p><p>Humidity: ${currentHumidity}</p><p>Wind Speed: ${currentWindSpeed} mph</p></div>`;})
            // needs the http or you will get a CORS error // 5 day weather
            fetch('https://api.openweathermap.org/data/2.5/forecast?lat='+ lat + '&lon='+ lon + '&limit=5&units=imperial&appid=' + apiKey)
                .then(function (forcastResponse){
                return forcastResponse.json()})
                .then(function(forcastData) {
                //add day value 
                for (var i = 0; i < 100; i++) {
                    // modulus only pulls wanted date intervals 
                    if (i % 8 === 0  && i < 40) {
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
                futureWeatherSection.innerHTML += `<div id="forcastDay"><p>${forcastDate}</p><img id="weatherIcon" src="${forcastIconUrl}" alt="weatherIconCurrent"><p>Temp: ${forcastTemp}\u00B0F</p><p>Humidity: ${forcastHumidity}</p><p>Wind Speed: ${forcastWindSpeed} mph</p></div>`;}}
                })})};
function localStorageRegenerateProcessData() {
    // save text from input to local storage
    var cityInput = $("#currentCityName").text();
    localStorage.setItem("city", [cityInput]);
    // create button from location storage and print to page
    savedCitiesSection.innerHTML += `<button class="savedCity" id=${localStorage.getItem("city")}>${localStorage.getItem("city")}</button>`;
    // assign a new value to the already created variable
    savedCityButton = document.getElementsByClassName("savedCity");
    // loop through all possible buttons with the same class
    // create event listener in the appropriate function 
    for (var i = 0; i < savedCityButton.length; i++) {
        // upon clicking, run this function  
    savedCityButton[i].addEventListener("click", function(){
        var closestButton = this.id;
        var closestID = closestButton.toString();
        runSavedCity(closestID);
    })};
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


function runSavedCity(cityName) {
    // clear old sections
    currentWeatherSection.innerHTML = "";
    futureWeatherSection.innerHTML = "";
    processData(cityName);
}


submitBtn.addEventListener("click", processData);
regenBtn.addEventListener("click", localStorageRegenerateProcessData);