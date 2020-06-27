const express = require('express');
const app = express();

const mqttoptions = { username: 'agent', password: 'agent707' }

const mqtt = require('mqtt');
const mqttclient = mqtt.connect('mqtt://127.0.0.1:1883', mqttoptions);

var ledCountState = 0;

mqttclient.on('connect', function () {
  publishOnAllLeds('1');
  setTimeout(() => {
    publishOnAllLeds('0');
    mqttclient.subscribe('waitercaller/desk/#', function (err) {
      if (err) {
        console.log(err);
      }
    });
  }, 1000);
  
})

mqttclient.on('message', function (topic, message) {
  if (topic.startsWith('waitercaller/desk/')) {
    if (message == '1') {
      ledCountState++;
    }
    if (message == '0') {
      ledCountState--;
    }
    if (ledCountState > 0) {
      mqttclient.publish('waitercaller/hall', '1');
    } else {
      mqttclient.publish('waitercaller/hall', '0');
    }  
  }
})

function publishOnAllLeds(state) {
  mqttclient.publish('waitercaller/desk/1', state);
  mqttclient.publish('waitercaller/desk/2', state);
  mqttclient.publish('waitercaller/desk/3', state);
  mqttclient.publish('waitercaller/desk/4', state);
  mqttclient.publish('waitercaller/desk/5', state);
  mqttclient.publish('waitercaller/desk/6', state);
  mqttclient.publish('waitercaller/desk/7', state);
  mqttclient.publish('waitercaller/desk/8', state);
  mqttclient.publish('waitercaller/desk/9', state);
  mqttclient.publish('waitercaller/desk/10', state);
  mqttclient.publish('waitercaller/desk/11', state);
  mqttclient.publish('waitercaller/desk/12', state);
  mqttclient.publish('waitercaller/desk/13', state);
  mqttclient.publish('waitercaller/desk/14', state);
  mqttclient.publish('waitercaller/desk/15', state);
  mqttclient.publish('waitercaller/desk/16', state);
  mqttclient.publish('waitercaller/desk/17', state);
  mqttclient.publish('waitercaller/desk/18', state);
  mqttclient.publish('waitercaller/desk/19', state);
  mqttclient.publish('waitercaller/desk/20', state);
  mqttclient.publish('waitercaller/hall', state);
}

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/waitercaller', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(8080, function () {
  console.log('Waitercaller app listening on port 8080!');
});
