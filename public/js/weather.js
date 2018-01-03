
 $.ajax({
    url: "/weather",
    type: "GET",
    dataType: "json",
    success: function (rec) {
        if(!rec.err) {
            console.log('weather data is:');
            console.log(rec);
            let {location,weather,temperature} = rec.data;
            $("#location").html(location);
            $("#weather").html(weather);
            $("#temperature").html(temperature+"°C");
        }
        else {
            console.log(rec.err);
        }
    },
    err: function (err) {
        console.log("Get weather is error,because " + err);
    }
});