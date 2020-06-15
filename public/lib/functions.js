/*
	 * Client MQTT
	 */
var mqtt;
var reconnectTimeout = 2000;
var host = "127.0.0.1";
var port = 1884;

function onConnect() {
    // MQTT Broker connection
    console.log("Connected");
    mqtt.subscribe("waitercaller/desk/#");
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
}

function MQTTConnect() {
    // Connect to MQTT Broker
    console.log("Connected to " + host + " " + port);
    mqtt = new Paho.MQTT.Client(host, port, "WebappClient"
        + parseInt(Math.random() * 1e5));
    var options = {
        userName: "agent",
        password: "agentagent",
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
    clock();
    MQTTConnect();
}