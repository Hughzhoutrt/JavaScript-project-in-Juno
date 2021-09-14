const app = {};
app.locationKey = '4f0ef52ad4ea4a7885160d22767b99b3';
app.locationBaseUrl = "https://ipgeolocation.abstractapi.com/v1/";

app.weatherKey = `de365115a7284ad4bf2cd265044b2341`;
app.weatherBaseUrl = `https://api.weatherbit.io/v2.0/current`;
// Setting global variables for saving data button function
app.weatherCity = '';
app.weatherCountry = '';
app.currentWeaterCode = '';
app.currentWeatherDescription = '';
app.currentWeatherDayNight = '';
app.currentWeatherFeelsLike = '';
app.currentWeatherTemperature = '';
app.currentWeatherWindSpeed = '';
app.currentWeatherWindDirection = '';
app.currentWeathterHumidity = '';
app.currentWeatherPressue = '';

app.temperatureUnitIsCentigradeListner = true; //Centigrade default

app.weatherInputWrongSituation = 0;
app.lastOneCityName = "";
app.lastOneCountryName = "";

app.gifKey = `qqanPZz7sLSn7kVSm7oDDrm4Az3ZQ1XH`;
app.gifBaseUrl = `http://api.giphy.com/v1/gifs/search`;

app.countryAbbreviationCode = `
 There are some abbreviated code of areas:
 
 Canada : CA
 United States : US
 China : CN
 India : IN
 United Kingdom : UK
 France : FR
 Italy : IT
 Germany : DE
 Japan : JP
 South Korea : KR

 Please click "CANCEL" if you cannot find the abbreviated code you are looking for, and this button will switch to another then provide you an external link for abbreviated code search.
`;

app.putGifOnPage = data => { //Adding Gifs on page
    data.forEach(function (gifObject) {
        const gifhtml = `
                <div class="gifBox">
                    <div class="imgBox">
                        <img src="${gifObject.images.original.url} alt="${gifObject.title}"
                    </div>
                    <div class="gifTittle">
                        <p>${gifObject.title}</p>
                    </div>
                </div>
           `
        $('.gifDisplayDiv').append(gifhtml);
    });
};

app.getWeatherGif = (query) => {
    $.ajax({ //Get data from GIF API
        url: app.gifBaseUrl,
        method: 'GET',
        dataType: 'json',
        data: {
            api_key: app.gifKey,
            q: query,
            format: 'json',
            limit: 3 //Limit 3 gifs
        }
    }).then(function (result) { //Put Gifs on pages
        $('.gifDisplayDiv').empty(); // empty gif box to avoid too many gifs
        app.putGifOnPage(result.data);
    });
};

app.locationDataDisplay = (cityName, countryName) => { //City data display on page
    $('.currentCityName').text(`${cityName}, ${countryName}`);
};

app.weatherDataDisplay = (currentTemperture, currentFeelsLikeTemperature, humidity, pressure, windSpeed, windDirection) => { //Weather data display on page
    $('.currentTempertureNumber').text(currentTemperture);
    $('.currentFeelsLikeTemperatureNumber').text(currentFeelsLikeTemperature);
    $('.humidityDisplay').text(`${humidity}%`);
    $('.pressureDisplay').text(`${pressure} mb`);
    $('.windDisplay').text(`${windSpeed} m/s  ${windDirection}`);
};

