$(document).ready(function() {
  $("#search-button").on("click", function() {
    var searchValue = $("#search-value").val();

    // clear input box
    $("#search-value").val(" ");

    searchWeather(searchValue);
  });

  $(".history").on("click", "li", function() {
    searchWeather($(this).text());
  });

  function makeRow(text) {
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    $(".history").append(li);
  }

  function searchWeather(searchValue) {
    $.ajax({
      type: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=8337c9967573e14ada129e51effa9dea",
      dataType: "json",
      success: function(data) {
        console.log("----------City Search--------", data);
        // create history link for this search
        if (history.indexOf(searchValue) === -1) {
          history.push(searchValue);
          window.localStorage.setItem("history", JSON.stringify(history));
    
          makeRow(searchValue);
        }
        
        // clear any old content

        // create html content for current weather
        var cityName = data.name;
        var today = new Date();
        var date = (today.getMonth()+1) +'-'+ (today.getDate())+'-'+ today.getFullYear();
        

        
        var name = $("<h2>")        
        name.html(cityName + " (" + date + ") ");

        var temperature = 1.8*(data.main.temp - 273) + 32;
        var tempF = temperature.toFixed(1);
        var temp = $("<p>").text("Temperature: ")
        temp.html("Temperature: " + tempF + " °F");

        var humidity = data.main.humidity;
        var humiditydisplay = $("<p>")
        humiditydisplay.html("Humidity: " + humidity + " %");

        var windSpeed = data.wind.speed;
        var windDisplay = $("<p>")
        windDisplay.html("Wind Speed: " + windSpeed + " MPH");
        

        // merge and add to page
        $("<div>", {id: "todayForecast"}).appendTo("#today");

        name.appendTo("#todayForecast");
        temp.appendTo("#todayForecast");
        humiditydisplay.appendTo("#todayForecast");
        windDisplay.appendTo("#todayForecast");

        
        // call follow-up api endpoints
        getForecast(searchValue);
        getUVIndex(data.coord.lat, data.coord.lon);
      }
    });
  }
  
  function getForecast(searchValue) {
    $.ajax({
      type: "GET",
      url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=8337c9967573e14ada129e51effa9dea",
      dataType: "json",
      success: function(data) {
        console.log("----------Forecast Search--------", data);
        // overwrite any existing content with title and empty row



        // loop over all forecasts (by 3-hour increments)
        for (var i = 0; i < data.list.length; i++) {
          // only look at forecasts around 3:00pm
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            // create html elements for a bootstrap card
            var fDate = $("<p>");
            fDate.html(date);
            console.log(fDate);
            

            

            // merge together and put on page
            fDate.appendTo("#forecast");
          }
        }
      }
    });
  }

  function getUVIndex(lat, lon) {
    $.ajax({
      type: "GET",
      url: "https://api.openweathermap.org/data/2.5/uvi?appid=8337c9967573e14ada129e51effa9dea" + "&lat=" + lat + "&lon=" + lon,
      dataType: "json",
      success: function(data) {
        console.log("-----UV Search------", data);
        var uv = $("<p>").text("UV Index: ");
        var btn = $("<span>").addClass("btn btn-sm").text(data.value);
        
        // change color depending on uv value
        
        $("#todayForecast").append(uv.append(btn));
      }
    });
  }

  // get current history, if any
  var history = JSON.parse(window.localStorage.getItem("history")) || [];

  if (history.length > 0) {
    searchWeather(history[history.length-1]);
  }

  for (var i = 0; i < history.length; i++) {
    makeRow(history[i]);
  }
});
