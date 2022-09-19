//jshint esversion:6

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/",function(req,res){
  let query = req.body.cityName;
  const apiKey = "2a2e7d6ff6b2c93da0d0710c6fdb6f75";
  const unit = "metric";
  const lang = "en";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query +"&units=" + unit + "&lang=" + lang + "&appid=" + apiKey;

  https.get(url,function(response){
    console.log(response.statusCode);
    
    response.on("data",function(data){
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const feel = weatherData.main.feels_like;
      const desc = weatherData.weather[0].description; 
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@4x.png";
      //res.write("<h1>The temperature in " + query + " is " + temp + " degrees Celcius.</h1>");
      query = query.toUpperCase();
      res.render('weather',{city : query,temperature : temp,explain : desc,image : imageURL});
      res.end();
    });
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000...");
});