app.getCurrentWeather = () => {
    $.ajax({  //Get data from weather API
        url: app.weatherBaseUrl,
        method: 'GET',
        dataType: 'json',
        data: {
            key: app.weatherKey,
            city: app.weatherCity,
            country: app.weatherCountry
        }
    }).then(function (result) { //Saving weather data
        if (result === undefined) {
            //If user input invalid city name, alert shows and let page go back to show the last city data
            alert(`Please enter a corret city name and a country abbreviation!`);
            app.weatherCity = app.lastOneCityName;
            app.weatherCountry = app.lastOneCountryName;
            app.locationDataDisplay(app.weatherCity, app.weatherCountry);
            app.getCurrentWeather();
        } else {
            app.currentWeaterCode = result.data[0].weather.code;
            app.currentWeatherDescription = result.data[0].weather.description;
            app.currentWeatherDayNight = result.data[0].pod;
            app.currentWeatherFeelsLike = result.data[0].app_temp;
            //Keep one decimal place
            const weatherFeelsLikeTemperatureInTransfer = app.currentWeatherFeelsLike.toFixed(1);
            app.currentWeatherFeelsLike = weatherFeelsLikeTemperatureInTransfer;
            app.currentWeatherTemperature = result.data[0].temp;
            //Keep one decimal place
            const weathterTemperatureInTransfer = app.currentWeatherTemperature.toFixed(1);
            app.currentWeatherTemperature = weathterTemperatureInTransfer;
            app.currentWeatherWindSpeed = result.data[0].wind_spd;
            app.currentWeatherWindDirection = result.data[0].wind_cdir_full;
            //Wind direction use first letter upper case
            const currentWeatherWindDirectionFirstLetterUpperCase = app.currentWeatherWindDirection;
            app.currentWeatherWindDirection = currentWeatherWindDirectionFirstLetterUpperCase[0].toUpperCase() + currentWeatherWindDirectionFirstLetterUpperCase.substr(1);
            app.currentWeathterHumidity = result.data[0].rh;
            app.currentWeatherPressue = result.data[0].pres;
            app.weatherDataDisplay(app.currentWeatherTemperature, app.currentWeatherFeelsLike, app.currentWeathterHumidity, app.currentWeatherPressue, app.currentWeatherWindSpeed, app.currentWeatherWindDirection);
            app.getWeatherGif(app.currentWeatherDescription); //Put current weather description into GIF API to get GIF
            app.currentTimeWallPaper(); //Change wall paper
            app.currentTimeTittleBackground(); //Change header tittle gif background
            // Restore the city data and use it if use input invalid city info
            app.lastOneCityName = app.weatherCity;
            app.lastOneCountryName = app.weatherCountry;
            app.weatherIconAndDescriptionDisplay(); // Display weather icon
        };
    })
};

app.getCurrentLocationWeather = () => {
    $.ajax({ //Get data from location API
        url: app.locationBaseUrl,
        method: "GET",
        dataType: 'json',
        data: {
            api_key: app.locationKey
        }
    }).then(function (result) { //Put location data into weather API to get current weather
        app.weatherCity = result.city;
        app.weatherCountry = result.country_code;
        app.locationDataDisplay(app.weatherCity, app.weatherCountry);
        app.getCurrentWeather();
    })
};

app.temperatureUnitTransferMethod = () => { //Unit Transfer function
    $('.currentTempertureNumber').text(app.currentWeatherTemperature);
    $('.currentFeelsLikeTemperatureNumber').text(app.currentWeatherFeelsLike);
    $('.fahrenheitSign').addClass('.onusedSign');
    $('.centigradeSign').removeClass('.onusedSign');
    app.temperatureUnitIsCentigradeListner = !app.temperatureUnitIsCentigradeListner;
};

app.savingtemperatureDataInCentigrade = () => { //Saving data when centigrade is used on page
    const htmlcontent = `
<div class="savingTemperatureDataDisplayDiv">
    <p>The weather in ${app.weatherCity}, ${app.weatherCountry} is:</p>
    <p>${app.currentWeatherDescription}, ${app.currentWeatherTemperature}°C, feels like ${app.currentWeatherFeelsLike}°C.</p>
    <p>Pressure: ${app.currentWeatherPressue} mb.</p>
    <p>Humidity: ${app.currentWeathterHumidity}%.</p>
    <p>Wind: ${app.currentWeatherWindSpeed} m/s  ${app.currentWeatherWindDirection}</p>
    <button class="importantButton">Mark this!</button>
</div>
`
    $('.savingWeatherDataDisplay').append(htmlcontent);
};

app.savingtemperatureDataInFahrenheit = () => { //Saving data when fahrenheit is used on page
    const htmlcontent = `
<div class="savingTemperatureDataDisplayDiv">
    <p>The weather in ${app.weatherCity}, ${app.weatherCountry} is:</p>
    <p>${app.currentWeatherDescription}, ${app.currentWeatherTemperature}°F, feels like ${app.currentWeatherFeelsLike}°F.</p>
    <p>Pressure: ${app.currentWeatherPressue} mb.</p>
    <p>Humidity: ${app.currentWeathterHumidity}%.</p>
    <p>Wind: ${app.currentWeatherWindSpeed} m/s  ${app.currentWeatherWindDirection}</p>
    <button class="importantButton">Mark this!</button>
</div>
`
    $('.savingWeatherDataDisplay').append(htmlcontent);
};

app.currentTimeWallPaper = () => {
    if (app.currentWeatherDayNight === 'd') {
        $('body').toggleClass('dayTimeWallPaper')
    } else if (app.currentWeatherDayNight === 'n') {
        $('body').toggleClass('nightTimeWallPaper')
    };
};

