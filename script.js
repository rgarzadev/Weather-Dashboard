//jquery document ready function
$(document).ready(function () {

    //assign apiKey as variable
    var apiKey = "6c0f5801e1248c7504486375495c1428";

    //populate list of previously searched cities
    function populateList() {
        $("#search-list").empty();
        //assign variable to JSON parsed local storage data
        var list = JSON.parse(localStorage.getItem("weatherList"));

        list = list.slice(-10)

        //if list data exists, for each item in array, append item to 
        if (list) {
            list.forEach(function (location) {
                $("#search-list").prepend(`<li><button class="btn btn-outline-secondary city">${location}</button></li>`);
            });

            $(".city").click(function (event) {
                console.log(event.target.textContent);

                //assign variable to current weather api query url, with user input and apiKey as variable inputs
                var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${event.target.textContent}&appid=${apiKey}`;

                //make ajax call to api via queryUrl and GET method
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function (response) {

                    //assign variable to city name response data
                    var name = response.name;

                    //assign variable to locale formatted moment.js data
                    var date = moment().format('L');

                    //set header title element html using value of name and date variables
                    $("#title-location").html(`${name} ${date}`);

                    //assign variable to latitude response data
                    var lat = response.coord.lat;

                    //assign variable to longitude response data
                    var lon = response.coord.lon;

                    //call getSevenDayWeather function with lat and lon variables as inputs
                    getSevenDayWeather(lat, lon);

                });
            })
        }
    }


    //create search button click function
    $("#search-button").click(searchByCity);
    $("#search-field").on("keypress", function (e) {
        if (e.key === "Enter") {
            searchByCity()
        }
    })
    $("#clear-button").click(function () {
        localStorage.removeItem("weatherList")
        populateList()
    })

    function searchByCity() {
        //assign variable to value of user input
        var textInput = $("#search-field").val();

        //console.log value of user input element
        console.log(textInput);

        //assign variable to current weather api query url, with user input and apiKey as variable inputs
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${textInput}&appid=${apiKey}`;

        //make ajax call to api via queryUrl and GET method
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            //assign variable to city name response data
            var name = response.name;

            //assign variable to locale formatted moment.js data
            var date = moment().format('L');

            //set header title element html using value of name and date variables
            $("#title-location").html(`${name} ${date}`);

            //assign variable to latitude response data
            var lat = response.coord.lat;

            //assign variable to longitude response data
            var lon = response.coord.lon;

            //call getSevenDayWeather function with lat and lon variables as inputs
            getSevenDayWeather(lat, lon);

            //save seached city name data to local storage history

            //assign variable to JSON parsed local storage data
            var previousCities = JSON.parse(localStorage.getItem("weatherList"));

            //if data items in local storage, add the city name response data to the array
            if (previousCities) {
                previousCities.push(name);
            }

            //else if, add the city name response data to a new array
            else {
                previousCities = [name];
            }

            //stringify the array and set it to local storage as key / value pair
            localStorage.setItem("weatherList", JSON.stringify(previousCities));

            //append name response data to the search list div
            populateList();

        });

    }

    //create seven day weather for latitude longitude location (only using 5 days)
    function getSevenDayWeather(lat, lon) {

        //assign variable to api query url with lat and lon as variable inputs
        var queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=[current,minutely,hourly,alerts]&appid=${apiKey}&units=imperial`;

        //make ajax call to api via queryUrl and GET method
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            //console.log all response data in console
            console.log(response);

        //populate today's weather p tags with response data

            //assign variable to today's weather response data
            var todaysWeather = response.daily[0];

            //assign variable to today's temp response data
            var temp = todaysWeather.temp.day;

            //select temp element and set html content to string and variable value
            $("#temp").html(`Temp: ${temp}°F`);

            //assign variable to today's humidity response data
            var humidity = todaysWeather.humidity;

            //select humidity element and set html content to string and variable value
            $("#humidity").html(`Humidity: ${humidity}%`);

            //assign variable to today's wind speed response data
            var wind = todaysWeather.wind_speed;

            //select wind element and set html content to string and variable value
            $("#wind").html(`Wind: ${wind} MPH`);

            //assign variable to today's uv index response data
            var uvIndex = todaysWeather.uvi;

            //select uv index element and set html content to string and variable value
            $("#uv-index").html(`UV Index: ${uvIndex}`);

            //set today's uv index element background color based on index value

            //if uv index response data greater than 5, set css background-color property to red
            if (uvIndex > 5) {
                $("#uv-index").css("background-color", "red");
            }

            //else if uv index response data greater than 2, set css background-color property to yellow
            else if (uvIndex > 2) {
                $("#uv-index").css("background-color", "yellow");
            }

            //else set css background-color property to green
            else {
                $("#uv-index").css("background-color", "green");
            }

            //add response data icon at index position 0 to today's weather div
            var icon = todaysWeather.weather[0].icon;
            $("#weather-icon").attr("src", `https://openweathermap.org/img/wn/${icon}@2x.png`);

    //populate 5-day weather divs with response data
            $("#five-day-cards").empty();
            for (var i = 1; i < response.daily.length && i <= 5; i++) {
                var currentDaysWeather = response.daily[i];
                var newDayCard = $("<div>").attr("class", "day-card");

                var currentDaysDate = moment().add(i, "d").format('L');
                newDayCard.append($("<h4>").html(currentDaysDate));
                
                var currentDaysIcon = currentDaysWeather.weather[0].icon;
                newDayCard.append($("<img>").attr("src", `https://openweathermap.org/img/wn/${currentDaysIcon}@2x.png`));

                var currentDaysTemp = currentDaysWeather.temp.day;
                newDayCard.append($("<p>").html(`Temperature: ${currentDaysTemp}°F`));

                var currentDaysHumidity = currentDaysWeather.humidity;
                newDayCard.append($("<p>").html(`Humidity: ${currentDaysHumidity}%`));
                
                $("#five-day-cards").append(newDayCard);
            }
        });

    }

    //call populate previously searched cities list function
    populateList();
});
