//jquery document ready function
$(document).ready(function(){

    //assign apiKey as variable
    var apiKey = "6c0f5801e1248c7504486375495c1428";

    //populate list of previously searched cities
    function populateList(){
        
        //assign variable to JSON parsed local storage data
        var list = JSON.parse(localStorage.getItem("weatherList"));

        //if list data exists, for each item in array, append item to 
        if (list){
            $("#search-list").empty();
            list.forEach(function(location){
                $("#search-list").append(`<li class="city"><button class="btn btn-outline-secondary">${location}</button></li>`);
            });   

            $(".city").click(function(event) {
                console.log(event.target.textContent);

                //assign variable to current weather api query url, with user input and apiKey as variable inputs
                var queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${event.target.textContent}&appid=${apiKey}`;

                //make ajax call to api via queryUrl and GET method
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function(response) {

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
    $("#search-button").click(function(event){

        //assign variable to value of user input
        var textInput = $("#search-field").val();

        //console.log value of user input element
        console.log(textInput);
        
        //assign variable to current weather api query url, with user input and apiKey as variable inputs
        var queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${textInput}&appid=${apiKey}`;

        //make ajax call to api via queryUrl and GET method
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {

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
            if (previousCities){
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
    });
        
    //create seven day weather for latitude longitude location (only using 5 days)
    function getSevenDayWeather(lat, lon){

        //assign variable to api query url with lat and lon as variable inputs
        var queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=[current,minutely,hourly,alerts]&appid=${apiKey}&units=imperial`;
        
        //make ajax call to api via queryUrl and GET method
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {

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
            if (uvIndex > 5){
                $("#uv-index").css("background-color", "red");
            }

            //else if uv index response data greater than 2, set css background-color property to yellow
            else if (uvIndex > 2){
                $("#uv-index").css("background-color", "yellow");   
            }

            //else set css background-color property to green
            else {
                $("#uv-index").css("background-color", "green");   
            }

            //add response data icon at index position 0 to today's weather div
            var icon = todaysWeather.weather[0].icon;
            $("#weather-icon").attr("src", `http://openweathermap.org/img/wn/${icon}@2x.png`);

//populate 5-day weather divs with response data

        //populate day one weather div

            //assign variable to array position 1 response data
            var dayOneWeather = response.daily[1];

            //assign variable to array position 1 temp data
            var tempOne = dayOneWeather.temp.day;

            //select temp element and set html content to string and variable value
            $("#temp-one").html(`Temperature: ${tempOne}°F`);
            
            //assign variable to array position 1 humidity data
            var humidityOne = dayOneWeather.humidity;

            //select humidity element and set html content to string and variable value
            $("#humidity-one").html(`Humidity: ${humidityOne}%`);

            //assign variable to array position 1  
            var iconOne = todaysWeather.weather[0].icon;

            //select icon element and set src attribute to icon url            
            $("#icon-one").attr("src", `http://openweathermap.org/img/wn/${iconOne}@2x.png`);

            //assign variable to moment.js date data
            var dateOne = moment().add(1, "d").format('L');

            //select date element and set html content to moment.js date data
            $("#date-one").html(dateOne);

        //populate day two weather
            var dayTwoWeather = response.daily[2];
            var tempTwo = dayTwoWeather.temp.day;
            $("#temp-two").html(`Temperature: ${tempTwo}°F`);

            var humidityTwo = dayTwoWeather.humidity;
            $("#humidity-two").html(`Humidity: ${humidityTwo}%`);

            var iconTwo = todaysWeather.weather[0].icon;
            $("#icon-two").attr("src", `http://openweathermap.org/img/wn/${iconTwo}@2x.png`);

            var dateTwo = moment().add(2, "d").format('L');
            $("#date-two").html(dateTwo);

        //populate day three weather
            var dayThreeWeather = response.daily[2];
            var tempThree = dayThreeWeather.temp.day;
            $("#temp-three").html(`Temperature: ${tempThree}°F`);

            var humidityThree = dayThreeWeather.humidity;
            $("#humidity-three").html(`Humidity: ${humidityThree}%`);

            var iconThree = todaysWeather.weather[0].icon;
            $("#icon-three").attr("src", `http://openweathermap.org/img/wn/${iconThree}@2x.png`);

            var dateThree = moment().add(3, "d").format('L');
            $("#date-three").html(dateThree);

        //populate day four weather
            var dayFourWeather = response.daily[2];
            var tempFour = dayFourWeather.temp.day;
            $("#temp-four").html(`Temperature: ${tempFour}°F`);

            var humidityFour = dayFourWeather.humidity;
            $("#humidity-four").html(`Humidity: ${humidityFour}%`);

            var iconFour = todaysWeather.weather[0].icon;
            $("#icon-four").attr("src", `http://openweathermap.org/img/wn/${iconFour}@2x.png`);

            var dateFour = moment().add(4, "d").format('L');
            $("#date-four").html(dateFour);

        //populate day five weather
            var dayFiveWeather = response.daily[2];
            var tempFive = dayFiveWeather.temp.day;
            $("#temp-five").html(`Temperature: ${tempFive}°F`);

            var humidityFive = dayFiveWeather.humidity;
            $("#humidity-five").html(`Humidity: ${humidityFive}%`);

            var iconFive = todaysWeather.weather[0].icon;
            $("#icon-five").attr("src", `http://openweathermap.org/img/wn/${iconFive}@2x.png`);

            var dateFive = moment().add(5, "d").format('L');
            $("#date-five").html(dateFive);

        });
    
    }

    //call populate previously searched cities list function
    populateList();
});
