var submitBtn = document.querySelector('input[name="submit-button');
var locationInput = document.querySelector('input[name="location-input"]');
var apiKey = "17476851cd3efca9f4c619dbaa03a7d6";
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

function processData() {
// get input from search bar
var input = locationInput.value;
console.log(input);
// convert city name to lat lon
fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + input + '&limit=1&appid=' + apiKey)
.then(function (response) {
    return response.json()})
    .then(function (data) {
        console.log(data);
        var lat = data[0].lat;
        var lon = data[0].lon;
        // needs the http or you will get a CORS error 
        fetch('http://api.openweathermap.org/data/2.5/forecast?lat='+ lat + '&lon='+ lon + '&limit=5&units=imperial&appid=' + apiKey)
            .then(function (response){
            return response.json()})
            .then(function(data) {
            console.log(data);
            })
        })};

// enter city name into API 

// print contents to page


submitBtn.addEventListener("click", processData);

