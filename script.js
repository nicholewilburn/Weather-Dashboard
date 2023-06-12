console.log("script attached");

//important variables
var apiKey = "8582a065f7742faf6e03f6c7d4af352c";
var latitude;
var longitude;

//getting the date
var date = dayjs().format('(MM/DD/YYYY)');

//html elements
var searchInput = document.getElementById("search-box");
var searchBtn = document.getElementById("search-btn");
var cityContainer = document.getElementById("city-container");
var forecastContainer = document.getElementById("forecast-container");
var fivedayContainer = document.getElementById("fiveday-container");

var cityNameEl = document.getElementById("city-name");
var todayDateEl = document.getElementById("today-date");
var todayTemperatureEl = document.getElementById("today-temperature");
var todayWindEl = document.getElementById("today-wind");
var todayHumidEl = document.getElementById("today-humid");

//event listeners
searchBtn.addEventListener('click', grabSearch);

//make things happen when the search button gets clicked
function grabSearch () {

    var searchText = searchInput.value;

    console.log("USER INPUT");
    console.log(searchText);

    getLocationAPI();

    //api for locataion call
    function getLocationAPI() {
    var locationURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchText +"&limit=1&appid=" + apiKey;

    fetch(locationURL)
    .then(  function(reponse) {
        return reponse.json();
    })
    .then(  function(location) {

        console.log("LATITUDE AND LONGITUDE");
        console.log(location);

        if (location.length == 0) {
            alert("City not found.");
        }
        else {
        var latitude = location[0].lat;
        var longitude = location[0].lon;
        getDataAPI();
        }

    //api for data call
    function getDataAPI() {
    var requestURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey + "&units=imperial";

    fetch(requestURL)
        .then(  function(reponse) {
            if (reponse.status >= 400) {
                alert("Bad Response. Try again later.");
            }
            else {
            return reponse.json();
            }
        })
        .then(  function(data) {
            console.log("LOCATION DATA");
            console.log(data);

            cityNameEl.textContent = data.city.name;
            todayDateEl.textContent = date;
            todayTemperatureEl.textContent = "Temperature: " + data.list[0].main.temp;
            todayWindEl.textContent = "Wind: " + data.list[0].wind.speed;
            todayHumidEl.textContent = "Humidity: " + data.list[0].main.humidity;
        
            //lets dynamically create elements for each day
            for (let i = 0; i < 5; i++) {

                console.log("creating element");
                var fivedayEl = document.createElement("div");
                var fivedayDateEl = document.createElement("h1");
                var fivedayTempEl = document.createElement("p");
                var fivedayWindEl = document.createElement("p");
                var fivedayHumidityEl = document.createElement("p");

                //get the nextday date
                var nextDay = dayjs().add(i + 1, 'day').format('(MM/DD/YYYY)');
                console.log(nextDay);

                fivedayDateEl.textContent = nextDay;
                fivedayTempEl.textContent = "Temp: " + data.list[i].main.temp;
                fivedayWindEl.textContent = "Wind: " + data.list[i].wind.speed;
                fivedayHumidityEl.textContent = "Humidity: " + data.list[i].main.humidity; 

                fivedayEl.appendChild(fivedayDateEl);
                fivedayEl.appendChild(fivedayTempEl);
                fivedayEl.appendChild(fivedayWindEl);
                fivedayEl.appendChild(fivedayHumidityEl);

                fivedayContainer.appendChild(fivedayEl);

            }//end for loop

        })
    } //end getDataAPI

    }) //end fetch for location

}//end getLocationAPI

}//end grabSearch
