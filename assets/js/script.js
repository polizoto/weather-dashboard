var cityFormEl = document.querySelector("#city-form");
var searchInputEl = document.querySelector("#search");
var searchHistoryEl = document.querySelector("#search-history");
var cityName = ""
var cityNotFound = false;
var $LATITUDE = ""
var $LONGITUDE = ""
var weather = {
  city: [],
  latitude: [],
  longitude: []
};

// Convert Unix Time to Date

// function timeConverter(UNIX_timestamp){
//   var date = new Date(UNIX_timestamp * 1000);
//   var months = ['1','2','3','4','5','6','7','8','9','10','11','12'];
//   var year = date.getFullYear();
//   var month = months[date.getMonth()];
//   var day = date.getDate();
//   var time = month + '/' + day + '/' + year;
//   return time;
// }
// console.log(timeConverter(1639760400));

// ####### Fetch API Function ####### //  

// var requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=35.7721&lon=-78.6386&units=imperial&cnt=1&exclude=minutely,hourly,alerts&appid=db8406e2438a3bda2d57fa0aaa4169c2'

// fetch(requestUrl)
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     console.log('Github Repo Issues \n----------');
//     console.log(data);
//     // console.log(data.daily[0].dt);
//   })

// fetch(requestUrl)
//   .then(function (response) {
//     if (response.ok) {
//    response.json()
//   .then(function (data) {
//     console.log('Github Repo Issues \n----------');
//     console.log(data);
//     // console.log(data.daily[0].dt);
//   })
// } else {
// //  alert("Error: " + city + " was not found. Try again.")
//  cityNotFound = true
// }
// });

// Check if city is found at the API and update history; if not return a warning message
              
var getCity = function (city) {
  var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=db8406e2438a3bda2d57fa0aaa4169c2'
  
  fetch(requestUrl).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('This city was not found');
    }
  })
  .then(function (data) {
    $LATITUDE = data.coord.lat
    $LONGITUDE = data.coord.lon
    searchInputEl.value = "";
    updateHistory(cityName) 
  })
  .catch((error) => { 
    searchInputEl.value = "";
    console.log(error)
    return alert("Error: " + city + " was not found. Try again.");
  });
}

var getWeather = function() {
  // if no "events" object is in localStorage, create a new object
  if (localStorage.getItem("weather")) {
      weather = JSON.parse(localStorage.getItem("weather"));
      for (let i = 0; i < weather.city.length; i++) {
        var cityEl = document.createElement("button");
        cityEl.classList = "search-results";
        cityEl.setAttribute("data-latitude", weather.latitude[i])
        cityEl.setAttribute("data-longitude", weather.longitude[i])
        cityEl.textContent = weather.city[i];
        searchHistoryEl.append(cityEl);  
      }
  }
}
  
var loadWeather = function() {
  var weather = {
    city: [],
    latitude: [],
    longitude: []
  };
  var row = $(searchHistoryEl)
  .children()
  $(row).each(function() {
    var name = $(this).text()
    var latitude = $(this).attr("data-latitude")
    var longitude = $(this).attr("data-longitude")
    weather.city.push(name)
    weather.latitude.push(latitude)
    weather.longitude.push(longitude)
  });
  localStorage.setItem("weather", JSON.stringify(weather));
}

var updateHistory = function (cityName) {
  var remove = false
  var row = $(searchHistoryEl)
  .children()
  $(row).each(function() {
    var cityHistory = $(this)
    .text();
    var cityHistoryItem = $(this)
    if (cityHistory === cityName) {
    cityHistoryItem.remove();
    remove = true;
    }
  });
  var cityEl = document.createElement("button");
  cityEl.classList = "search-results";
  cityEl.setAttribute("data-latitude", $LATITUDE)
  cityEl.setAttribute("data-longitude", $LONGITUDE)
  cityEl.textContent = cityName;
  searchHistoryEl.prepend(cityEl);  
  if (row.length === 5 && remove === false) {
    row[4].remove();
  }
  loadWeather();
}

var capitalize = function(str) {
  const mySentence = str
  const words = mySentence.split(" ");
for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
}
words.join("");
return cityName = words.toString().replace(/,/g, ' ');;
}

var formSubmitHandler = function(event) {
    event.preventDefault();
    cityName = searchInputEl.value.trim();
    if (cityName) {
      capitalize(cityName);
      getCity(cityName);
    } else {
      return alert("Please enter the name of a city");
      }
  };

  getWeather()

  cityFormEl.addEventListener("submit", formSubmitHandler);