var cityFormEl = document.querySelector("#city-form");
var searchInputEl = document.querySelector("#search");
var searchHistoryEl = document.querySelector("#search-history");
var weatherReportEl = document.querySelector("#weather-report");
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

function timeConverter(UNIX_timestamp){
  var date = new Date(UNIX_timestamp * 1000);
  var months = ['1','2','3','4','5','6','7','8','9','10','11','12'];
  var year = date.getFullYear();
  var month = months[date.getMonth()];
  var day = date.getDate();
  var time = month + '/' + day + '/' + year;
  return time;
}

var addWeather = function (city, lat, long) {
  // call API with Lat and Long coordinates

  var requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + long + '&units=imperial&cnt=3&exclude=daily,minutely,hourly,alerts&cnt=5&appid=db8406e2438a3bda2d57fa0aaa4169c2'
  
  fetch(requestUrl).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('This city was not found');
    }
  })
  .then(function (data) {

    // get current data from API
    var date = timeConverter(data.current.dt)
    var icon = data.current.weather[0].icon
    var iconDescription = data.current.weather[0].description
    var currentTemp = data.current.temp
    var currentWind = data.current.wind_speed
    var currentHumidity = data.current.humidity
    var currentUV = data.current.uvi
    
    // Add current weather to page
    weatherReportEl.innerHTML = " "
    var currentWeatherEl = $(weatherReportEl)
    var weatherEl = $("<div>")
    .addClass("city-day")
    .attr('id', 'current-weather')
    var currentWeatherIcon = $("<img>")
    .attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png" )
    .attr("alt", iconDescription )
    var cityNameEl = $("<h2>")
    .append(city, " (", date, ") ", currentWeatherIcon)
    var currentTempEl = $("<p>")
    .append("Temp: ", currentTemp, "°F")
    var currentWindEl = $("<p>")
    .append("Wind: ", currentWind, " MPH")
    var currentHumidityEl = $("<p>")
    .append("Humidity: ", currentHumidity, " %")
    var currentUVIcon = $("<span>")
    .addClass("uv")
    .append(currentUV)
    var currentUVEl = $("<p>")
    .append("UV Index: ", currentUVIcon)
    weatherEl.append(cityNameEl, currentTempEl, currentWindEl, currentHumidityEl, currentUVEl)
    currentWeatherEl.append(weatherEl)
  })
  .catch((error) => { 
    console.log(error)
    return alert("Error: " + city + " was not found. Try again.");
  });

}

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
  addWeather(cityName, $LATITUDE, $LONGITUDE);
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