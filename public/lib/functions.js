/*
	 * Client MQTT
	 */
var mqtt;
var reconnectTimeout = 2000;
var host = "192.168.1.100";
var port = 1884;

function onConnect() {
    // MQTT Broker connection
    console.log("Connected");
    mqtt.subscribe("waitercaller/desk/#");
    mqtt.subscribe("waitercaller/weather/#");
}

function onError(message) {
    console.log("Error: " + message.errorCode + " " + message.errorMessage);
    setTimeout(MQTTConnect, reconnectTimeout);
}

function splashOff() {
    document.getElementById("start-page").style.display = "none";
}

function playBeep() {
    var beep = new Audio("audio/beep.ogg");
    beep.play();
}

function deskOn(deskNumber) {
    var desk = document.getElementById("desk" + deskNumber);
    desk.style.background = "rgb(175, 240, 90)";
    desk.style.animation = "blinkOrange 2s infinite";
    desk.style.animationDelay = "60s";
}

function deskOff(deskNumber) {
    var desk = document.getElementById("desk" + deskNumber);
    desk.style.animation = null;
    desk.style.background = "rgb(100, 100, 100)";
}

function screenNotify(deskNumber) {
    document.getElementById("desk-notification-number").innerHTML = deskNumber;
    document.getElementById("desk-notification").style.display = "table";
    setTimeout(() => { screenNotifyOff(); }, 3000);
}

function screenNotifyOff() {
    var notify = document.getElementById("desk-notification");
    notify.style.display = "none";
}

function weatherUpdate(weatherObj) {
    document.getElementById("weatherTableTemperatureValue").innerHTML = weatherObj.temperature;
    document.getElementById("weatherTableHumidityValue").innerHTML = weatherObj.humidity;
    document.getElementById("weatherTableAltitudeValue").innerHTML = weatherObj.altitude;    
}

function onMessageArrived(msg) {
    console
        .log("Message: " + msg.destinationName + "="
            + msg.payloadString);

    if (msg.destinationName.startsWith("waitercaller/desk/")) {
        var deskNumber = msg.destinationName.replace("waitercaller/desk/",
            "");
        console.log("deskNumber=" + deskNumber);

        if (msg.payloadString == 1) {
            playBeep();
            screenNotify(deskNumber);
            deskOn(deskNumber);
        } else {
            deskOff(deskNumber);
        }
    }

    if (msg.destinationName.startsWith("waitercaller/weather/")) {
        var weatherSensor = msg.destinationName.replace("waitercaller/weather/",
            "");
        console.log("weatherSensor=" + weatherSensor);

        let weatherJson = JSON.parse(msg.payloadString);

        weatherJson.temperature = (weatherJson.temperature | 0) + " ºC";
        weatherJson.humidity = (weatherJson.humidity | 0) + " %";
        weatherJson.altitude = (weatherJson.altitude | 0) + " m";        

        weatherUpdate(weatherJson);
    }
}

function MQTTConnect() {
    // Connect to MQTT Broker
    console.log("Connected to " + host + " " + port);
    mqtt = new Paho.MQTT.Client(host, port, "WebappClient"
        + parseInt(Math.random() * 1e5));
    var options = {
        userName: "agent",
        password: "agent707",
        timeout: 10,
        keepAliveInterval: 10,
        onSuccess: onConnect,
        onFailure: onError
    };
    mqtt.onMessageArrived = onMessageArrived;
    mqtt.onConnectionLost = onError;
    mqtt.connect(options);
}

function clock() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('txtClock').innerHTML =
        h + ":" + m + ":" + s;
    var t = setTimeout(clock, 500);
}
function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}

function start() {
    // document.getElementById('weather-panel').style.display = "none";
    clock();
    MQTTConnect();
}