app.currentTimeTittleBackground = () => {
    if (app.currentWeaterCode === 200 || app.currentWeaterCode === 201 || app.currentWeaterCode === 202 || app.currentWeaterCode === 230 || app.currentWeaterCode === 231 || app.currentWeaterCode === 232 || app.currentWeaterCode === 233) { //Thunder day tittle background gif
        $('#headerTextArea').toggleClass('thunerTittleTextArea');
    } else if (app.currentWeaterCode === 300 || app.currentWeaterCode === 301 || app.currentWeaterCode === 302 || app.currentWeaterCode === 500 || app.currentWeaterCode === 501 || app.currentWeaterCode === 502 || app.currentWeaterCode === 511 || app.currentWeaterCode === 520 || app.currentWeaterCode === 521 || app.currentWeaterCode === 522) { //Raining day tittle background gif
        $('#headerTextArea').toggleClass('rainingTittleTextArea');
    } else if (app.currentWeaterCode === 600 || app.currentWeaterCode === 601 || app.currentWeaterCode === 602 || app.currentWeaterCode === 610 || app.currentWeaterCode === 611 || app.currentWeaterCode === 612 || app.currentWeaterCode === 621 || app.currentWeaterCode === 622 || app.currentWeaterCode === 623) { //Snowing day tittle background gif
        $('#headerTextArea').toggleClass('snowingTittleTextArea');
    } else if (app.currentWeaterCode === 700 || app.currentWeaterCode === 711 || app.currentWeaterCode === 721 || app.currentWeaterCode === 731 || app.currentWeaterCode === 741 || app.currentWeaterCode === 751) { //Fogging day tittle background gif
        $('#headerTextArea').toggleClass('foggingTittleTextArea');
    } else if (app.currentWeaterCode === 800) { //Sunny day tittle background gif
        $('#headerTextArea').toggleClass('clearSkyTittleTextArea');
    } else if (app.currentWeaterCode === 801 || app.currentWeaterCode === 802 || app.currentWeaterCode === 803 || app.currentWeaterCode === 804) { //Cloudy day tittle background gif
        $('#headerTextArea').toggleClass('cloudySkyTittleTextArea');
    };
};

