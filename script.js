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
var todayIconEl = document.getElementById("today-icon");
var todayDateEl = document.getElementById("today-date");
var todayTemperatureEl = document.getElementById("today-temperature");
var todayWindEl = document.getElementById("today-wind");
var todayHumidEl = document.getElementById("today-humid");

var clearBtn = document.getElementById("clear");
var aButton = document.getElementsByClassName("itsabutton");

//event listeners
searchBtn.addEventListener('click', grabSearch);
clearBtn.addEventListener('click', clearLS);
cityContainer.addEventListener('click', aFunction);

//Local storage
var lsData = JSON.parse(localStorage.getItem("cityNames"));
console.log(lsData);
if (lsData == null) {
    lsData = [];
}
else {
    console.log(lsData);
for (let i = 0; i < lsData.length; i++) {
    var cityName = lsData[i];
    var cityBtn = document.createElement("button");
    cityBtn.textContent = cityName;
    //cityBtn.setAttribute("class","itsabutton");
    cityBtn.setAttribute("data-city",cityName);
    cityBtn.classList.add("itsbutton");
    cityContainer.appendChild(cityBtn);
}
}

function clearLS(){
    localStorage.clear();
    //clear any persisting data on the screen too
    while (cityContainer.lastElementChild) {
        cityContainer.removeChild(cityContainer.lastElementChild);
      }
}

//make things happen when the search button gets clicked
function grabSearch (city) {

    var searchText;
    console.log(city);

    if (typeof city !== "string"){
        searchText = searchInput.value;
    }
    else {
        searchText = city;
    }

    console.log("USER INPUT");
    console.log(searchText);

    getLocationAPI(searchText);

    //api for locataion call
    function getLocationAPI(searchText) {
    var locationURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchText +"&limit=1&appid=" + apiKey;
    console.log(locationURL);

    fetch(locationURL)
    .then(  function(reponse) {
        return reponse.json();
    })
    .then(  function(location) {

        console.log("LATITUDE AND LONGITUDE");
        console.log(location);

                    //store new city data
                    if (lsData.includes(searchText)) {
                        lsData = lsData;
                    }
                    else {
                        lsData.push(searchText);
                    }
                console.log(lsData);
                    localStorage.setItem("cityNames", JSON.stringify(lsData));

                    var cityBtn = document.createElement("button");
                    cityBtn.textContent = searchText;
                    cityBtn.setAttribute("class","itsabutton");
                    cityContainer.appendChild(cityBtn);
                

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

            var newSRC = "https://openweathermap.org/img/wn/"+ data.list[0].weather[0].icon +".png";
            cityNameEl.textContent = data.city.name;
            todayIconEl.src = newSRC;
            todayDateEl.textContent = date;
            todayTemperatureEl.textContent = "Temperature: " + data.list[0].main.temp + " F";
            todayWindEl.textContent = "Wind: " + data.list[0].wind.speed + " MPH";
            todayHumidEl.textContent = "Humidity: " + data.list[0].main.humidity + " %";
        
            //delete any previous 5day data first
            while (fivedayContainer.lastElementChild) {
              fivedayContainer.removeChild(fivedayContainer.lastElementChild);
            }

            //lets dynamically create elements for each day
            for (let i = 1; i < 6; i++) {

                console.log("creating element");
                var fivedayEl = document.createElement("div");
                var fivedayIconEl = document.createElement("img");
                var fivedayDateEl = document.createElement("h1");
                var fivedayTempEl = document.createElement("p");
                var fivedayWindEl = document.createElement("p");
                var fivedayHumidityEl = document.createElement("p");

                //get the nextday date
                var nextDay = dayjs().add(i + 1, 'day').format('(MM/DD/YYYY)');
                console.log(nextDay);
                //get the next icon src
                newSRC = "https://openweathermap.org/img/wn/"+ data.list[i].weather[0].icon +".png";
                fivedayIconEl.src = newSRC;

                fivedayDateEl.textContent = nextDay;
                fivedayTempEl.textContent = "Temp: " + data.list[i].main.temp;
                fivedayWindEl.textContent = "Wind: " + data.list[i].wind.speed;
                fivedayHumidityEl.textContent = "Humidity: " + data.list[i].main.humidity; 

                fivedayEl.appendChild(fivedayDateEl);
                fivedayEl.appendChild(fivedayIconEl);
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

//make the Previous Search buttons work

function aFunction (event) {
    var btnEl = event.target;
    var btnText = btnEl.getAttribute("data-city");
    console.log("USER INPUT");
    console.log(btnText);

    grabSearch(btnText);
}
