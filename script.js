console.log("script attached");

//important variables
var apiKey = "8582a065f7742faf6e03f6c7d4af352c";
var latitude;
var longitude;

//html elements
var searchInput = document.getElementById("search-box");
var searchBtn = document.getElementById("search-btn");
var cityContainer = document.getElementById("city-container");
var forecastContainer = document.getElementById("forecast-container");
var fivedayContainer = document.getElementById("fiveday-container");

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

        var latitude = location[0].lat;
        var longitude = location[0].lon;

        getDataAPI();

    //api for data call
    function getDataAPI() {
    var requestURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey;

    fetch(requestURL)
        .then(  function(reponse) {
            return reponse.json();
        })
        .then(  function(data) {
            console.log("LOCATION DATA");
            console.log(data);
        })
    } //end getDataAPI

    }) //end fetch for location

}//end getLocationAPI

}//end grabSearch