app.weatherIconAndDescriptionDisplay = () => {
    if (app.currentWeaterCode === 200 || app.currentWeaterCode === 201 || app.currentWeaterCode === 202) {
        $('#weatherIconDiv').empty();
        if (app.currentWeatherDayNight === 'd') {
            $('#weatherIconDiv').append(`
                <img src="./image/200d.png" alt = "thunder rain logo daytime"> 
            `);
        } else if (app.currentWeatherDayNight === 'n') {
            $('#weatherIconDiv').append(`
                <img src="./image/200n.png" alt = "thunder rain logo nighttime"> 
            `);
        };
    } else if (app.currentWeaterCode === 230 || app.currentWeaterCode === 231 || app.currentWeaterCode === 232 || app.currentWeaterCode === 233) {
        $('#weatherIconDiv').empty();
        if (app.currentWeatherDayNight === 'd') {
            $('#weatherIconDiv').append(`
                <img src="./image/230d.png" alt = "thunder drizzle logo daytime"> 
            `);
        } else if (app.currentWeatherDayNight === 'n') {
            $('#weatherIconDiv').append(`
                <img src="./image/230n.png" alt = "thunder drizzle logo nighttime"> 
            `);
        };
    } else if (app.currentWeaterCode === 300 || app.currentWeaterCode === 301 || app.currentWeaterCode === 302) {
        $('#weatherIconDiv').empty();
        $('#weatherIconDiv').append(`
            <img src="./image/300.png" alt = "drizzle logo"> 
        `);
    } else if (app.currentWeaterCode === 500 || app.currentWeaterCode === 501 || app.currentWeaterCode === 511) {
        $('#weatherIconDiv').empty();
        $('#weatherIconDiv').append(`
            <img src="./image/500.png" alt = "light Rain logo"> 
        `);
    } else if (app.currentWeaterCode === 502) {
        $('#weatherIconDiv').empty();
        $('#weatherIconDiv').append(`
            <img src="./image/502.png" alt = "heavy Rain logo"> 
        `);
    } else if (app.currentWeaterCode === 520 || app.currentWeaterCode === 522) {
        $('#weatherIconDiv').empty();
        if (app.currentWeatherDayNight === 'd') {
            $('#weatherIconDiv').append(`
                <img src="./image/520d.png" alt = "shower rain logo daytime"> 
            `);
        } else if (app.currentWeatherDayNight === 'n') {
            $('#weatherIconDiv').append(`
                <img src="./image/520n.png" alt = "shower rain logo nighttime"> 
        `);
        };
    } else if (app.currentWeaterCode === 521) {
        $('#weatherIconDiv').empty();
        if (app.currentWeatherDayNight === 'd') {
            $('#weatherIconDiv').append(`
                <img src="./image/521d.png" alt = "shower rain logo daytime"> 
            `);
        } else if (app.currentWeatherDayNight === 'n') {
            $('#weatherIconDiv').append(`
                <img src="./image/521n.png" alt = "shower rain logo nighttime"> 
        `);
        };
    } else if (app.currentWeaterCode === 600 || app.currentWeaterCode === 610 || app.currentWeaterCode === 621) {
        $('#weatherIconDiv').empty();
        if (app.currentWeatherDayNight === 'd') {
            $('#weatherIconDiv').append(`
                <img src="./image/600d.png" alt = "light snow logo daytime"> 
            `);
        } else if (app.currentWeatherDayNight === 'n') {
            $('#weatherIconDiv').append(`
                <img src="./image/600n.png" alt = "light snow logo nighttime"> 
        `);
        };
    } else if (app.currentWeaterCode === 601 || app.currentWeaterCode === 602 || app.currentWeaterCode === 622) {
        $('#weatherIconDiv').empty();
        $('#weatherIconDiv').append(`
            <img src="./image/601.png" alt = "heavy Snow logo"> 
        `);
    } else if (app.currentWeaterCode === 611 || app.currentWeaterCode === 612) {
        $('#weatherIconDiv').empty();
        $('#weatherIconDiv').append(`
            <img src="./image/611.png" alt = "sleet logo"> 
        `);
    } else if (app.currentWeaterCode === 623) {
        $('#weatherIconDiv').empty();
        $('#weatherIconDiv').append(`
            <img src="./image/623.png" alt = "flurries logo"> 
        `);
    } else if (app.currentWeaterCode === 700 || app.currentWeaterCode === 711 || app.currentWeaterCode === 721 || app.currentWeaterCode === 731 || app.currentWeaterCode === 741 || app.currentWeaterCode === 751) {
        $('#weatherIconDiv').empty();
        if (app.currentWeatherDayNight === 'd') {
            $('#weatherIconDiv').append(`
                <img src="./image/700d.png" alt = "mist logo daytime"> 
            `);
        } else if (app.currentWeatherDayNight === 'n') {
            $('#weatherIconDiv').append(`
                <img src="./image/700n.png" alt = "mist logo nighttime"> 
        `);
        };
    } else if (app.currentWeaterCode === 800) {
        $('#weatherIconDiv').empty();
        if (app.currentWeatherDayNight === 'd') {
            $('#weatherIconDiv').append(`
                <img src="./image/800d.png" alt = "clear sky logo daytime"> 
            `);
        } else if (app.currentWeatherDayNight === 'n') {
            $('#weatherIconDiv').append(`
                <img src="./image/800n.png" alt = "clear sky logo nighttime"> 
        `);
        };
    } else if (app.currentWeaterCode === 801 || app.currentWeaterCode === 802) {
        $('#weatherIconDiv').empty();
        if (app.currentWeatherDayNight === 'd') {
            $('#weatherIconDiv').append(`
                <img src="./image/801d.png" alt = "few clouds logo daytime"> 
            `);
        } else if (app.currentWeatherDayNight === 'n') {
            $('#weatherIconDiv').append(`
                <img src="./image/801n.png" alt = "few clouds logo nighttime"> 
        `);
        };
    } else if (app.currentWeaterCode === 803) {
        $('#weatherIconDiv').empty();
        if (app.currentWeatherDayNight === 'd') {
            $('#weatherIconDiv').append(`
                <img src="./image/803d.png" alt = "broken clouds logo daytime"> 
            `);
        } else if (app.currentWeatherDayNight === 'n') {
            $('#weatherIconDiv').append(`
                <img src="./image/803n.png" alt = "broken clouds logo nighttime"> 
        `);
        };
    } else if (app.currentWeaterCode === 804) {
        $('#weatherIconDiv').empty();
        $('#weatherIconDiv').append(`
            <img src="./image/804.png" alt = "overcast clouds logo"> 
            `);
    } else { //code = 900
        $('#weatherIconDiv').empty();
        $('#weatherIconDiv').append(`
            <img src="./image/900.png" alt = "overcast clouds logo"> 
            `);
    };
    $('.currentWeatherDescriptionDisplay').empty();
    $('.currentWeatherDescriptionDisplay').append(app.currentWeatherDescription);
};

app.init = () => {
    app.getCurrentLocationWeather();
    $('.centigradeSign').attr('id', 'onUsedUnitSignButton'); //Default used Centigrade
};

$(() => {
    app.init();

    $('.locationInputForm').on(`submit`, function (event) { //Input city name 
        event.preventDefault();
        app.temperatureUnitIsCentigradeListner = true; //Centigrade default
        $('.centigradeSign').attr('id', 'onUsedUnitSignButton'); //Default used 
        $('.fahrenheitSign').removeAttr('id');//Default used 
        app.weatherCity = $('#cityNameInput').val();
        app.weatherCountry = $('#countryNameInput').val();
        //City name uses first letter upper case
        const currentWeatherCityFirstLetterUpperCase = app.weatherCity;
        app.weatherCity = currentWeatherCityFirstLetterUpperCase[0].toUpperCase() + currentWeatherCityFirstLetterUpperCase.substr(1);
        //Country abbr uses upper case
        const currentWeatherCountryUpperCase = app.weatherCountry;
        app.weatherCountry = currentWeatherCountryUpperCase.toUpperCase();
        app.locationDataDisplay(app.weatherCity, app.weatherCountry);
        app.getCurrentWeather();
        app.currentTimeWallPaper(); //Change wall paper
        app.currentTimeTittleBackground(); //Change header tittle gif background
        app.weatherIconAndDescriptionDisplay(); // Display weather icon
    });

    $('.centigradeSign').click(function (event) { //Transfer to Centigrade
        event.preventDefault();
        if (app.temperatureUnitIsCentigradeListner === true) {
            alert(`You already used Centigrade as unit!`)
        } else {
            app.currentWeatherTemperature = (app.currentWeatherTemperature - 32) / 1.8;
            const weathterTemperatureInTransfer = app.currentWeatherTemperature.toFixed(1);
            app.currentWeatherTemperature = weathterTemperatureInTransfer;
            app.currentWeatherFeelsLike = (app.currentWeatherFeelsLike - 32) / 1.8;
            const weatherFeelsLikeTemperatureInTransfer = app.currentWeatherFeelsLike.toFixed(1);
            app.currentWeatherFeelsLike = weatherFeelsLikeTemperatureInTransfer;
            $('.currentFeelsLikeTemperatureSign').text(`°C`);
            app.temperatureUnitTransferMethod();
            $('.fahrenheitSign').removeAttr('id');
            $('.centigradeSign').attr('id', 'onUsedUnitSignButton');
        }
    });

    $('.fahrenheitSign').click(function (event) { //Transfer to Fahrenheit
        event.preventDefault();
        if (app.temperatureUnitIsCentigradeListner === false) {
            alert(`You already used Fahrenheit as unit!`)
        } else {
            app.currentWeatherTemperature = app.currentWeatherTemperature * 1.8 + 32;
            const weathterTemperatureInTransfer = app.currentWeatherTemperature.toFixed(1);
            app.currentWeatherTemperature = weathterTemperatureInTransfer;
            app.currentWeatherFeelsLike = app.currentWeatherFeelsLike * 1.8 + 32;
            const weatherFeelsLikeTemperatureInTransfer = app.currentWeatherFeelsLike.toFixed(1);
            app.currentWeatherFeelsLike = weatherFeelsLikeTemperatureInTransfer;
            $('.currentFeelsLikeTemperatureSign').text(`°F`);
            app.temperatureUnitTransferMethod();
            $('.centigradeSign').removeAttr('id');
            $('.fahrenheitSign').attr('id', 'onUsedUnitSignButton');
        }
    });

    $('.savingWeatherDataButton').click(function (event) { //Saving weather data
        event.preventDefault();
        if (app.temperatureUnitIsCentigradeListner === true) {
            app.savingtemperatureDataInCentigrade();
        } else {
            app.savingtemperatureDataInFahrenheit();
        }
    });

    $('.savingWeatherDataDisplay').on('click', '.importantButton', function() {
        $(this).parent('div').toggleClass('importantData');
    });

    $('.commonAbbrCode').click(function(event) {
        event.preventDefault();
        let confirmReturnValue = confirm(app.countryAbbreviationCode);
        if(confirmReturnValue == false) {
            $('.commonAbbrCode').html(`
                <a href="https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes"><p>Whole List of Country Abbreviation Code</p></a>
            `);
            $('.commonAbbrCode').unbind('click');
        }
    }); 
});